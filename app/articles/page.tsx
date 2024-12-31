import React, { Suspense } from 'react';
import { GET_ALL_POSTS } from '../lib/queries/getAllPosts';
import client from '../lib/apolloClient';
import dynamic from 'next/dynamic';
import Loader from '../components/Loader';

const AllArticlesPageContent = dynamic(() => import('../components/AllArticles/AllArticlesPageContent'), { ssr: false });

export async function generateMetadata() {
  return {
    title: 'All Articles | FinalBoss.io',
    description: 'Explore all our articles across various categories.',
  };
}

export default async function AllArticlesPage() {
  try {
    const { data, error } = await client.query({
      query: GET_ALL_POSTS,
      variables: { first: 24 },
    });

    if (error || !data?.posts?.nodes) {
      console.error('Error fetching articles:', error);
      return (
        <div className="min-h-screen bg-gray-900 text-white">
          <h1 className="text-3xl font-bold p-8">All Articles</h1>
          <p className="p-8">Loading articles...</p>
        </div>
      );
    }

    const articles = data.posts.nodes;
    const hasNextPage = data.posts.pageInfo?.hasNextPage || false;

    return (
      <Suspense fallback={<Loader />}>
        <AllArticlesPageContent initialArticles={articles} initialHasNextPage={hasNextPage} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in AllArticlesPage:', error);
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold p-8">All Articles</h1>
        <p className="p-8">Unable to load articles. Please try again later.</p>
      </div>
    );
  }
}