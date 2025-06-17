import React, { Suspense } from 'react';
import { GET_ALL_POSTS } from '../lib/queries/getAllPosts';
import client from '../lib/apolloClient';
import dynamic from 'next/dynamic';
import Loader from '../components/Loader';

const AllArticlesPageContent = dynamic(() => import('../components/AllArticles/AllArticlesPageContent'), { ssr: false });

// Force revalidation every 60 seconds
export const revalidate = 60;

// Opt out of static generation for development
export const runtime = process.env.NODE_ENV === 'development' ? 'edge' : 'nodejs';

export async function generateMetadata() {
  return {
    title: 'All Articles | FinalBoss.io',
    description: 'Explore all our articles across various categories.',
  };
}

export default async function AllArticlesPage() {
  let articles = [];
  let hasNextPage = false;
  let endCursor = null;

  try {
    const { data } = await client.query({
      query: GET_ALL_POSTS,
      variables: { first: 24 },
      fetchPolicy: 'network-only', // Always fetch fresh data
      context: {
        fetchOptions: {
          cache: 'no-store' // Disable HTTP caching
        }
      }
    });

    articles = data.posts.nodes;
    hasNextPage = data.posts.pageInfo.hasNextPage;
    endCursor = data.posts.pageInfo.endCursor;
  } catch (error) {
    console.error('Error fetching articles:', error);
    // Continue with empty articles array
  }

  return (
    <Suspense fallback={<Loader />}>
      <AllArticlesPageContent 
        initialArticles={articles} 
        initialHasNextPage={hasNextPage}
        initialEndCursor={endCursor}
      />
    </Suspense>
  );
}