'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { Source_Sans_3 } from 'next/font/google';
import '../../styles/article.css';
import '../../styles/ads.css';
import { PLACEHOLDER_BASE64 } from '../../utils/placeholder';
import { formatDate } from '../../utils/formatDate';
import ProcessedContent from '../ProcessedContent';
import RelatedArticles from './RelatedArticles';
import { ResponsiveAd, VerticalAd } from '../AdSense/AdBanner';
import InlineContentUpgrade from '../LeadCapture/InlineContentUpgrade';
import InlineRelatedLinks from './InlineRelatedLinks';
import { GET_RELATED_POSTS, GET_SEQUENTIAL_POSTS, GET_AUTHOR_POSTS } from '../../lib/queries/getRelatedPosts';
import { GET_LATEST_POSTS } from '../../lib/queries/getLatestPosts';
import client from '../../lib/apolloClient';
import { SHOW_MANUAL_ADS } from '../../lib/adsConfig';
import ReviewSummary, { ReviewConfig } from '../Review/ReviewSummary';
import ReviewJsonLd from '../Seo/ReviewJsonLd';
import Breadcrumbs from '../Breadcrumbs';
import TableOfContents from './TableOfContents';
import ReadingProgressBar from '../ReadingProgressBar';
import LatestSidebar from '../LatestSidebar';

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
});

