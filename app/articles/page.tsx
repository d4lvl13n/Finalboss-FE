import React, { Suspense } from 'react';
import Link from 'next/link';
import { GET_ALL_POSTS } from '../lib/queries/getAllPosts';
import client from '../lib/apolloClient';
import dynamic from 'next/dynamic';
import { buildPageMetadata } from '../lib/seo';

const AllArticlesPageContent = dynamic(() => import('../components/AllArticles/AllArticlesPageContent'), { ssr: false });
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io';
const PAGE_SIZE = 24;

interface ArticleListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
}

// Force revalidation every 60 seconds
export const revalidate = 60;

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'All Articles | FinalBoss.io',
    description: 'Explore every article across news, reviews, guides, and technology.',
    path: '/articles',
  });
}

export default async function AllArticlesPage() {
  let articles: ArticleListItem[] = [];
  let hasNextPage = false;
  let endCursor = null;
  let totalCount = 0;

  try {
    const { data } = await client.query({
      query: GET_ALL_POSTS,
      variables: { first: 24 },
      fetchPolicy: 'no-cache',
    });

    console.log('Articles page data:', JSON.stringify(data, null, 2));

    if (data?.posts?.nodes) {
      articles = data.posts.nodes;
      hasNextPage = data.posts.pageInfo?.hasNextPage || false;
      endCursor = data.posts.pageInfo?.endCursor || null;
      totalCount = data.posts.pageInfo?.offsetPagination?.total ?? articles.length;
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
    // Continue with empty articles array
  }

  const collectionStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All Articles',
    description: 'Explore every article across news, reviews, guides, and technology.',
    url: `${baseUrl}/articles`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articles.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Article',
          name: article.title,
          url: `${baseUrl}/${article.slug}`,
        },
      })),
    },
  };
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Articles',
        item: `${baseUrl}/articles`,
      },
    ],
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <>
      <Suspense
        fallback={
          <section className="py-24 bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="h-12 w-64 bg-gray-800 animate-pulse mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="h-64 bg-gray-800 animate-pulse rounded-xl" />
                ))}
              </div>
            </div>
          </section>
        }
      >
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionStructuredData) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
          />
          <AllArticlesPageContent 
            initialArticles={articles} 
            initialHasNextPage={hasNextPage}
            initialEndCursor={endCursor}
          />
        </>
      </Suspense>
      {totalPages > 1 && (
        <div className="text-center mt-12">
          <Link
            href="/articles/page/2"
            className="inline-flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-full hover:bg-yellow-300 transition-colors"
          >
            Browse older articles →
          </Link>
        </div>
      )}
    </>
  );
}