'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useQuery } from '@apollo/client';
import { GET_TECH_ARTICLES } from '../lib/queries/getTechArticles';
import client from '../lib/apolloClient';
import Loader from './Loader';

import 'swiper/css';
import 'swiper/css/pagination';

// Define the Article interface
interface Article {
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

const TechnologySection = () => {
  const { data, loading, error } = useQuery(GET_TECH_ARTICLES, {
    variables: { limit: 10 },
    client, // Explicitly pass the Apollo client
  });
  
  const [technologyArticles, setTechnologyArticles] = useState<Article[]>([]); // Explicitly define the type here

  useEffect(() => {
    if (data) {
      setTechnologyArticles(data.posts.nodes);
    }
  }, [data]);

  if (loading) return <Loader />;
  
  // Updated to log any errors to the console for debugging
  if (error) {
    console.error('Error fetching technology articles:', error);
    return <p>Error loading technology articles...</p>;
  }

  if (!data?.posts?.nodes?.length) {
    return <p>No technology articles found.</p>; // Add a fallback in case there are no articles
  }

  return (
    <section className="py-16 bg-gray-900">
      <h2 className="text-4xl font-bold text-yellow-400 mb-8">Technology</h2>
      <div className="container mx-auto px-4">
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          pagination={{
            clickable: true,
            el: '.swiper-pagination-custom',
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {technologyArticles.map((article) => (
            <SwiperSlide key={article.id}>
              <Link 
                href={`/technology/${article.slug}`}
                className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative h-48">
                  {article.featuredImage && (
                    <Image
                      src={article.featuredImage.node.sourceUrl}
                      layout="fill"
                      objectFit="cover"
                      alt={article.title}
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-pagination-custom mt-4"></div>
        <div className="text-center mt-12">
          <Link href="/technology" className="inline-block bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors">
            <span>View More Technology</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
