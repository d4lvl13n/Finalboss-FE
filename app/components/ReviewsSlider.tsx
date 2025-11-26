'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GET_REVIEWS } from '../lib/queries/getReviews';
import client from '../lib/apolloClient';
import { motion } from 'framer-motion';
import { FaArrowRight, FaStar, FaChevronLeft, FaChevronRight, FaUser, FaCalendar } from 'react-icons/fa';

interface ReviewNode {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
  author?: {
    node?: {
      name?: string;
    };
  };
  date: string;
}

// Featured Review Card - Large prominent display
const FeaturedReviewCard = ({ review }: { review: ReviewNode }) => {
  const imageUrl = review.featuredImage?.node?.sourceUrl || '/images/placeholder.svg';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="group"
    >
      <Link href={`/${review.slug}`}>
        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
          {/* Background Image */}
          <Image
            src={imageUrl}
            alt={review.title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          
          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/5 transition-colors duration-500" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
            {/* Top badge */}
            <div className="absolute top-6 left-6 md:top-8 md:left-10">
              <motion.div 
                className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <FaStar className="w-4 h-4" />
                <span>Latest Review</span>
              </motion.div>
            </div>
            
            {/* Main content */}
            <div className="max-w-2xl">
              {/* Title */}
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 group-hover:text-yellow-100 transition-colors">
                {review.title}
              </h3>
              
              {/* Excerpt */}
              {review.excerpt && (
                <p 
                  className="text-gray-300 text-sm md:text-base line-clamp-2 mb-6 hidden md:block"
                  dangerouslySetInnerHTML={{ __html: review.excerpt }}
                />
              )}
              
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6">
                {review.author?.node?.name && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaUser className="w-3 h-3 text-yellow-400" />
                    <span className="text-sm font-medium">{review.author.node.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-300">
                  <FaCalendar className="w-3 h-3 text-yellow-400" />
                  <span className="text-sm">
                    {new Date(review.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              
              {/* CTA Button */}
              <motion.div 
                className="inline-flex items-center gap-3 bg-yellow-400 text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Read Full Review</span>
                <FaArrowRight className="w-4 h-4" />
              </motion.div>
            </div>
          </div>
          
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-yellow-400/10 rotate-45 group-hover:bg-yellow-400/20 transition-colors duration-500" />
          </div>
          
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-transparent" />
        </div>
      </Link>
    </motion.div>
  );
};

// Smaller review card for the slider
const ReviewCard = ({ review, index }: { review: ReviewNode; index: number }) => {
  const imageUrl = review.featuredImage?.node?.sourceUrl || '/images/placeholder.svg';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex-shrink-0 w-[280px] md:w-[300px] group"
    >
      <Link href={`/${review.slug}`}>
        <div className="relative h-[200px] md:h-[220px] rounded-xl overflow-hidden">
          <Image
            src={imageUrl}
            alt={review.title}
            fill
            sizes="(max-width: 768px) 280px, 300px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/10 transition-colors duration-300" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaStar className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-yellow-400 font-semibold uppercase tracking-wide">Review</span>
            </div>
            <h3 className="text-base font-bold text-white leading-tight line-clamp-2 group-hover:text-yellow-100 transition-colors">
              {review.title}
            </h3>
            {review.author?.node?.name && (
              <p className="text-xs text-gray-400 mt-2">
                by {review.author.node.name}
              </p>
            )}
          </div>
          
          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-400/20 rotate-45 group-hover:bg-yellow-400/40 transition-colors duration-300" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Compact review for mobile list
const CompactReviewCard = ({ review, index }: { review: ReviewNode; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
  >
    <Link 
      href={`/${review.slug}`}
      className="flex gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors group"
    >
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
        <Image
          src={review.featuredImage?.node?.sourceUrl || '/images/placeholder.svg'}
          alt={review.title}
          fill
          sizes="80px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0 py-1">
        <div className="flex items-center gap-1.5 mb-1">
          <FaStar className="w-2.5 h-2.5 text-yellow-400" />
          <span className="text-xs text-yellow-400 font-medium">Review</span>
        </div>
        <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight group-hover:text-yellow-100 transition-colors">
          {review.title}
        </h3>
      </div>
    </Link>
  </motion.div>
);

const ReviewsSlider = () => {
  const { data, loading, error } = useQuery(GET_REVIEWS, {
    variables: { first: 10 },
    client,
  });
  const [reviews, setReviews] = useState<ReviewNode[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    if (data && data.posts && data.posts.nodes) {
      setReviews(data.posts.nodes);
    }
  }, [data]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      return () => scrollContainer.removeEventListener('scroll', checkScroll);
    }
  }, [reviews]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <section className="py-10 md:py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="h-8 w-32 bg-gray-800 animate-pulse mb-8 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 h-[400px] md:h-[500px] bg-gray-800 rounded-2xl animate-pulse" />
            <div className="lg:col-span-2 space-y-4">
              <div className="h-6 w-32 bg-gray-800 animate-pulse rounded" />
              <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} className="flex-shrink-0 w-[280px] h-[200px] bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  if (error) return null;
  if (reviews.length === 0) return null;

  const featuredReview = reviews[0];
  const otherReviews = reviews.slice(1);

  return (
    <section className="py-10 md:py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div className="flex items-center flex-1">
            <div className="flex items-center gap-3">
              <div className="hidden md:flex w-12 h-12 items-center justify-center bg-yellow-400 rounded-xl">
                <FaStar className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-yellow-400">Game Reviews</h2>
                <p className="text-gray-400 text-sm hidden md:block">In-depth analysis & verdicts</p>
              </div>
            </div>
            <div className="flex-grow h-0.5 md:h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full ml-4"></div>
          </div>
          
          <Link 
            href="/reviews" 
            className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold text-sm hover:bg-yellow-300 transition-colors"
          >
            <span className="hidden sm:inline">All Reviews</span>
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Desktop Layout - Featured + Slider */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-8">
          {/* Featured Review - Takes 3 columns */}
          <div className="lg:col-span-3">
            {featuredReview && <FeaturedReviewCard review={featuredReview} />}
          </div>
          
          {/* Other Reviews Slider - Takes 2 columns */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Slider header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">More Reviews</h3>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-300 ${
                    canScrollLeft 
                      ? 'border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10' 
                      : 'border-gray-700 text-gray-600 cursor-not-allowed'
                  }`}
                  whileHover={canScrollLeft ? { scale: 1.1 } : {}}
                  whileTap={canScrollLeft ? { scale: 0.95 } : {}}
                >
                  <FaChevronLeft className="w-3 h-3" />
                </motion.button>
                <motion.button
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-300 ${
                    canScrollRight 
                      ? 'border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10' 
                      : 'border-gray-700 text-gray-600 cursor-not-allowed'
                  }`}
                  whileHover={canScrollRight ? { scale: 1.1 } : {}}
                  whileTap={canScrollRight ? { scale: 0.95 } : {}}
                >
                  <FaChevronRight className="w-3 h-3" />
                </motion.button>
              </div>
            </div>
            
            {/* Vertical stack of cards */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
              style={{ maxHeight: '440px', scrollbarWidth: 'thin', scrollbarColor: 'rgb(55 65 81) transparent' }}
            >
              {otherReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={`/${review.slug}`} className="group flex gap-4 p-3 rounded-xl hover:bg-gray-800/50 transition-colors">
                    <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={review.featuredImage?.node?.sourceUrl || '/images/placeholder.svg'}
                        alt={review.title}
                        fill
                        sizes="128px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FaStar className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-yellow-400 font-semibold uppercase">Review</span>
                      </div>
                      <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-yellow-100 transition-colors">
                        {review.title}
                      </h4>
                      {review.author?.node?.name && (
                        <p className="text-xs text-gray-500 mt-1.5">
                          by {review.author.node.name}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:block lg:hidden">
          {featuredReview && <FeaturedReviewCard review={featuredReview} />}
          
          {/* Horizontal slider for other reviews */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">More Reviews</h3>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all ${
                    canScrollLeft ? 'border-yellow-400/50 text-yellow-400' : 'border-gray-700 text-gray-600'
                  }`}
                >
                  <FaChevronLeft className="w-3 h-3" />
                </motion.button>
                <motion.button
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all ${
                    canScrollRight ? 'border-yellow-400/50 text-yellow-400' : 'border-gray-700 text-gray-600'
                  }`}
                >
                  <FaChevronRight className="w-3 h-3" />
                </motion.button>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4" style={{ scrollbarWidth: 'none' }}>
              {otherReviews.map((review, index) => (
                <ReviewCard key={review.id} review={review} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout - Featured + Compact List */}
        <div className="md:hidden space-y-4">
          {/* Featured Review - Smaller on mobile */}
          {featuredReview && (
            <Link href={`/${featuredReview.slug}`} className="block group">
              <div className="relative h-[280px] rounded-xl overflow-hidden">
                <Image
                  src={featuredReview.featuredImage?.node?.sourceUrl || '/images/placeholder.svg'}
                  alt={featuredReview.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-1.5 bg-yellow-400 text-black px-3 py-1.5 rounded-full font-bold text-xs">
                    <FaStar className="w-3 h-3" />
                    <span>Latest Review</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 mb-2">
                    {featuredReview.title}
                  </h3>
                  <div className="flex items-center gap-3 text-gray-300 text-xs">
                    {featuredReview.author?.node?.name && (
                      <span>by {featuredReview.author.node.name}</span>
                    )}
                    <span>{new Date(featuredReview.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          )}
          
          {/* Compact List */}
          <div className="space-y-1">
            {otherReviews.slice(0, 5).map((review, index) => (
              <CompactReviewCard key={review.id} review={review} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSlider;
