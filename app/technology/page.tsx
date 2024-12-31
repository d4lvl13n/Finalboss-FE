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
    title: 'Gaming & Tech Articles | FinalBoss.io',
    description: 'Explore the latest in gaming technology, hardware reviews, and tech trends in the gaming industry.',
  };
}

export default async function TechnologyPage() {
  try {
    const { data, error } = await client.query({
      query: GET_TECH_ARTICLES,
      variables: { first: 24, after: null },
    });

    if (error || !data?.posts?.nodes) {
      console.error('Error fetching tech articles:', error);
      return (
        <div className="min-h-screen bg-gray-900 text-white">
          <h1 className="text-3xl font-bold p-8">Technology Articles</h1>
          <p className="p-8">Loading technology articles...</p>
        </div>
      );
    }

    const articles = data.posts.nodes;
    const hasNextPage = data.posts.pageInfo?.hasNextPage || false;

    return (
      <Suspense fallback={<Loader />}>
        <TechnologyStructuredData articles={articles} />
        <TechnologyPageContent initialArticles={articles} initialHasNextPage={hasNextPage} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in TechnologyPage:', error);
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold p-8">Technology Articles</h1>
        <p className="p-8">Unable to load articles. Please try again later.</p>
      </div>
    );
  }
}
