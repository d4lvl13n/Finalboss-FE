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
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

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
  categories?: {
    nodes?: {
      name: string;
    }[];
  };
  author?: {
    node: {
      name: string;
      avatar?: {
        url: string;
      };
    };
  };
}

const TechnologySection = () => {
  const { data, loading, error } = useQuery(GET_TECH_ARTICLES, {
    variables: { first: 6 },  // Changed from limit to first
    client,
  });
  
  const [technologyArticles, setTechnologyArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (data) {
      setTechnologyArticles(data.posts.nodes);
    }
  }, [data]);

  if (loading) return <Loader />;
  if (error) {
    console.error('Error fetching technology articles:', error);
    return <p>Error loading technology articles...</p>;
  }

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-12">
          <h2 className="text-4xl font-bold text-yellow-400 mr-4">Gaming Technology</h2>
          <div className="flex-grow h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full glow-effect"></div>
          <Link href="/technology" className="ml-4 bg-yellow-400 text-black p-2 rounded-full hover:bg-yellow-300 transition-colors">
            <FaArrowRight />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technologyArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group h-64 overflow-hidden rounded-lg"
            >
              <Link href={`/${article.slug}`} className="block h-full">
                <Image
                  src={article.featuredImage?.node.sourceUrl || '/images/placeholder.png'}
                  alt={article.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  {article.categories?.nodes?.[0] && (
                    <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                      {article.categories.nodes[0].name}
                    </span>
                  )}
                  {article.author?.node && (
                    <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                      {article.author.node.avatar?.url && (
                        <Image
                          src={article.author.node.avatar.url}
                          alt={article.author.node.name}
                          width={16}
                          height={16}
                          className="rounded-full"
                        />
                      )}
                      {article.author.node.name}
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {article.title}
                  </h3>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4" dangerouslySetInnerHTML={{ __html: article.excerpt }} />
                  <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded hover:bg-yellow-300 transition-colors">
                    Read More
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TechnologySection;
