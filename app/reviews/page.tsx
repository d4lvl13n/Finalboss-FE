// app/reviews/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GET_REVIEWS } from '../lib/queries/getReviews';
import client from '../lib/apolloClient';
import Loader from '../components/Loader';

const ReviewsPage = () => {
  const [afterCursor, setAfterCursor] = useState<string | null>(null);
  const [allReviews, setAllReviews] = useState<any[]>([]);

  const { data, loading, error, fetchMore } = useQuery(GET_REVIEWS, {
    variables: { first: 24, after: afterCursor },
    client,
    onCompleted: (data) => {
      setAllReviews((prevReviews) => [...prevReviews, ...data.posts.nodes]);
    },
  });

  if (loading && allReviews.length === 0) {
    return <Loader />;
  }

  if (error) {
    return <p>Error loading reviews...</p>;
  }

  const handleLoadMore = () => {
    if (data?.posts.pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          after: data.posts.pageInfo.endCursor,
        },
      }).then((fetchMoreResult) => {
        setAfterCursor(fetchMoreResult.data.posts.pageInfo.endCursor);
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-8 text-yellow-400">Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allReviews.map((review) => (
          <Link
            key={review.id}
            href={`/reviews/${review.slug}`}
            className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="relative h-48">
              {review.featuredImage && (
                <Image
                  src={review.featuredImage.node.sourceUrl}
                  layout="fill"
                  objectFit="cover"
                  alt={review.title}
                />
              )}
              <div className="absolute top-2 right-2 bg-yellow-400 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center">
                {/* Placeholder for review score */}
                {"N/A"}
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold text-white mb-2">{review.title}</h2>
            </div>
          </Link>
        ))}
      </div>

      {data?.posts.pageInfo.hasNextPage && (
        <div className="text-center mt-12">
          <button
            onClick={handleLoadMore}
            className="inline-block bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors"
          >
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
