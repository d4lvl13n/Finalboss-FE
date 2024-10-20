'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { GET_FEATURED_POSTS } from '../lib/queries/getFeaturedPosts';
import client from '../lib/apolloClient';
import Loader from './Loader';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function FeaturedSlider() {
  const { data, loading, error } = useQuery(GET_FEATURED_POSTS, {
    variables: { first: 5 },
    client,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredArticles, setFeaturedArticles] = useState<any[]>([]);
  const [direction, setDirection] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data) {
      setFeaturedArticles(data.posts.nodes);
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [featuredArticles.length]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
  };

  if (loading) return <Loader />;
  if (error) return <p>Error loading featured posts...</p>;

  return (
    <div ref={sliderRef} className="relative w-full h-[90vh] overflow-hidden bg-gray-900">
      <AnimatePresence initial={false} custom={direction}>
        {featuredArticles.length > 0 && (
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 1000 : -1000 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -1000 : 1000 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute w-full h-full"
          >
            <div className="relative w-full h-full">
              {featuredArticles[currentIndex].featuredImage && (
                <Image
                  src={featuredArticles[currentIndex].featuredImage.node.sourceUrl}
                  alt={featuredArticles[currentIndex].title}
                  layout="fill"
                  objectFit="cover"
                  className="brightness-50"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70" />
              <div className="absolute inset-0 flex flex-col justify-end p-12 z-10">
                <motion.h1
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-6xl font-extrabold text-white mb-4 leading-tight"
                >
                  {featuredArticles[currentIndex].title}
                </motion.h1>
                <motion.p
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl text-gray-300 mb-8"
                  dangerouslySetInnerHTML={{ __html: featuredArticles[currentIndex].excerpt }}
                />
                <motion.button
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors w-max"
                >
                  Read More
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
      >
        <FaChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
      >
        <FaChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredArticles.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-yellow-400' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
