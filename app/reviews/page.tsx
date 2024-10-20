import React, { Suspense } from 'react';
import { GET_REVIEWS } from '../lib/queries/getReviews';
import client from '../lib/apolloClient';
import dynamic from 'next/dynamic';
import Loader from '../components/Loader';

const ReviewsPageContent = dynamic(() => import('../components/Reviews/ReviewsPageContent'), { ssr: false });
const ReviewsStructuredData = dynamic(() => import('../components/Reviews/ReviewsStructuredData'), { ssr: false });

interface Review {
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

export async function generateMetadata() {
  return {
    title: 'Game Reviews | Your Site Name',
    description: 'Read our latest game reviews and ratings for the hottest new releases.',
  };
}

export default async function ReviewsPage() {
  const { data } = await client.query({
    query: GET_REVIEWS,
    variables: { first: 24, after: null },
  });

  const reviews = data.posts.nodes;
  const hasNextPage = data.posts.pageInfo.hasNextPage;

  return (
    <Suspense fallback={<Loader />}>
      <ReviewsStructuredData reviews={reviews} />
      <ReviewsPageContent initialReviews={reviews} initialHasNextPage={hasNextPage} />
    </Suspense>
  );
}