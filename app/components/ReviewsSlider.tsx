// components/ReviewsSlider.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GET_REVIEWS } from '../lib/queries/getReviews';
import client from '../lib/apolloClient';
import Loader from './Loader';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const ReviewsSlider = () => {
  const { data, loading, error } = useQuery(GET_REVIEWS, {
    variables: { first: 7 },
    client,
  });
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (data && data.posts && data.posts.nodes) {
      setReviews(data.posts.nodes);
    }
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <p>Error loading reviews...</p>;
  if (reviews.length === 0) return <p>No reviews available.</p>;

  const latestReview = reviews[0];
  const otherReviews = reviews.slice(1);

  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-12">
          <h2 className="text-4xl font-bold text-yellow-400 mr-4">Reviews</h2>
          <div className="flex-grow h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full glow-effect"></div>
          <Link href="/reviews" className="ml-4 bg-yellow-400 text-black p-2 rounded-full hover:bg-yellow-300 transition-colors">
            <FaArrowRight />
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Latest Review */}
          {latestReview && (
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative group h-[500px] overflow-hidden rounded-lg"
              >
                <Link href={`/${latestReview.slug}`} className="block h-full">
                  {latestReview.featuredImage && latestReview.featuredImage.node && (
                    <Image
                      src={latestReview.featuredImage.node.sourceUrl}
                      alt={latestReview.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-3xl font-bold text-white mb-2">{latestReview.title}</h3>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-6">
                    <h3 className="text-3xl font-bold text-white mb-2">{latestReview.title}</h3>
                    {latestReview.excerpt && (
                      <p className="text-gray-300 mb-4" dangerouslySetInnerHTML={{ __html: latestReview.excerpt }} />
                    )}
                    <span className="inline-block bg-yellow-400 text-black text-ls font-bold px-2 py-1 rounded hover:bg-yellow-300 transition-colors">
                      Read Full Review
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                    {latestReview.categories?.nodes?.[0] && (
                      <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                        {latestReview.categories.nodes[0].name}
                      </span>
                    )}
                    {latestReview.author?.node && (
                      <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                        {latestReview.author.node.avatar?.url && (
                          <Image
                            src={latestReview.author.node.avatar.url}
                            alt={latestReview.author.node.name}
                            width={16}
                            height={16}
                            className="rounded-full"
                          />
                        )}
                        {latestReview.author.node.name}
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            </div>
          )}

          {/* Other Reviews */}
          <div className="lg:w-1/2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group h-48 overflow-hidden rounded-lg"
                >
                  <Link href={`/${review.slug}`} className="block h-full">
                    {review.featuredImage && review.featuredImage.node && (
                      <Image
                        src={review.featuredImage.node.sourceUrl}
                        alt={review.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <h3 className="text-lg font-bold text-white mb-2">{review.title}</h3>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-4">
                      
                      <span className="inline-block bg-yellow-400 text-black text-sm font-bold px-2 py-1 rounded hover:bg-yellow-300 transition-colors">
                        Read Review
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSlider;
