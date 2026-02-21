import { Suspense } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { GameSearch } from '../components/GameSearch';
import GamesIndexClient from '../components/GamesIndexClient';
import { buildPageMetadata } from '../lib/seo';
import siteConfig from '../lib/siteConfig';
import client from '../lib/apolloClient';
import { GET_GAME_TAGS_FOR_INDEX } from '../lib/queries/gameQueries';

const GAME_INDEX_LIMIT = 60;

const baseUrl = siteConfig.url;

export async function generateMetadata() {
  return buildPageMetadata({
    title: `Game Database | ${siteConfig.name}`,
    description: 'Search and explore our comprehensive game database with ratings, release dates, and platform information.',
    path: '/games',
  });
}

export const revalidate = 3600;

async function fetchGameTagsForIndex() {
  try {
    const { data } = await client.query({
      query: GET_GAME_TAGS_FOR_INDEX,
      variables: { first: GAME_INDEX_LIMIT, after: null },
      fetchPolicy: 'no-cache',
    });
    return {
      nodes: data?.gameTags?.nodes ?? [],
      pageInfo: data?.gameTags?.pageInfo ?? { hasNextPage: false, endCursor: null },
    };
  } catch (error) {
    console.error('Failed to fetch game tags for index:', error);
    return {
      nodes: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
}

export default async function GamesPage() {
  const { nodes: gameTags, pageInfo } = await fetchGameTagsForIndex();
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900 py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-12">
            <h1 className="text-5xl font-bold text-yellow-400 mr-4">Game Database</h1>
            <div className="flex-grow h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full glow-effect"></div>
          </div>
          <Suspense
            fallback={
              <div className="h-48 bg-gray-800 rounded-2xl animate-pulse" />
            }
          >
            <GameSearch />
          </Suspense>

          <GamesIndexClient
            initialTags={gameTags}
            initialPageInfo={pageInfo}
            pageSize={GAME_INDEX_LIMIT}
          />
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
              { '@type': 'ListItem', position: 2, name: 'Game Database', item: `${baseUrl}/games` },
            ],
          }),
        }}
      />
      <Footer />
    </>
  );
}
