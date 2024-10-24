'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GET_LATEST_GUIDES } from '../lib/queries/getLatestGuides';
import client from '../lib/apolloClient';
import Loader from './Loader';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

interface GuideArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
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

const GuidesSection = () => {
  const { data, loading, error } = useQuery(GET_LATEST_GUIDES, {
    variables: { first: 6 },
    client,
  });
  const [guides, setGuides] = useState<GuideArticle[]>([]);

  useEffect(() => {
    if (data) {
      setGuides(data.posts.nodes);
    }
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <p>Error loading guides...</p>;

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-12">
          <h2 className="text-4xl font-bold text-yellow-400 mr-4">Game Guides</h2>
          <div className="flex-grow h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full glow-effect"></div>
          <Link href="/guides" className="ml-4 bg-yellow-400 text-black p-2 rounded-full hover:bg-yellow-300 transition-colors">
            <FaArrowRight />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group h-64 overflow-hidden rounded-lg"
            >
              <Link href={`/${guide.slug}`} className="block h-full">
                <Image
                  src={guide.featuredImage?.node.sourceUrl || '/images/placeholder.png'}
                  alt={guide.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
                <div className="absolute top-4 right-4 z-10">
                  {guide.categories?.nodes?.[0] && (
                    <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                      {guide.categories.nodes[0].name}
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {guide.title}
                  </h3>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4" dangerouslySetInnerHTML={{ __html: guide.excerpt }} />
                  <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded hover:bg-yellow-300 transition-colors">
                    Read Guide
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

export default GuidesSection;
