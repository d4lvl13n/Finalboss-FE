import React, { Suspense } from 'react';
import { GET_GAMING_POSTS } from '../lib/queries/getGamingPosts';
import client from '../lib/apolloClient';
import dynamic from 'next/dynamic';
import Loader from '../components/Loader';

const GamingPageContent = dynamic(() => import('../components/Gaming/GamingPageContent'), { ssr: false });
const GamingStructuredData = dynamic(() => import('../components/Gaming/GamingStructuredData'), { ssr: false });

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
    title: 'Gaming News and Articles | Your Site Name',
    description: 'Stay updated with the latest gaming news, reviews, and in-depth articles about your favorite games.',
  };
}

export default async function GamingPage() {
  try {
    const { data, error } = await client.query({
      query: GET_GAMING_POSTS,
      variables: { first: 24, after: null },
    });

    if (error || !data?.posts?.nodes) {
      console.error('Error fetching gaming posts:', error);
      // Return a fallback UI
      return (
        <div className="min-h-screen bg-gray-900 text-white">
          <h1 className="text-3xl font-bold p-8">Gaming News</h1>
          <p className="p-8">Loading latest gaming news...</p>
        </div>
      );
    }

    const articles = data.posts.nodes;
    const hasNextPage = data.posts.pageInfo?.hasNextPage || false;

    return (
      <Suspense fallback={<Loader />}>
        <GamingStructuredData articles={articles} />
        <GamingPageContent initialArticles={articles} initialHasNextPage={hasNextPage} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in GamingPage:', error);
    // Return error UI
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold p-8">Gaming News</h1>
        <p className="p-8">Unable to load gaming news. Please try again later.</p>
      </div>
    );
  }
}
