// components/ReviewsSlider.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useQuery } from '@apollo/client';
import { GET_REVIEWS } from '../lib/queries/getReviews';
import client from '../lib/apolloClient';
import Loader from './Loader';
import { stripHtmlTags } from '../lib/utils/stripHtmlTags';

import 'swiper/css';
import 'swiper/css/pagination';

const ReviewsSlider = () => {
  const { data, loading, error } = useQuery(GET_REVIEWS, {
    variables: { first: 6 },
    client,
  });
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setReviews(data.posts.nodes);
    }
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <p>Error loading reviews...</p>;

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-yellow-400 mb-8">Reviews</h2>
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          pagination={{
            clickable: true,
            el: '.swiper-pagination-reviews',
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <Link
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
                  <h3 className="text-xl font-bold text-white mb-2">{review.title}</h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-pagination-reviews mt-4"></div>
        <div className="text-center mt-12">
          <Link href="/reviews" className="inline-block bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors">
            <span>View More Reviews</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSlider;
