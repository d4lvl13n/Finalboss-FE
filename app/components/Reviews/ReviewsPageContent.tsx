// app/components/Reviews/ReviewsPageContent.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GET_REVIEWS } from '../../lib/queries/getReviews';
import client from '../../lib/apolloClient';
import { ResponsiveAd } from '../AdSense/AdBanner';
import '../../styles/ads.css';
import { SHOW_MANUAL_ADS } from '../../lib/adsConfig';
import PageHeader from '../PageHeader';
import { motion } from 'framer-motion';
import { FaStar, FaArrowRight, FaUser, FaCalendar } from 'react-icons/fa';

interface Review {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
  author?: {
    node: {
      name: string;
      avatar?: {
        url: string;
      };
      description?: string;
    };
  };
  date: string;
  categories?: {
    nodes?: {
      name: string;
    }[];
  };
}

// Featured Review Card - Large prominent display (same as ReviewsSlider)
const FeaturedReviewCard = ({ review }: { review: Review }) => {
  const imageUrl = review.featuredImage?.node?.sourceUrl || '/images/placeholder.svg';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link href={`/${review.slug}`}>
        <div className="relative aspect-[16/9] md:aspect-[16/10] rounded-2xl overflow-hidden">
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
          <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
            {/* Top badge */}
            <div className="absolute top-5 left-5 md:top-8 md:left-8">
              <motion.div 
                className="flex items-center gap-2 bg-yellow-400 text-black px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-sm shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <FaStar className="w-3 h-3 md:w-4 md:h-4" />
                <span>Featured Review</span>
              </motion.div>
            </div>
            
            {/* Main content */}
            <div className="max-w-2xl">
              {/* Title */}
              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 md:mb-4 group-hover:text-yellow-100 transition-colors line-clamp-2">
                {review.title}
              </h2>
              
              {/* Excerpt */}
              {review.excerpt && (
                <p 
                  className="text-gray-300 text-sm md:text-base line-clamp-2 mb-4 md:mb-6 hidden md:block"
                  dangerouslySetInnerHTML={{ __html: review.excerpt }}
                />
              )}
              
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3 md:gap-6 mb-4 md:mb-6">
                {review.author?.node?.name && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaUser className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs md:text-sm font-medium">{review.author.node.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-300">
                  <FaCalendar className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs md:text-sm">
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
                className="inline-flex items-center gap-3 bg-yellow-400 text-black px-5 py-2.5 md:px-6 md:py-3 rounded-full font-bold text-sm hover:bg-yellow-300 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Read Full Review</span>
                <FaArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </motion.div>
            </div>
          </div>
          
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 overflow-hidden">
            <div className="absolute -top-12 -right-12 md:-top-16 md:-right-16 w-24 h-24 md:w-32 md:h-32 bg-yellow-400/10 rotate-45 group-hover:bg-yellow-400/20 transition-colors duration-500" />
          </div>
          
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-transparent" />
        </div>
      </Link>
    </motion.div>
  );
};

// Review Card - Grid style (same as ReviewsSlider)
const ReviewCard = ({ review, index }: { review: Review; index: number }) => {
  const imageUrl = review.featuredImage?.node?.sourceUrl || '/images/placeholder.svg';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="group"
    >
      <Link href={`/${review.slug}`}>
        <div className="relative aspect-[16/11] rounded-xl overflow-hidden">
          <Image
            src={imageUrl}
            alt={review.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/10 transition-colors duration-300" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            {/* Top - Badge */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-yellow-400 text-black px-2.5 py-1 rounded-full">
                <FaStar className="w-2.5 h-2.5" />
                <span className="text-[10px] md:text-xs font-bold uppercase">Review</span>
              </div>
            </div>
            
            {/* Bottom - Title and meta */}
            <div>
              <h3 className="text-sm md:text-base font-bold text-white leading-tight line-clamp-2 group-hover:text-yellow-100 transition-colors mb-2">
                {review.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                {review.author?.node?.name && (
                  <span className="text-yellow-400/80">by {review.author.node.name}</span>
                )}
                {review.date && (
                  <>
                    <span>•</span>
                    <span>{new Date(review.date).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-10 h-10 overflow-hidden">
            <div className="absolute -top-5 -right-5 w-10 h-10 bg-yellow-400/20 rotate-45 group-hover:bg-yellow-400/40 transition-colors duration-300" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Compact Review Card for mobile
const CompactReviewCard = ({ review, index }: { review: Review; index: number }) => {
  const imageUrl = review.featuredImage?.node?.sourceUrl || '/images/placeholder.svg';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.2) }}
    >
      <Link 
        href={`/${review.slug}`}
        className="flex gap-3 p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors group"
      >
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={review.title}
            fill
            sizes="80px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
          <div className="flex items-center gap-1.5 mb-1">
            <FaStar className="w-2.5 h-2.5 text-yellow-400" />
            <span className="text-[10px] font-semibold text-yellow-400 uppercase">Review</span>
          </div>
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight group-hover:text-yellow-100 transition-colors">
            {review.title}
          </h3>
          {review.author?.node?.name && (
            <p className="text-[10px] text-gray-500 mt-1">
              by {review.author.node.name}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

interface ReviewsPageContentProps {
  initialReviews: Review[];
  initialHasNextPage: boolean;
}

export default function ReviewsPageContent({
  initialReviews,
  initialHasNextPage,
}: ReviewsPageContentProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [afterCursor, setAfterCursor] = useState<string | null>(null);

  const { fetchMore } = useQuery(GET_REVIEWS, {
    variables: { first: 24, after: afterCursor },
    client,
    skip: true,
  });

  const handleLoadMore = async () => {
    try {
      const { data } = await fetchMore({
        variables: {
          after: afterCursor || initialReviews[initialReviews.length - 1]?.id,
        },
      });
      setReviews((prevReviews) => [...prevReviews, ...data.posts.nodes]);
      setHasNextPage(data.posts.pageInfo.hasNextPage);
      setAfterCursor(data.posts.pageInfo.endCursor);
    } catch (error) {
      console.error('Error fetching more reviews:', error);
    }
  };

  const featuredReview = reviews[0];
  const remainingReviews = reviews.slice(1);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <PageHeader 
        title="Game Reviews" 
        description="In-depth reviews, honest verdicts, and ratings from the FinalBoss editorial team"
        accentColor="yellow"
      />
      
      <div className="container mx-auto px-3 md:px-4 pb-8 md:pb-16">
        {/* 🎯 AD PLACEMENT: Reviews page header ad */}
        {SHOW_MANUAL_ADS && (
          <div className="reviews-ad-header mb-4 md:mb-6">
          <div className="ad-label">Advertisement</div>
          <ResponsiveAd adSlot="5844341661" />
        </div>
        )}
        
        {/* Featured Review */}
        {featuredReview && (
          <div className="mb-6 md:mb-8">
            <FeaturedReviewCard review={featuredReview} />
                </div>
              )}
        
        {/* Mobile: Compact List View */}
        <div className="md:hidden space-y-2">
          {remainingReviews.map((review, index) => (
            <CompactReviewCard key={review.id} review={review} index={index} />
          ))}
                      </div>
        
        {/* Desktop: Grid View with Review Cards */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {remainingReviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>

        {hasNextPage && (
          <div className="text-center mt-8 md:mt-12">
            <motion.button
              onClick={handleLoadMore}
              className="inline-flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-yellow-300 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Load More Reviews</span>
              <FaArrowRight className="w-3 h-3" />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
