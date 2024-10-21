'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { GET_REVIEWS } from '../../lib/queries/getReviews';
import client from '../../lib/apolloClient';

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

interface ReviewsPageContentProps {
  initialReviews: Review[];
  initialHasNextPage: boolean;
}

export default function ReviewsPageContent({ initialReviews, initialHasNextPage }: ReviewsPageContentProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [afterCursor, setAfterCursor] = useState<string | null>(null);

  const { data, loading, error, fetchMore } = useQuery(GET_REVIEWS, {
    variables: { first: 24, after: afterCursor },
    client,
    skip: !afterCursor,
  });

  useEffect(() => {
    if (data) {
      setReviews((prevReviews) => [...prevReviews, ...data.posts.nodes]);
      setHasNextPage(data.posts.pageInfo.hasNextPage);
    }
  }, [data]);

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchMore({
        variables: {
          after: afterCursor || data?.posts.pageInfo.endCursor,
        },
      }).then((fetchMoreResult) => {
        setAfterCursor(fetchMoreResult.data.posts.pageInfo.endCursor);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-12">
          <h1 className="text-5xl font-bold text-yellow-400 mr-4">Game Reviews</h1>
          <div className="flex-grow h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full glow-effect"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group h-64 overflow-hidden rounded-lg"
            >
              <Link href={`/reviews/${review.slug}`} className="block h-full">
                <Image
                  src={review.featuredImage?.node.sourceUrl || '/images/placeholder.png'}
                  alt={review.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {review.title}
                  </h3>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {review.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4" dangerouslySetInnerHTML={{ __html: review.excerpt }} />
                  <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded hover:bg-yellow-300 transition-colors">
                    Read Review
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {hasNextPage && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              className="inline-block bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More Reviews'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}