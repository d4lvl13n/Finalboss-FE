import React, { Suspense } from 'react';
import { GET_TECH_ARTICLES } from '../lib/queries/getTechArticles';
import client from '../lib/apolloClient';
import dynamic from 'next/dynamic';
import Loader from '../components/Loader';

const TechnologyPageContent = dynamic(() => import('../components/TechnologyPageContent'), { ssr: false });
const TechnologyStructuredData = dynamic(() => import('../components/TechnologyStructuredData'), { ssr: false });

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
  categories?: {
    nodes?: {
      name: string;
    }[];
  };
}

export async function generateMetadata() {
  return {
    title: 'Gaming Technology Articles | Your Site Name',
    description: 'Explore the latest in gaming technology, hardware reviews, and tech trends in the gaming industry.',
  };
}

export default async function TechnologyPage() {
  const { data } = await client.query({
    query: GET_TECH_ARTICLES,
    variables: { limit: 24, after: null },
  });

  const articles = data.posts.nodes;
  const hasNextPage = data.posts.pageInfo.hasNextPage;

  return (
    <Suspense fallback={<Loader />}>
      <TechnologyStructuredData articles={articles} />
      <TechnologyPageContent initialArticles={articles} initialHasNextPage={hasNextPage} />
    </Suspense>
  );
}
