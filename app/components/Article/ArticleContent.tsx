'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
import { GET_GAME_TAG_WITH_POSTS } from '../../lib/queries/gameQueries';
import client from '../../lib/apolloClient';
import { SHOW_MANUAL_ADS } from '../../lib/adsConfig';
import { contextualizeKinguinLinks } from '../../lib/kinguin';
import { normalizeWordPressImageSrc } from '../../lib/imageUrl';
import ReviewSummary, { ReviewConfig } from '../Review/ReviewSummary';
import Breadcrumbs from '../Breadcrumbs';
import TableOfContents from './TableOfContents';
import ArticleBodyWithAds from './ArticleBodyWithAds';
import ArticleReactions, { type ContentType } from './ArticleReactions';
import TrackViewContent from '../TrackViewContent';
import GooglePreferredSource from '../GooglePreferredSource';

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
      slug?: string;
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
  // Get the primary category for related posts
  const primaryCategory = article.categories?.nodes?.[0];
  const primaryGameTag = article.gameTags?.nodes?.[0];

  const { data: gameRelatedData } = useQuery(GET_GAME_TAG_WITH_POSTS, {
    variables: { slug: primaryGameTag?.slug || '', first: 5 },
    skip: !primaryGameTag?.slug,
    client,
    fetchPolicy: 'cache-first',
    errorPolicy: 'ignore',
  });

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

  // Debug logging
  useEffect(() => {
    if (relatedError) console.log('Related posts error:', relatedError);
    if (sequentialError) console.log('Sequential posts error:', sequentialError);
    if (authorError) console.log('Author posts error:', authorError);
  }, [relatedError, sequentialError, authorError]);

  // Determine what articles to show (filter out current article)
  const currentSlug = (article as unknown as { slug?: string }).slug;
  const gameArticles = (gameRelatedData?.gameTag?.posts?.nodes || []).filter(
    (a: { id?: string; slug?: string }) => a.id !== article.id && a.slug !== currentSlug
  );
  const rawArticles = gameArticles.length ? gameArticles : relatedData?.posts?.nodes || [];
  const articlesToShow = rawArticles.filter(
    (a: { id?: string; slug?: string }) => a.id !== article.id && a.slug !== currentSlug
  );
  const isLoading = relatedLoading || sequentialLoading || authorLoading;
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
      {/* Meta Pixel content-interest signal (article title + primary category) */}
      <TrackViewContent name={article.title} category={primaryCategory?.name} />

      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      <div className="mx-auto max-w-[1170px] px-5 pt-24 sm:px-6 sm:pt-28">
        <Breadcrumbs items={[
          ...(primaryCategory ? [{ label: primaryCategory.name, href: `/${primaryCategory.slug || (primaryCategory.name.toLowerCase() === 'tech' ? 'technology' : primaryCategory.name.toLowerCase())}` }] : []),
          { label: article.title }
        ]} />
        <div className="article-heading-grid border-b border-gray-700/70 pb-6 pt-4 sm:pb-8">
          <div>
            <h1 className="mb-5 text-[30px] leading-[1.16] text-white sm:text-4xl lg:text-[44px]">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-gray-400">
              {article.author?.node?.name && (
                <Link href={`/author/${article.author.node.slug || ''}`} className="text-yellow-400 hover:text-yellow-300">
                  {article.author.node.name}
                </Link>
              )}
              <span>{Math.ceil(article.content.replace(/<[^>]*>/g, ' ').split(/\s+/).length / 200)} {t('article.minRead')}</span>
              <span className="basis-full text-gray-300 sm:basis-auto">
                <time dateTime={showUpdatedTimestamp ? article.modified : article.date}>
                  {showUpdatedTimestamp && updatedDate ? t('article.updatedOn', { date: updatedDate }) : t('article.publishedOn', { date: publishedDate })}
                </time>
              </span>
            </div>
            <div className="mt-5">
              <GooglePreferredSource />
            </div>
          </div>
          {featuredImageSrc && !featuredImageError && (
            <div className="relative hidden h-[200px] overflow-hidden rounded sm:block">
              <Image src={featuredImageSrc} alt={article.title} fill sizes="(min-width: 1024px) 290px, 230px"
                style={{ objectFit: 'cover' }} priority placeholder="blur" blurDataURL={PLACEHOLDER_BASE64}
                onError={() => setFeaturedImageError(true)} />
            </div>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="relative z-10 px-5 sm:px-6">
        <div className="flex justify-center max-w-[1122px] mx-auto gap-12">
          {/* Left sidebar removed — in-article ads provide better viewability */}

          {/* Main Content - Centered with wider sidebar */}
          {/* min-w-0 is critical in flex layouts: wide ad/embed children otherwise force the whole
              article column wider than the viewport on mobile. Keep clipping on the inner padding
              wrapper so the column can shrink without breaking responsive ad iframes. */}
          <div className="grow basis-0 min-w-0 max-w-3xl xl:max-w-[740px] bg-gray-900">
          <div className="py-6 sm:py-7">
            <ArticleBodyWithAds
              content={contentFinal}
              sourceSansClassName={sourceSans.className}
              articleTitle={article.title}
              categoryName={primaryCategory?.name || 'Gaming'}
            />

            <div className="mt-8 mb-6 border-t border-gray-700/50 pt-6">
              <GooglePreferredSource />
            </div>

            {primaryGameTag && <GameMetaCard gameTag={primaryGameTag} />}

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

            {/* Conditional Review summary block at end of content.
                Review JSON-LD is emitted once, server-side, in app/[slug]/page.tsx. */}
            {isReview && reviewConfig && (
              <ReviewSummary
                articleTitle={article.title}
                fallbackImage={featuredImageSrc}
                config={reviewConfig}
              />
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

          <aside className="hidden xl:block w-[290px] flex-shrink-0 pt-7">
            <div className="sticky top-24 space-y-8">
              <TableOfContents content={contentCleaned} minHeadings={4} variant="sidebar" />
              {primaryGameTag && gameArticles.length > 0 && (
                <section className="border-t-2 border-yellow-400 pt-4">
                  <h2 className="mb-3 text-lg">{primaryGameTag.name}</h2>
                  {gameArticles.slice(0, 3).map((post: { id: string; slug: string; title: string }) => (
                    <Link key={post.id} href={`/${post.slug}`} className="block border-b border-gray-700 py-3 text-sm leading-relaxed text-gray-300 hover:text-yellow-400">{post.title}</Link>
                  ))}
                </section>
              )}
              {SHOW_MANUAL_ADS && <div><div className="ad-label text-xs mb-3">{t('article.adLabel')}</div><VerticalAd adSlot="1258229391" /></div>}
            </div>
          </aside>
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
          gameArticles.length && primaryGameTag ? t('article.relatedCategoryTitle', { category: primaryGameTag.name }) : relatedData?.posts?.nodes?.length > 0 && primaryCategory
            ? t('article.relatedCategoryTitle', { category: primaryCategory.name })
            : articlesToShow?.length > 0
              ? t('article.youMightLike')
              : t('article.relatedTitle')
        }
      />
    </div>
  );
}
