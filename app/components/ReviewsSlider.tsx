// components/ReviewsSlider.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const reviews = [
  {
    id: 1,
    title: "Elden Ring",
    image: "/images/elden-ring-review.jpg",
    excerpt: "A masterpiece of open-world design",
    score: 5,
    slug: "elden-ring-review"
  },
  {
    id: 2,
    title: "Baldur's Gate 3",
    image: "/images/baldurs-gate-3-review.jpg",
    excerpt: "The new gold standard for CRPGs",
    score: 5,
    slug: "baldurs-gate-3-review"
  },
  {
    id: 3,
    title: "Starfield",
    image: "/images/starfield-review.jpg",
    excerpt: "A vast universe with endless possibilities",
    score: 4,
    slug: "starfield-review"
  },
  {
    id: 4,
    title: "Final Fantasy XVI",
    image: "/images/ff16-review.jpg",
    excerpt: "A bold new direction for the series",
    score: 4,
    slug: "final-fantasy-16-review"
  },
  {
    id: 5,
    title: "Zelda: Tears of the Kingdom",
    image: "/images/zelda-totk-review.jpg",
    excerpt: "Pushing the boundaries of open-world games",
    score: 5,
    slug: "zelda-tears-of-the-kingdom-review"
  }
];

const ReviewsSlider = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-yellow-400 mb-8">Reviews</h2>
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          pagination={{
            clickable: true,
            el: '.swiper-pagination-reviews', // Targeting a unique custom pagination container
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <Link 
                href={`/review/${review.slug}`}
                className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative h-48">
                  <Image src={review.image} layout="fill" objectFit="cover" alt={review.title} />
                  <div className="absolute top-2 right-2 bg-yellow-400 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center">
                    {review.score}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{review.title}</h3>
                  <p className="text-gray-400">{review.excerpt}</p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-pagination-reviews mt-4"></div> {/* Custom pagination container */}
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