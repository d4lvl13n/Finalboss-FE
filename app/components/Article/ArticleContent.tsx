'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import '../../styles/article.css';
import '../../styles/ads.css';
import { PLACEHOLDER_BASE64 } from '../../utils/placeholder';
import ProcessedContent from '../ProcessedContent';
import RelatedArticles from './RelatedArticles';
import { ResponsiveAd, VerticalAd } from '../AdSense/AdBanner';
import { GET_RELATED_POSTS, GET_SEQUENTIAL_POSTS, GET_AUTHOR_POSTS } from '../../lib/queries/getRelatedPosts';
import { GET_LATEST_POSTS } from '../../lib/queries/getLatestPosts';
import client from '../../lib/apolloClient';
import { SHOW_MANUAL_ADS } from '../../lib/adsConfig';

// Define a more specific type for the article object
interface ArticleData {
  id?: string;
  title: string;
  content: string;
  date: string;
  author?: {
    node?: {
      id?: string;
      name?: string;
    };
  };
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
  categories?: {
    nodes?: {
      id: string;
      name: string;
    }[];
  };
}

interface ArticleContentProps {
  article: ArticleData;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  console.log('Raw article content:', article.content);
  const [readingProgress, setReadingProgress] = useState(0);
  const [featuredImageError, setFeaturedImageError] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1280); // Corresponds to xl breakpoint
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Get the primary category for related posts
  const primaryCategory = article.categories?.nodes?.[0];

  // Fetch related articles by category with error handling
  const { data: relatedData, loading: relatedLoading, error: relatedError } = useQuery(GET_RELATED_POSTS, {
    variables: { 
      excludeId: article.id || '0',
      categoryId: primaryCategory?.id,
      first: 4 
    },
    client,
    skip: !article.id || !primaryCategory?.id,
    fetchPolicy: 'cache-first',
    errorPolicy: 'ignore', // Don't fail completely if this query fails
  });

  // Fetch sequential posts (previous/next by date) with error handling
  const { data: sequentialData, loading: sequentialLoading, error: sequentialError } = useQuery(GET_SEQUENTIAL_POSTS, {
    variables: {
      currentDate: article.date,
      first: 1
    },
    client,
    fetchPolicy: 'cache-first',
    errorPolicy: 'ignore',
  });

  // Fetch more articles by the same author with error handling
  const { data: authorData, loading: authorLoading, error: authorError } = useQuery(GET_AUTHOR_POSTS, {
    variables: {
      authorId: article.author?.node?.id || '0',
      excludeId: article.id || '0',
      first: 3
    },
    client,
    skip: !article.author?.node?.id || !article.id,
    fetchPolicy: 'cache-first',
    errorPolicy: 'ignore',
  });

  // Fallback to latest posts if other queries fail
  const { data: latestData, loading: latestLoading } = useQuery(GET_LATEST_POSTS, {
    variables: { first: 4 },
    client,
    fetchPolicy: 'cache-first',
    // Only fetch if we have no other recommendations
    skip: (relatedData?.posts?.nodes?.length > 0) || 
          (authorData?.posts?.nodes?.length > 0) ||
          relatedLoading || authorLoading,
  });

  useEffect(() => {
    const updateReadingProgress = () => {
      const totalHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => {
      window.removeEventListener('scroll', updateReadingProgress);
    };
  }, []);

  // Debug logging
  useEffect(() => {
    if (relatedError) console.log('Related posts error:', relatedError);
    if (sequentialError) console.log('Sequential posts error:', sequentialError);
    if (authorError) console.log('Author posts error:', authorError);
  }, [relatedError, sequentialError, authorError]);

  // Determine what articles to show
  const articlesToShow = relatedData?.posts?.nodes || latestData?.posts?.nodes || [];
  const isLoading = relatedLoading || sequentialLoading || authorLoading || latestLoading;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-700 z-50">
        <motion.div
          className="h-full bg-yellow-400"
          style={{ width: `${readingProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Parallax Featured Image */}
      <div className="relative h-[60vh] overflow-hidden">
        {article.featuredImage && !featuredImageError ? (
          <motion.div className="absolute inset-0" >
            <Image
              src={article.featuredImage.node.sourceUrl}
              alt={article.title}
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              placeholder="blur"
              blurDataURL={PLACEHOLDER_BASE64}
              className=""
              onError={() => setFeaturedImageError(true)}
            />
          </motion.div>
        ) : (
          <motion.div className="absolute inset-0 bg-gray-800 flex items-center justify-center" >
            <div className="text-gray-600 text-lg">
              {article.title}
            </div>
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90" />
      </div>

      {/* Article Content */}
      <div className="relative z-10 px-4 -mt-24">
        <div className="flex justify-center max-w-7xl mx-auto">
          {/* Left Sidebar - Desktop Only */}
          {isDesktop && SHOW_MANUAL_ADS && (
            <div className="hidden xl:block w-48 flex-shrink-0 mr-6">
              <div className="sticky top-32">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="sidebar-ad-sticky bg-gray-800/20 rounded-lg p-3 border border-gray-700/20"
                >
                  <div className="ad-label text-xs mb-3">Advertisement</div>
                  <VerticalAd adSlot="1258229391" />
                </motion.div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 max-w-4xl bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              <motion.h1
                className="text-4xl sm:text-5xl font-bold mb-4 text-yellow-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {article.title}
              </motion.h1>

              {/* Author and Date Section */}
              <motion.div
                className="inline-block rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm shadow-xl p-4 mb-6 sm:mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center gap-6">
                  {/* Author Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-700/70 border-2 border-yellow-400/20 flex items-center justify-center text-yellow-400 text-lg font-semibold shadow-lg">
                      {article.author?.node?.name?.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-yellow-400 font-medium tracking-wide">
                        {article.author?.node?.name}
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(article.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-8 w-px bg-gray-700/50"></div>

                  {/* Reading Time Indicator */}
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg 
                      className="w-5 h-5 text-yellow-400/70" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <span>{Math.ceil(article.content.split(' ').length / 200)} min read</span>
                  </div>

                  {/* Category Tags */}
                  {article.categories?.nodes && article.categories.nodes.length > 0 && (
                    <>
                      <div className="h-8 w-px bg-gray-700/50"></div>
                      <div className="flex gap-2">
                        {article.categories.nodes.slice(0, 2).map((category) => (
                          <span key={category.id} className="bg-yellow-400/20 text-yellow-400 text-xs px-2 py-1 rounded-full">
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              {/* 🎯 AD PLACEMENT 1: High-performing above-the-fold ad */}
              {SHOW_MANUAL_ADS && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="article-ad-top"
              >
                <div className="ad-label">Advertisement</div>
                <ResponsiveAd adSlot="5844341661" />
              </motion.div>
              )}

              <motion.div
                className="prose prose-lg prose-invert max-w-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <ProcessedContent content={article.content} />
              </motion.div>

              {/* 🎯 AD PLACEMENT 2: End of content, high engagement */}
              {SHOW_MANUAL_ADS && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="article-ad-content"
              >
                <div className="ad-label">Advertisement</div>
                <ResponsiveAd adSlot="6510556072" />
              </motion.div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Desktop Only */}
          {isDesktop && SHOW_MANUAL_ADS && (
            <div className="hidden xl:block w-48 flex-shrink-0 ml-6">
              <div className="sticky top-32">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  className="sidebar-ad-sticky bg-gray-800/20 rounded-lg p-3 border border-gray-700/20"
                >
                  <div className="ad-label text-xs mb-3">Advertisement</div>
                  <VerticalAd adSlot="1258229391" />
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🎯 AD PLACEMENT 3: Before related articles - premium position */}
      {SHOW_MANUAL_ADS && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="article-ad-bottom max-w-4xl mx-auto px-4"
      >
        <div className="ad-label">Advertisement</div>
        <ResponsiveAd adSlot="9184820874" />
      </motion.div>
      )}

      {/* Enhanced Related Articles Section */}
      <RelatedArticles 
        articles={articlesToShow}
        isLoading={isLoading}
        sequentialPosts={sequentialData ? {
          newer: sequentialData.newer?.nodes,
          older: sequentialData.older?.nodes
        } : undefined}
        authorPosts={authorData?.posts?.nodes || []}
        sectionTitle={
          relatedData?.posts?.nodes?.length > 0 && primaryCategory 
            ? `Related to ${primaryCategory.name}` 
            : articlesToShow?.length > 0 
              ? 'You Might Also Like' 
              : 'Related Articles'
        }
      />
    </div>
  );
}

