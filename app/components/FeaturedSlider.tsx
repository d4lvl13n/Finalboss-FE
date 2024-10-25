'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { GET_FEATURED_POSTS } from '../lib/queries/getFeaturedPosts';
import client from '../lib/apolloClient';
import Loader from './Loader';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import { useMediaQuery } from 'react-responsive';
import { useSwipeable, SwipeEventData } from 'react-swipeable';

// Define interfaces for our data structure
interface FeaturedImage {
  node: {
    sourceUrl: string;
  };
}

interface Category {
  nodes: {
    name: string;
  }[];
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: FeaturedImage;
  categories?: Category;
}

// Add these interfaces at the top of the file
interface Post {
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
    nodes: {
      name: string;
    }[];
  };
}

interface FeaturedSliderProps {
  posts: Post[];
}

// Slide transition variants for desktop
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

// Mobile slide variants (vertical sliding)
const mobileSlideVariants = {
  enter: {
    y: 50,
    opacity: 0
  },
  center: {
    y: 0,
    opacity: 1
  },
  exit: {
    y: -50,
    opacity: 0
  }
};

// Add this component at the top of the file
const SkeletonSlide = () => (
  <div className="absolute inset-0 bg-gray-800 animate-pulse">
    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent">
      <div className="p-12">
        <div className="w-24 h-8 bg-gray-700 rounded-full mb-4" />
        <div className="w-2/3 h-12 bg-gray-700 rounded mb-4" />
        <div className="w-1/2 h-8 bg-gray-700 rounded mb-6" />
        <div className="w-32 h-10 bg-gray-700 rounded-full" />
      </div>
    </div>
  </div>
);

// Update the component definition to accept props
export default function FeaturedSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true); // Add this state
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Restore Apollo query
  const { data, loading, error, refetch } = useQuery(GET_FEATURED_POSTS, {
    variables: { first: 5 },
    client,
  });

  const featuredArticles: Article[] = data?.posts?.nodes || [];

  // Navigation handlers - define these only once
  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
    setProgress(0);
  };

  // Swipe handlers - define only once
  const swipeHandlers = useSwipeable({
    onSwipedLeft: (eventData: SwipeEventData) => handleNext(),
    onSwipedRight: (eventData: SwipeEventData) => handlePrev(),
    preventScrollOnSwipe: true,
    trackTouch: true,
    delta: 10,
    swipeDuration: 500,
    touchEventOptions: { passive: false }
  });

  // Add keyboard navigation
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  // Progress bar animation
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 0.5 : prev));
    }, 35);

    return () => clearInterval(progressInterval);
  }, [currentIndex]);

  // Error handling
  if (error) return (
    <div className="relative w-full h-[60vh] bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white mb-4">Failed to load featured articles</p>
        <button
          onClick={() => refetch()}
          className="bg-yellow-400 text-black font-bold py-2 px-6 rounded-full hover:bg-yellow-300 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // Loading state
  if (loading) return <SkeletonSlide />;

  return (
    <div 
      role="region"
      aria-label="Featured articles slider"
      className="relative w-full bg-gray-900"
    >
      {/* Dynamic height based on device */}
      <div className={`relative w-full ${isMobile ? 'h-[60vh]' : 'h-[80vh]'} overflow-hidden`}>
        <AnimatePresence initial={false} custom={direction}>
          {featuredArticles.length > 0 && (
            <motion.div
              {...swipeHandlers}
              key={currentIndex}
              custom={direction}
              variants={isMobile ? mobileSlideVariants : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full h-full"
            >
              {/* Image with blur placeholder */}
              <div className="relative w-full h-full">
                <Image
                  src={featuredArticles[currentIndex].featuredImage?.node.sourceUrl || '/images/placeholder.jpg'}
                  alt={featuredArticles[currentIndex].title}
                  fill
                  priority={currentIndex === 0}
                  sizes="100vw"
                  quality={90}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyVC0zLyAvLTMpP0E6OjpBKTMtRktbYWFhY25xc3KLjpOPgZGBgWH/2wBDAR"
                  className="object-cover brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 z-10">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-4xl"
                >
                  {/* Category tag */}
                  {featuredArticles[currentIndex].categories?.nodes?.[0] && (
                    <span className="inline-block bg-yellow-400 text-black text-sm font-bold px-3 py-1 rounded-full mb-4">
                      {featuredArticles[currentIndex].categories.nodes[0].name}
                    </span>
                  )}

                  {/* Title */}
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    {featuredArticles[currentIndex].title}
                  </h1>

                  {/* Excerpt - Hidden on mobile */}
                  <div className="hidden md:block">
                    <p className="text-lg md:text-xl text-gray-300 mb-6"
                       dangerouslySetInnerHTML={{ __html: featuredArticles[currentIndex].excerpt }}
                    />
                  </div>

                  {/* CTA Button */}
                  <Link href={`/${featuredArticles[currentIndex].slug}`}>
                    <button className="bg-yellow-400 text-black font-bold py-2 px-6 md:py-3 md:px-8 rounded-full hover:bg-yellow-300 transition-colors">
                      Read More
                    </button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
          <motion.div
            className="h-full bg-yellow-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Navigation buttons - Hidden on mobile */}
        <div className="hidden md:block">
          <button
            aria-label="Previous slide"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/75 transition-all"
          >
            <FaChevronLeft size={24} />
          </button>
          <button
            aria-label="Next slide"
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/75 transition-all"
          >
            <FaChevronRight size={24} />
          </button>
        </div>

        {/* Slide indicators */}
        <div role="tablist" aria-label="Slide indicators">
          {featuredArticles.map((_, index: number) => (
            <button
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setProgress(0);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-yellow-400 w-4' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Preview slides - Only on desktop */}
        {!isMobile && (
          <>
            <div className="absolute left-0 top-0 w-24 h-full opacity-30 blur-sm">
              <Image
                src={featuredArticles[(currentIndex - 1 + featuredArticles.length) % featuredArticles.length]?.featuredImage?.node.sourceUrl || '/images/placeholder.jpg'}
                alt="Previous"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute right-0 top-0 w-24 h-full opacity-30 blur-sm">
              <Image
                src={featuredArticles[(currentIndex + 1) % featuredArticles.length]?.featuredImage?.node.sourceUrl || '/images/placeholder.jpg'}
                alt="Next"
                fill
                className="object-cover"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