// Define a more specific type for the article object
interface ArticleData {
  id?: string;
  title: string;
  content: string;
  date: string;
  modified?: string;
  author?: {
    node?: {
      id?: string;
      name?: string;
      slug?: string;
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

  // Fetch latest posts for sidebar and fallback recommendations
  const { data: latestData, loading: latestLoading } = useQuery(GET_LATEST_POSTS, {
    variables: { first: 12 },
    client,
    fetchPolicy: 'cache-first',
  });


  // Debug logging
  useEffect(() => {
    if (relatedError) console.log('Related posts error:', relatedError);
    if (sequentialError) console.log('Sequential posts error:', sequentialError);
    if (authorError) console.log('Author posts error:', authorError);
  }, [relatedError, sequentialError, authorError]);

  // Determine what articles to show (filter out current article)
  const currentSlug = (article as unknown as { slug?: string }).slug;
  const rawArticles = relatedData?.posts?.nodes || latestData?.posts?.nodes || [];
  const articlesToShow = rawArticles.filter(
    (a: { id?: string; slug?: string }) => a.id !== article.id && a.slug !== currentSlug
  );
  const isLoading = relatedLoading || sequentialLoading || authorLoading || latestLoading;
  const publishedDate = formatDate(article.date);
  const updatedDate = article.modified ? formatDate(article.modified) : null;
  const showUpdatedTimestamp =
    article.modified && new Date(article.modified).getTime() !== new Date(article.date).getTime();

  // Detect review category
  const isReview = Boolean(
    article.categories?.nodes?.some(
      (c) => c?.name?.toLowerCase() === 'reviews' || (c as unknown as { slug?: string }).slug === 'reviews'
    )
  );

  // Extract optional embedded review config from HTML comments
  function extractReviewConfig(html: string): { config?: ReviewConfig; cleaned: string } {
    if (!html) return { cleaned: html };
    // 1) JSON-in-comment method
    const jsonRegex = /<!--\s*(?:fb-)?review\s*:?\s*(\{[\s\S]*?\})\s*-->/i;
    const jsonMatch = html.match(jsonRegex);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]) as ReviewConfig;
        const cleaned = html.replace(jsonMatch[0], '');
        return { config: parsed, cleaned };
      } catch {
        // fall through
      }
    }

    // 2) fb-review HTML block method
    const blockRegex = /<div[^>]*class=["'][^"']*fb-review[^"']*["'][^>]*>([\s\S]*?)<\/div>/i;
    const blockMatch = html.match(blockRegex);
    if (blockMatch) {
      const wholeDiv = blockMatch[0];
      const inner = blockMatch[1];
      const openTagMatch = wholeDiv.match(/<div[^>]*>/i);
      const openTag = openTagMatch ? openTagMatch[0] : '';
      const getAttr = (name: string) => {
        const m = openTag.match(new RegExp(`data-${name}=["']([^"']*)["']`, 'i'));
        return m ? m[1] : undefined;
      };
      const scoreStr = getAttr('score');
      const score = scoreStr != null ? Number(scoreStr) : undefined;
      const backgroundImage = getAttr('bg') || getAttr('background') || getAttr('backgroundImage');
      const verdictTitle = getAttr('verdict');

      const extractList = (className: string): string[] => {
        const ulMatch = inner.match(new RegExp(`<ul[^>]*class=["'][^"']*${className}[^"']*["'][^>]*>([\\s\\S]*?)<\\/ul>`, 'i'));
        if (!ulMatch) return [];
        const items = Array.from(ulMatch[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi));
        return items.map((m) => m[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean);
      };

      const pros = extractList('fb-pros');
      const cons = extractList('fb-cons');

      // ratings as <ul class="fb-ratings"><li data-label="Gameplay" data-score="8.5"></li>...</ul>
      const ratings: ReviewConfig['ratings'] = [];
      const ratingsUl = inner.match(/<ul[^>]*class=["'][^"']*fb-ratings[^"']*["'][^>]*>([\s\S]*?)<\/ul>/i);
      if (ratingsUl) {
        const liMatches = Array.from(ratingsUl[1].matchAll(/<li([^>]*)>([\s\S]*?)<\/li>/gi));
        for (const m of liMatches) {
          const attrs = m[1] || '';
          const labelMatch = attrs.match(/data-label=["']([^"']*)["']/i);
          const scoreMatch = attrs.match(/data-score=["']([^"']*)["']/i);
          const label = labelMatch ? labelMatch[1] : m[2].replace(/<[^>]*>/g, ' ').trim().split(':')[0];
          const s = scoreMatch ? Number(scoreMatch[1]) : Number((m[2].match(/([0-9]+(?:\.[0-9]+)?)/) || [])[1]);
          if (label && !Number.isNaN(s)) ratings.push({ label, score: s });
        }
      }

      // conclusion paragraph: <p class="fb-conclusion">...</p>
      const conclMatch = inner.match(/<p[^>]*class=["'][^"']*fb-conclusion[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
      const conclusion = conclMatch ? conclMatch[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : undefined;

      const config: ReviewConfig = {
        score,
        backgroundImage,
        verdictTitle,
        pros,
        cons,
        ratings,
        ...(conclusion ? { conclusion } : {}),
      };
      const cleaned = html.replace(wholeDiv, '');
      return { config, cleaned };
    }

    return { cleaned: html };
  }

  const { config: reviewConfig, cleaned: contentCleaned } = extractReviewConfig(article.content);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {/* Reading Progress Bar */}
      <ReadingProgressBar />

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
              priority
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

      {/* Breadcrumbs */}
      <div className="relative z-10 px-4 -mt-16 mb-4 max-w-7xl mx-auto">
        <Breadcrumbs 
          items={[
            ...(primaryCategory ? [{ label: primaryCategory.name, href: `/${primaryCategory.name.toLowerCase()}` }] : []),
            { label: article.title }
          ]}
        />
      </div>

      {/* Article Content */}
      <div className="relative z-10 px-4 -mt-8">
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
                  <Link 
                    href={`/author/${article.author?.node?.slug || ''}`}
                    className="w-12 h-12 rounded-full bg-gray-700/70 border-2 border-yellow-400/20 flex items-center justify-center text-yellow-400 text-lg font-semibold shadow-lg hover:border-yellow-400/50 transition-colors"
                  >
                    {article.author?.node?.name?.charAt(0)}
                  </Link>
                  <div className="flex flex-col">
                    <Link 
                      href={`/author/${article.author?.node?.slug || ''}`}
                      className="text-yellow-400 font-medium tracking-wide hover:text-yellow-300 transition-colors"
                    >
                      {article.author?.node?.name}
                    </Link>
                    <div className="text-sm text-gray-400 flex flex-col">
                      <span>Published {publishedDate}</span>
                      {showUpdatedTimestamp && updatedDate && (
                        <span className="text-xs text-gray-500">Updated {updatedDate}</span>
                      )}
                    </div>
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

            {articlesToShow.length > 0 && (
              <InlineRelatedLinks articles={articlesToShow.slice(0, 3)} />
            )}

            {/* Table of Contents for long articles */}
            <TableOfContents content={contentCleaned} minHeadings={4} />

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
              className={`${sourceSans.className} prose prose-lg prose-invert mx-auto max-w-3xl text-[18px] md:text-[19px] leading-8 tracking-[0.0025em]`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ProcessedContent content={contentCleaned} />
            </motion.div>

            {/* Conditional Review summary block at end of content */}
            {isReview && reviewConfig && (
              <>
                <ReviewSummary
                  articleTitle={article.title}
                  fallbackImage={article.featuredImage?.node?.sourceUrl}
                  config={reviewConfig}
                />
                <ReviewJsonLd
                  articleUrl={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io'}/${(article as unknown as { slug?: string }).slug || ''}`}
                  articleTitle={article.title}
                  authorName={article.author?.node?.name}
                  rating={typeof reviewConfig.score === 'number' ? reviewConfig.score : undefined}
                  reviewBody={reviewConfig.conclusion}
                  imageUrl={reviewConfig.backgroundImage || article.featuredImage?.node?.sourceUrl}
                />
              </>
            )}

            {/* Inline Content Upgrade - Strategic Placement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <InlineContentUpgrade
                title="Want to Level Up Your Gaming?"
                description="Get access to exclusive strategies, hidden tips, and pro-level insights that we don't share publicly."
                bonusContent={`Ultimate ${primaryCategory?.name || 'Gaming'} Strategy Guide + Weekly Pro Tips`}
                articleTopic={article.title}
              />
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
          {isDesktop && (
            <div className="hidden xl:block w-72 flex-shrink-0 ml-6">
              <div className="sticky top-24 space-y-6">
                {/* Latest Articles Sidebar */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30"
                >
                  <LatestSidebar 
                    articles={latestData?.posts?.nodes || []}
                    title="Latest"
                    showAllLink="/gaming"
                    showAllText="View All"
                    maxItems={8}
                    accentColor="yellow"
                    maxHeight="650px"
                  />
                </motion.div>
                
                {/* Ad below sidebar */}
                {SHOW_MANUAL_ADS && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    className="bg-gray-800/20 rounded-lg p-3 border border-gray-700/20"
                  >
                    <div className="ad-label text-xs mb-3">Advertisement</div>
                    <VerticalAd adSlot="1258229391" />
                  </motion.div>
                )}
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

