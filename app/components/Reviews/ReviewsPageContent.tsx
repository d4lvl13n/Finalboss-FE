// app/components/Reviews/ReviewsPageContent.tsx
'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_REVIEWS } from '../../lib/queries/getReviews';
import client from '../../lib/apolloClient';
import { ResponsiveAd } from '../AdSense/AdBanner';
import '../../styles/ads.css';
import { SHOW_MANUAL_ADS } from '../../lib/adsConfig';
import PageHeader from '../PageHeader';
import ResponsiveArticleGrid from '../ResponsiveArticleGrid';

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
  author?: {
    node: {
      name: string;
      avatar?: {
        url: string;
      };
      description?: string;
    };
  };
  date: string;
  categories?: {
    nodes?: {
      name: string;
    }[];
  };
}

interface ReviewsPageContentProps {
  initialReviews: Review[];
  initialHasNextPage: boolean;
}

export default function ReviewsPageContent({
  initialReviews,
  initialHasNextPage,
}: ReviewsPageContentProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [afterCursor, setAfterCursor] = useState<string | null>(null);

  const { fetchMore } = useQuery(GET_REVIEWS, {
    variables: { first: 24, after: afterCursor },
    client,
    skip: true,
  });

  const handleLoadMore = async () => {
    try {
      const { data } = await fetchMore({
        variables: {
          after: afterCursor || initialReviews[initialReviews.length - 1]?.id,
        },
      });
      setReviews((prevReviews) => [...prevReviews, ...data.posts.nodes]);
      setHasNextPage(data.posts.pageInfo.hasNextPage);
      setAfterCursor(data.posts.pageInfo.endCursor);
    } catch (error) {
      console.error('Error fetching more reviews:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <PageHeader 
        title="Game Reviews" 
        description="In-depth reviews, honest verdicts, and ratings from the FinalBoss editorial team"
        accentColor="purple"
      />
      
      <div className="container mx-auto px-3 md:px-4 pb-8 md:pb-16">
        {/* 🎯 AD PLACEMENT: Reviews page header ad */}
        {SHOW_MANUAL_ADS && (
          <div className="reviews-ad-header mb-4 md:mb-6">
            <div className="ad-label">Advertisement</div>
            <ResponsiveAd adSlot="5844341661" />
          </div>
        )}
        
        <ResponsiveArticleGrid 
          articles={reviews} 
          basePath="/reviews"
          showFeatured={true}
          featuredCount={1}
        />

        {hasNextPage && (
          <div className="text-center mt-8 md:mt-12">
            <button
              onClick={handleLoadMore}
              className="inline-block bg-yellow-400 text-black font-bold py-2.5 md:py-3 px-6 md:px-8 rounded-full hover:bg-yellow-300 transition-colors text-sm md:text-base"
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
