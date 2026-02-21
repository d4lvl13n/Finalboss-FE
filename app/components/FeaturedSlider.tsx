'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { GET_FEATURED_POSTS } from '../lib/queries/getFeaturedPosts';
import client from '../lib/apolloClient';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import { useMediaQuery } from 'react-responsive';
import { useSwipeable } from 'react-swipeable';
import { t } from '../lib/i18n';

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
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Restore Apollo query
  const { data, loading, error, refetch } = useQuery(GET_FEATURED_POSTS, {
    variables: { first: 5 },
    client,
  });

  const featuredArticles: Article[] = data?.posts?.nodes || [];

  // Navigation handlers - define these only once
  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
    setProgress(0);
  }, [featuredArticles.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
    setProgress(0);
  }, [featuredArticles.length]);

  // Swipe handlers - define only once
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
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
  }, [handleNext, handlePrev]);

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
        <p className="text-white mb-4">{t('common.error.loadFeatured')}</p>
        <button
          onClick={() => refetch()}
          className="bg-yellow-400 text-black font-bold py-2 px-6 rounded-full hover:bg-yellow-300 transition-colors"
        >
          {t('common.tryAgain')}
        </button>
      </div>
    </div>
  );

  // Loading state
  if (loading) return <SkeletonSlide />;

  // Add this check before the return statement
  if (!featuredArticles || featuredArticles.length === 0) {
    return (
      <div className="relative w-full h-[60vh] bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">{t('common.error.noFeatured')}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      role="region"
      aria-label={t('a11y.featuredSlider')}
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
                  src={featuredArticles[currentIndex]?.featuredImage?.node?.sourceUrl || '/images/placeholder.svg'}
                  alt={featuredArticles[currentIndex]?.title || 'Featured article'}
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
                  {featuredArticles[currentIndex]?.categories?.nodes?.[0] && (
                    <span className="inline-block bg-yellow-400 text-black text-sm font-bold px-3 py-1 rounded-full mb-4">
                      {featuredArticles[currentIndex].categories.nodes[0].name}
                    </span>
                  )}

                  {/* Title */}
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    {featuredArticles[currentIndex]?.title}
                  </h1>

                  {/* CTA Button */}
                  <Link href={`/${featuredArticles[currentIndex]?.slug}`}>
                    <button className="bg-yellow-400 text-black font-bold py-2 px-6 md:py-3 md:px-8 rounded-full hover:bg-yellow-300 transition-colors">
                      {t('common.readMore')}
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
            aria-label={t('a11y.previousSlide')}
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/75 transition-all"
          >
            <FaChevronLeft size={24} />
          </button>
          <button
            aria-label={t('a11y.nextSlide')}
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/75 transition-all"
          >
            <FaChevronRight size={24} />
          </button>
        </div>

        {/* Slide indicators */}
        <div role="tablist" aria-label={t('a11y.slideIndicators')}>
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
                src={featuredArticles[(currentIndex - 1 + featuredArticles.length) % featuredArticles.length]?.featuredImage?.node?.sourceUrl || '/images/placeholder.svg'}
                alt="Previous"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute right-0 top-0 w-24 h-full opacity-30 blur-sm">
              <Image
                src={featuredArticles[(currentIndex + 1) % featuredArticles.length]?.featuredImage?.node?.sourceUrl || '/images/placeholder.svg'}
                alt="Next"
                fill
                className="object-cover"
              />
            </div>
          </>
        )}

        {/* Navigation indicators - Add this after the content div */}
        <div className="hidden md:flex items-center justify-between absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 gap-8">
          {/* Slide counter */}
          <div className="text-white/80 font-medium">
            <span className="text-yellow-400">{currentIndex + 1}</span>
            <span className="mx-2">/</span>
            <span>{featuredArticles.length}</span>
          </div>

          {/* Slide dots */}
          <div className="flex items-center gap-2">
            {featuredArticles.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                  setProgress(0);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-6 bg-yellow-400' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slide arrows with labels */}
          <div className="flex items-center gap-4 text-white/80">
            <button
              onClick={handlePrev}
              className="group flex items-center gap-2 hover:text-yellow-400 transition-colors"
              aria-label={t('a11y.previousSlide')}
            >
              <motion.div
                animate={{ x: [-5, 0, -5] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <FaChevronLeft size={20} />
              </motion.div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">{t('common.prev')}</span>
            </button>
            <button
              onClick={handleNext}
              className="group flex items-center gap-2 hover:text-yellow-400 transition-colors"
              aria-label={t('a11y.nextSlide')}
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">{t('common.next')}</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <FaChevronRight size={20} />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Add a subtle gradient overlay to ensure text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
