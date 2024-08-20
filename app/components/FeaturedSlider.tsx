'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { GET_FEATURED_POSTS } from '../lib/queries/getFeaturedPosts';
import client from '../lib/apolloClient'; // Import Apollo client
import Loader from './Loader'; // Assuming you have a Loader component

export default function FeaturedSlider() {
  const { data, loading, error } = useQuery(GET_FEATURED_POSTS, {
    variables: { first: 3 }, // Fetch the latest 3 posts
    client,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredArticles, setFeaturedArticles] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setFeaturedArticles(data.posts.nodes);
    }
  }, [data]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredArticles.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredArticles]);

  if (loading) return <Loader />;
  if (error) return <p>Error loading featured posts...</p>;

  return (
    <div className="relative w-full h-[70vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[90vh] overflow-hidden">
      <AnimatePresence initial={false}>
        {featuredArticles.length > 0 && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute w-full h-full z-10"
          >
            <div className="relative w-full h-full">
              {featuredArticles[currentIndex].featuredImage && (
                <Image
                  src={featuredArticles[currentIndex].featuredImage.node.sourceUrl}
                  alt={featuredArticles[currentIndex].title}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  className="absolute inset-0"
                />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black flex flex-col justify-end p-8 z-20">
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-6xl font-extrabold text-white mb-4 neon-text-yellow"
              >
                {featuredArticles[currentIndex].title}
              </motion.h1>
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl text-gray-300 neon-text-yellow"
              >
                {featuredArticles[currentIndex].excerpt}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slider Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-30">
        {featuredArticles.map((_, index) => (
          <motion.button
            key={index}
            className={`w-4 h-4 rounded-full transition-colors ${
              index === currentIndex ? 'bg-[#ffbb1a] shadow-lg' : 'bg-gray-500'
            }`}
            onClick={() => setCurrentIndex(index)}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </div>
  );
}
