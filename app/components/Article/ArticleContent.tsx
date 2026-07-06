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
// ProcessedContent now used via ArticleBodyWithAds
import RelatedArticles from './RelatedArticles';
import { ResponsiveAd, VerticalAd } from '../AdSense/AdBanner';
// InlineContentUpgrade now rendered via ArticleBodyWithAds
import InlineRelatedLinks from './InlineRelatedLinks';
import { GET_RELATED_POSTS, GET_SEQUENTIAL_POSTS, GET_AUTHOR_POSTS } from '../../lib/queries/getRelatedPosts';
import { GET_LATEST_POSTS } from '../../lib/queries/getLatestPosts';
import client from '../../lib/apolloClient';
import { SHOW_MANUAL_ADS } from '../../lib/adsConfig';
import { contextualizeKinguinLinks } from '../../lib/kinguin';
import siteConfig from '../../lib/siteConfig';
import { normalizeWordPressImageSrc } from '../../lib/imageUrl';
import ReviewSummary, { ReviewConfig } from '../Review/ReviewSummary';
import ReviewJsonLd from '../Seo/ReviewJsonLd';
import Breadcrumbs from '../Breadcrumbs';
import TableOfContents from './TableOfContents';
import ArticleBodyWithAds from './ArticleBodyWithAds';
import ArticleReactions, { type ContentType } from './ArticleReactions';

/** Map the article's categories to a content type so reaction copy fits
 *  (a review never says "guide"). "Gaming" is the news/opinion catch-all. */
function detectContentType(
  categories: { name?: string }[] | undefined,
  isReview: boolean
): ContentType {
  if (isReview) return 'review';
  const names = (categories || []).map((c) => (c?.name || '').toLowerCase());
  const has = (s: string) => names.some((n) => n.includes(s));
  if (has('review')) return 'review';
  if (has('guide') || has('walkthrough')) return 'guide';
  if (has('interview')) return 'interview';
  if (has('tech')) return 'tech';
  if (has('movie') || has('tv') || has('cinema')) return 'entertainment';
  if (names.includes('top') || has('best of')) return 'list';
  return 'news';
}
import ReadingProgressBar from '../ReadingProgressBar';
import LatestSidebar from '../LatestSidebar';
import GameMetaCard from '../GameMetaCard';
import { t } from '../../lib/i18n';

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
  gameTags?: {
    nodes?: {
      name: string;
      slug: string;
      igdbId?: string | null;
      igdbData?: string | null;
    }[];
  };
}

interface ArticleContentProps {
  article: ArticleData;
}

