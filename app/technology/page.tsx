import React, { Suspense } from 'react';
import { GET_TECH_ARTICLES } from '../lib/queries/getTechArticles';
import client from '../lib/apolloClient';
import dynamic from 'next/dynamic';
import { buildPageMetadata } from '../lib/seo';

const TechnologyPageContent = dynamic(() => import('../components/TechnologyPageContent'), { ssr: false });
const TechnologyStructuredData = dynamic(() => import('../components/TechnologyStructuredData'), { ssr: false });

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'Gaming & Tech Articles | FinalBoss.io',
    description: 'Explore the latest in gaming technology, hardware reviews, and industry innovation.',
    path: '/technology',
  });
}

export default async function TechnologyPage() {
  const { data } = await client.query({
    query: GET_TECH_ARTICLES,
    variables: { first: 24, after: null },
  });

  const articles = data.posts.nodes;
  const hasNextPage = data.posts.pageInfo.hasNextPage;

  return (
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
      <TechnologyStructuredData articles={articles} />
      <TechnologyPageContent initialArticles={articles} initialHasNextPage={hasNextPage} />
    </Suspense>
  );
}
