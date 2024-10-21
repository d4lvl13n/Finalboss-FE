import React, { Suspense } from 'react';
import { GET_ALL_POSTS } from '../lib/queries/getAllPosts';
import client from '../lib/apolloClient';
import dynamic from 'next/dynamic';
import Loader from '../components/Loader';

const AllArticlesPageContent = dynamic(() => import('../components/AllArticles/AllArticlesPageContent'), { ssr: false });

export async function generateMetadata() {
  return {
    title: 'All Articles | Your Site Name',
    description: 'Explore all our articles across various categories.',
  };
}

export default async function AllArticlesPage() {
  const { data } = await client.query({
    query: GET_ALL_POSTS,
    variables: { first: 24 }, // Adjust this number as needed
  });

  const articles = data.posts.nodes;
  const hasNextPage = data.posts.pageInfo.hasNextPage;

  return (
    <Suspense fallback={<Loader />}>
      <AllArticlesPageContent initialArticles={articles} initialHasNextPage={hasNextPage} />
    </Suspense>
  );
}