export default function ArticleContent({ article }: ArticleContentProps) {
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
  const primaryGameTag = article.gameTags?.nodes?.[0];

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
  const featuredImageSrc = normalizeWordPressImageSrc(article.featuredImage?.node.sourceUrl);

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

    // 3) Auto-extract from content patterns: Verdict heading + Score + TL;DR
    const scoreRegex = /(?:Score|Provisional\s+score)\s*:?\s*(\d+(?:[.,]\d+)?)\s*\/\s*10/i;
    const scoreMatchGlobal = html.match(scoreRegex);

    // Find h2 heading containing "verdict"
    const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
    let verdictMatch: RegExpExecArray | null = null;
    let h2Match: RegExpExecArray | null;
    while ((h2Match = h2Regex.exec(html)) !== null) {
      const headingText = h2Match[1].replace(/<[^>]*>/g, '').trim();
      if (/verdict/i.test(headingText)) {
        verdictMatch = h2Match;
        break;
      }
    }

    if (verdictMatch || scoreMatchGlobal) {
      let verdictTitle: string | undefined;
      let conclusion: string | undefined;
      let score: number | undefined;
      const pros: string[] = [];
      const cons: string[] = [];
      let cleanedHtml = html;

      if (scoreMatchGlobal) {
        score = parseFloat(scoreMatchGlobal[1].replace(',', '.'));
      }

      if (verdictMatch) {
        const verdictIdx = verdictMatch.index;

        // Extract verdict title (strip "Verdict:" prefix and score suffix)
        const rawHeadingText = verdictMatch[1].replace(/<[^>]*>/g, '').trim();
        // Fallback: extract score from heading if not found in body (e.g. "Verdict: ... – 8/10")
        if (score === undefined) {
          const headingScoreMatch = rawHeadingText.match(/(\d+(?:[.,]\d+)?)\s*\/\s*10/);
          if (headingScoreMatch) score = parseFloat(headingScoreMatch[1].replace(',', '.'));
        }
        let rawTitle = rawHeadingText;
        rawTitle = rawTitle.replace(/^(?:FinalBoss\s+)?Verdict\s*(?:\([^)]*\))?\s*[:–—-]\s*/i, '').trim();
        rawTitle = rawTitle.replace(/\s*[-–—]\s*\d+(?:[.,]\d+)?\s*\/\s*10\s*$/, '').trim();
        if (rawTitle) verdictTitle = rawTitle;

        const afterVerdict = html.slice(verdictIdx + verdictMatch[0].length);

        // Find TL;DR heading
        const tldrRegex = /<h2[^>]*>[\s\S]*?TL;?\s*DR[\s\S]*?<\/h2>/i;
        const tldrMatch = afterVerdict.match(tldrRegex);

        // Conclusion = paragraphs between verdict heading and TL;DR (or end)
        const conclusionHtml = tldrMatch
          ? afterVerdict.slice(0, afterVerdict.indexOf(tldrMatch[0]))
          : afterVerdict;

        const paragraphs: string[] = [];
        const pMatches = Array.from(conclusionHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi));
        for (const m of pMatches) {
          const text = m[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
          if (scoreRegex.test(text)) continue; // skip score paragraph
          if (text) paragraphs.push(text);
        }
        conclusion = paragraphs.join('\n\n');

        // Extract pros/cons from TL;DR bullets
        if (tldrMatch) {
          const tldrIdx = afterVerdict.indexOf(tldrMatch[0]);
          const afterTldr = afterVerdict.slice(tldrIdx + tldrMatch[0].length);
          const ulMatch = afterTldr.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
          if (ulMatch) {
            const items = Array.from(ulMatch[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi));
            for (const item of items) {
              const text = item[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
              if (/^[+✓✔]/.test(text) || /^Pros?\s*:/i.test(text)) {
                pros.push(text.replace(/^(?:[+✓✔]\s*|Pros?\s*:\s*)/i, ''));
              } else if (/^[-–—✗✘]/.test(text) || /^Cons?\s*:/i.test(text)) {
                cons.push(text.replace(/^(?:[-–—✗✘]\s*|Cons?\s*:\s*)/i, ''));
              }
            }
          }
        }

        // Strip everything from verdict heading onwards
        cleanedHtml = html.slice(0, verdictIdx);
      } else {
        // Only score found, no verdict heading — remove the score paragraph
        cleanedHtml = html.replace(
          /<p\b[^>]*>(?:(?!<\/p>)[\s\S])*(?:Score|Provisional\s+score)\s*:?\s*\d+(?:[.,]\d+)?\s*\/\s*10(?:(?!<\/p>)[\s\S])*<\/p>/gi,
          ''
        );
      }

      const config: ReviewConfig = {
        score,
        verdictTitle,
        conclusion: conclusion || undefined,
        ...(pros.length > 0 ? { pros } : {}),
        ...(cons.length > 0 ? { cons } : {}),
      };

      return { config, cleaned: cleanedHtml };
    }

    return { cleaned: html };
  }

  const { config: reviewConfig, cleaned: contentCleaned } = extractReviewConfig(article.content);

  // Make the in-article Kinguin link game-specific: a guide about <game> should
  // send readers to keys for THAT game (geo-agnostic, relevant to a global PC
  // audience), not the generic homepage. No-ops when the post has no game tag.
  const contentFinal = contextualizeKinguinLinks(contentCleaned, primaryGameTag?.name);

  return (
    // overflow-x-clip (NOT hidden): hidden creates a scroll container and silently
    // disables position:sticky for all descendants (sidebar ads). clip clips without
    // breaking sticky — same pattern as body/#__content in layout.tsx.
    <div className="min-h-screen bg-gray-900 text-gray-200 overflow-x-clip">
      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Hero Image with Title Overlay. Mobile height reduced (38vh) so guide
          readers reach the TOC + first answer with far less scroll; desktop
          keeps the full cinematic hero. */}
      <div className="relative h-[38vh] sm:h-[55vh] md:h-[60vh] overflow-hidden">
        {featuredImageSrc && !featuredImageError ? (
          <motion.div className="absolute inset-0" >
            <Image
              src={featuredImageSrc}
              alt={article.title}
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              priority
              placeholder="blur"
              blurDataURL={PLACEHOLDER_BASE64}
              onError={() => setFeaturedImageError(true)}
            />
          </motion.div>
        ) : (
          <motion.div className="absolute inset-0 bg-gray-800" />
        )}
        {/* Stronger gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" style={{ top: '40%' }} />

        {/* Title + meta overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-6 sm:pb-8">
          <div className="max-w-4xl mx-auto">
            <Breadcrumbs
              items={[
                ...(primaryCategory ? [{ label: primaryCategory.name, href: `/${primaryCategory.name.toLowerCase()}` }] : []),
                { label: article.title }
              ]}
            />
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-3 text-white drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {article.title}
            </motion.h1>
            {/* Compact author line */}
            <div className="flex items-center gap-3 text-sm text-gray-300">
              {article.author?.node?.name && (
                <Link
                  href={`/author/${article.author?.node?.slug || ''}`}
                  className="text-yellow-400 font-medium hover:text-yellow-300 transition-colors"
                >
                  {article.author.node.name}
                </Link>
              )}
              <span className="text-gray-500">·</span>
              <span>{publishedDate}</span>
              <span className="text-gray-500">·</span>
              <span>{Math.ceil(article.content.split(' ').length / 200)} {t('article.minRead')}</span>
              {article.categories?.nodes && article.categories.nodes.length > 0 && (
                <>
                  <span className="text-gray-500 hidden sm:inline">·</span>
                  <div className="hidden sm:flex gap-2">
                    {article.categories.nodes.slice(0, 2).map((category) => (
                      <span key={category.id} className="bg-yellow-400/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full">
                        {category.name}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="relative z-10 px-4 -mt-2">
        <div className="flex justify-center max-w-[1600px] mx-auto">
          {/* Left sidebar removed — in-article ads provide better viewability */}

          {/* Main Content - Centered with wider sidebar */}
          {/* min-w-0 is critical in flex layouts: wide ad/embed children otherwise force the whole
              article column wider than the viewport on mobile. Keep clipping on the inner padding
              wrapper so the column can shrink without breaking responsive ad iframes. */}
          <div className="flex-1 min-w-0 max-w-3xl xl:max-w-[780px] bg-gray-900 rounded-lg shadow-2xl">
          <div className="p-4 sm:p-6 md:p-8 overflow-x-hidden">
            {primaryGameTag && <GameMetaCard gameTag={primaryGameTag} />}

            {/* Table of Contents for long articles */}
            <TableOfContents content={contentCleaned} minHeadings={4} />

              {/* AD PLACEMENT 1 moved INTO the body: now injected after the
                  1st–2nd intro paragraph by ArticleBodyWithAds (higher CTR than
                  a banner sitting above all content). */}

            <ArticleBodyWithAds
              content={contentFinal}
              sourceSansClassName={sourceSans.className}
              articleTitle={article.title}
              categoryName={primaryCategory?.name || 'Gaming'}
            />

            {/* "Was this helpful?" reactions + email/feedback capture */}
            {currentSlug && (
              <ArticleReactions
                slug={currentSlug}
                postId={article.id}
                game={primaryGameTag?.name}
                contentType={detectContentType(article.categories?.nodes, isReview)}
              />
            )}

            {articlesToShow.length > 0 && (
              <InlineRelatedLinks articles={articlesToShow.slice(0, 3)} />
            )}

            {/* Conditional Review summary block at end of content */}
            {isReview && reviewConfig && (
              <>
                <ReviewSummary
                  articleTitle={article.title}
                  fallbackImage={featuredImageSrc}
                  config={reviewConfig}
                />
                <ReviewJsonLd
                  articleUrl={`${siteConfig.url}/${(article as unknown as { slug?: string }).slug || ''}`}
                  articleTitle={article.title}
                  authorName={article.author?.node?.name}
                  rating={typeof reviewConfig.score === 'number' ? reviewConfig.score : undefined}
                  reviewBody={reviewConfig.conclusion}
                  imageUrl={reviewConfig.backgroundImage || featuredImageSrc}
                />
              </>
            )}

            {/* Compact author byline at end of article */}
            <div className="flex items-center gap-3 mt-8 mb-6 pt-6 border-t border-gray-700/50">
              <Link
                href={`/author/${article.author?.node?.slug || ''}`}
                className="w-10 h-10 rounded-full bg-gray-700/70 border-2 border-yellow-400/20 flex items-center justify-center text-yellow-400 font-semibold hover:border-yellow-400/50 transition-colors flex-shrink-0"
              >
                {article.author?.node?.name?.charAt(0)}
              </Link>
              <div className="text-sm">
                <Link
                  href={`/author/${article.author?.node?.slug || ''}`}
                  className="text-yellow-400 font-medium hover:text-yellow-300 transition-colors"
                >
                  {article.author?.node?.name}
                </Link>
                <div className="text-gray-500">
                  {t('article.publishedOn', { date: publishedDate })}
                  {showUpdatedTimestamp && updatedDate && (
                    <span> · {t('article.updatedOn', { date: updatedDate })}</span>
                  )}
                </div>
              </div>
            </div>

              {/* End-of-content ad removed — in-article ads + bottom ad provide better coverage */}
            </div>
          </div>

          {/* Right Sidebar - Desktop Only */}
          {isDesktop && (
            <div className="hidden xl:block w-[420px] flex-shrink-0 ml-6">
              {/* Latest articles scrolls away normally; only the ad stack below is
                  sticky (the full stack is taller than the viewport — pinning it all
                  would leave the ads cut off below the fold). The sticky div must be
                  a DIRECT child of this column: position:sticky only travels within
                  its parent's height, and the column stretches to the article height
                  while any intermediate wrapper would not. */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/30 mb-6"
              >
                <LatestSidebar
                  articles={latestData?.posts?.nodes || []}
                  title={t('common.latest')}
                  showAllLink="/gaming"
                  showAllText={t('article.viewAll')}
                  maxItems={10}
                  accentColor="yellow"
                  maxHeight="420px"
                />
              </motion.div>

              <div className="sticky top-24 space-y-6">
                {SHOW_MANUAL_ADS && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="bg-gray-800/20 rounded-xl p-4 border border-gray-700/20"
                  >
                    <div className="ad-label text-xs mb-3">{t('article.adLabel')}</div>
                    <div className="flex justify-center">
                      <VerticalAd adSlot="1258229391" />
                    </div>
                  </motion.div>
                )}

              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🎯 AD PLACEMENT 3: Before related articles - premium position */}
      {SHOW_MANUAL_ADS && (
      <div className="article-ad-bottom max-w-4xl mx-auto px-4">
        <div className="ad-label">{t('article.adLabel')}</div>
        <ResponsiveAd adSlot="9184820874" />
      </div>
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
            ? t('article.relatedCategoryTitle', { category: primaryCategory.name })
            : articlesToShow?.length > 0
              ? t('article.youMightLike')
              : t('article.relatedTitle')
        }
      />
    </div>
  );
}
