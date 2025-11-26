import React, { Suspense } from 'react';
import { GET_GAMING_POSTS } from '../lib/queries/getGamingPosts';
import client from '../lib/apolloClient';
import dynamic from 'next/dynamic';
import { buildPageMetadata } from '../lib/seo';
import Header from '../components/Header';
import Footer from '../components/Footer';

const GamingPageContent = dynamic(() => import('../components/Gaming/GamingPageContent'), { ssr: false });
const GamingStructuredData = dynamic(() => import('../components/Gaming/GamingStructuredData'), { ssr: false });

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'Gaming News and Articles | FinalBoss.io',
    description: 'Stay updated with the latest gaming news, releases, esports, and community stories.',
    path: '/gaming',
  });
}

export default async function GamingPage() {
  let articles = [];
  let hasNextPage = false;

  try {
    const { data } = await client.query({
      query: GET_GAMING_POSTS,
      variables: { first: 24, after: null },
    });

    articles = data?.posts?.nodes || [];
    hasNextPage = data?.posts?.pageInfo?.hasNextPage || false;
  } catch (error) {
    console.error('Error fetching gaming posts:', error);
  }

  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <GamingStructuredData articles={articles} />
        <GamingPageContent initialArticles={articles} initialHasNextPage={hasNextPage} />
      </Suspense>
      <Footer />
    </>
  );
}

export const revalidate = 3600; // Revalidate every hour
