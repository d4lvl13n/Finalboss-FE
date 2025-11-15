// components/LatestArticles.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GET_LATEST_POSTS } from '../lib/queries/getLatestPosts';
import client from '../lib/apolloClient';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { PLACEHOLDER_BASE64 } from '../utils/placeholder';

// Define the Article interface
interface Article {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  categories?: {
    nodes?: {
      name: string;
    }[];
  };
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
}

const LatestArticles = () => {
  const { loading, error, data } = useQuery(GET_LATEST_POSTS, {
    variables: { first: 6 },
    client,
  });
  
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (data) {
      setArticles(data.posts.nodes);
    }
  }, [data]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="h-12 w-64 bg-gray-800 animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-64 bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }
  if (error) return <p>Error loading latest articles...</p>;

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-12">
          <h2 className="text-4xl font-bold text-yellow-400 mr-4">Latest Articles</h2>
          <div className="flex-grow h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full glow-effect"></div>
          <Link
            href="/articles"
            className="ml-4 bg-yellow-400 text-black p-2 rounded-full hover:bg-yellow-300 transition-colors"
            aria-label="Browse all articles"
            title="Browse all articles"
          >
            <FaArrowRight aria-hidden="true" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
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
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  placeholder="blur"
                  blurDataURL={PLACEHOLDER_BASE64}
                  priority={index === 0}
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
                <div className="absolute top-4 right-4 z-10">
                  {article.categories?.nodes?.[0] && (
                    <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                      {article.categories.nodes[0].name}
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
                  <span className="inline-block bg-yellow-400 text-black font-bold px-2 py-1 rounded hover:bg-yellow-300 transition-colors">
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
};

export default LatestArticles;
