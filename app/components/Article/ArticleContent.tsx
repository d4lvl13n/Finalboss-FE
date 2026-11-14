import type { CSSProperties } from 'react';
import Link from 'next/link';
import '../../styles/article.css';
import '../../styles/ads.css';
import '../../styles/boss.css';
import { formatDate } from '../../utils/formatDate';
import RelatedArticles from './RelatedArticles';
import { ResponsiveAd, VerticalAd } from '../AdSense/AdBanner';
import InlineRelatedLinks from './InlineRelatedLinks';
import { SHOW_MANUAL_ADS } from '../../lib/adsConfig';
import { contextualizeKinguinLinks } from '../../lib/kinguin';
import { normalizeWordPressImageSrc } from '../../lib/imageUrl';
import { articleHeadings } from '../../lib/articleHeadings';
import type { ArticleExtras } from '../../lib/articleExtras';
import ReviewSummary, { ReviewConfig } from '../Review/ReviewSummary';
import Breadcrumbs from '../Breadcrumbs';
import TableOfContents from './TableOfContents';
import ArticleBodyWithAds from './ArticleBodyWithAds';
import ArticleReactions, { type ContentType } from './ArticleReactions';
import TrackViewContent from '../TrackViewContent';
import GooglePreferredSource from '../GooglePreferredSource';
import GameMetaCard from '../GameMetaCard';
import { t } from '../../lib/i18n';

// SERVER component. The article shell, its body and its related links are all
// rendered at generation time. Only the pieces that genuinely need the browser
// stay client-side as small leaves: ads, reactions, the Meta Pixel signal.

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

// Define a more specific type for the article object
interface ArticleData {
  id?: string;
  slug?: string;
  title: string;
  content: string;
  excerpt?: string;
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
  extras: ArticleExtras;
}

// 1x1 transparent GIF. Phones get this instead of the cover image: below 640px
// the cover is not shown, so it must not be downloaded either.
const BLANK_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

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

function plainText(html: string | undefined): string {
  return html ? html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';
}

export default function ArticleContent({ article, extras }: ArticleContentProps) {
  const primaryCategory = article.categories?.nodes?.[0];
  const primaryGameTag = article.gameTags?.nodes?.[0];
  const currentSlug = article.slug;

  const gameArticles = extras.gameArticles;
  const articlesToShow = gameArticles.length ? gameArticles : extras.related;

  const publishedDate = formatDate(article.date);
  const updatedDate = article.modified ? formatDate(article.modified) : null;
  const showUpdatedTimestamp =
    article.modified && new Date(article.modified).getTime() !== new Date(article.date).getTime();
  const featuredImageSrc = normalizeWordPressImageSrc(article.featuredImage?.node.sourceUrl);

  // Detect review category
  const isReview = Boolean(
    article.categories?.nodes?.some((c) => c?.name?.toLowerCase() === 'reviews' || c?.slug === 'reviews'),
  );

  const { config: reviewConfig, cleaned: contentCleaned } = extractReviewConfig(article.content);

  // Make the in-article Kinguin link game-specific: a guide about <game> should
  // send readers to keys for THAT game (geo-agnostic, relevant to a global PC
  // audience), not the generic homepage. No-ops when the post has no game tag.
  const contentFinal = contextualizeKinguinLinks(contentCleaned, primaryGameTag?.name);

  // The health bar has one segment per main section of the article.
  const phases = Math.min(12, Math.max(1, articleHeadings(contentCleaned).filter((h) => h.level === 2).length));
  const bossName = primaryGameTag?.name || primaryCategory?.name || '';
  const minutes = Math.ceil(plainText(article.content).split(/\s+/).length / 200);
  const dek = plainText(article.excerpt);

  return (
    // overflow-x-clip (NOT hidden): hidden creates a scroll container and silently
    // disables position:sticky for all descendants (sidebar ads, health bar). clip
    // clips without breaking sticky — same pattern as body/#__content in layout.tsx.
    <div
      className="fb-article min-h-screen overflow-x-clip"
      style={{ '--phases': phases } as CSSProperties}
    >
      {/* Meta Pixel content-interest signal (article title + primary category) */}
      <TrackViewContent name={article.title} category={primaryCategory?.name} />

      <header className={`fb-lead${featuredImageSrc ? ' fb-lead-art' : ''}`}>
        {featuredImageSrc && (
          <picture className="fb-lead-bg">
            <source media="(min-width: 640px)" srcSet={featuredImageSrc} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BLANK_PIXEL} alt={article.title} fetchPriority="high" decoding="async" />
          </picture>
        )}
        <div className="fb-wrap fb-lead-in">
          <Breadcrumbs
            items={[
              ...(primaryCategory
                ? [
                    {
                      label: primaryCategory.name,
                      href: `/${primaryCategory.slug || (primaryCategory.name.toLowerCase() === 'tech' ? 'technology' : primaryCategory.name.toLowerCase())}`,
                    },
                  ]
                : []),
              { label: article.title },
            ]}
          />
          <h1>{article.title}</h1>
          {dek && <p className="fb-dek">{dek}</p>}
          <div className="fb-byline">
            {article.author?.node?.name && (
              <Link prefetch={false} href={`/author/${article.author.node.slug || ''}`}>
                {article.author.node.name}
              </Link>
            )}
            <span>
              {minutes} {t('article.minRead')}
            </span>
            <time dateTime={showUpdatedTimestamp ? article.modified : article.date}>
              {showUpdatedTimestamp && updatedDate
                ? t('article.updatedOn', { date: updatedDate })
                : t('article.publishedOn', { date: publishedDate })}
            </time>
          </div>
        </div>
      </header>

      {/* Reading progress as a boss health bar. Pure CSS (scroll-driven
          animation): no JavaScript, and a static full bar where unsupported. */}
      <div className="fb-fight" aria-hidden="true">
        <div className="fb-wrap fb-boss">
          {bossName && <span className="fb-boss-name">{bossName}</span>}
          <span className="fb-bar">
            <span className="fb-fill" />
          </span>
          <span className="fb-hp" />
        </div>
      </div>

      {/* Article Content */}
      <div className="relative z-10 px-5 sm:px-6">
        <div className="fb-cols">
          <nav className="fb-rail hidden xl:block" aria-label={t('article.tableOfContents')}>
            <div className="sticky top-32">
              <TableOfContents content={contentCleaned} minHeadings={4} variant="sidebar" />
            </div>
          </nav>

          {/* min-w-0 is critical in flex layouts: wide ad/embed children otherwise force the whole
              article column wider than the viewport on mobile. Keep clipping on the inner padding
              wrapper so the column can shrink without breaking responsive ad iframes. */}
          <div className="grow basis-0 min-w-0 max-w-3xl xl:max-w-[740px]">
            <div className="py-6 sm:py-7">
              <ArticleBodyWithAds
                content={contentFinal}
                articleTitle={article.title}
                categoryName={primaryCategory?.name || 'Gaming'}
              />

              {primaryGameTag && <GameMetaCard gameTag={primaryGameTag} />}

              {/* Conditional Review summary block at end of content.
                  Review JSON-LD is emitted once, server-side, in app/[slug]/page.tsx. */}
              {isReview && reviewConfig && (
                <ReviewSummary articleTitle={article.title} fallbackImage={featuredImageSrc} config={reviewConfig} />
              )}

              {/* End panel: the fight is over. Reactions + what to read next. */}
              <section className="fb-win not-prose">
                <h2>{t('article.bossCleared')}</h2>
                <p>{t('article.bossClearedSub')}</p>
                {currentSlug && (
                  <ArticleReactions
                    slug={currentSlug}
                    postId={article.id}
                    game={primaryGameTag?.name}
                    contentType={detectContentType(article.categories?.nodes, isReview)}
                  />
                )}
                <InlineRelatedLinks articles={articlesToShow.slice(0, 3)} />
              </section>

              <div className="fb-source">
                <GooglePreferredSource />
              </div>

              {/* Compact author byline at end of article */}
              <div className="fb-author">
                <Link prefetch={false} href={`/author/${article.author?.node?.slug || ''}`} className="fb-author-badge" aria-hidden="true" tabIndex={-1}>
                  {article.author?.node?.name?.charAt(0)}
                </Link>
                <div>
                  <Link prefetch={false} href={`/author/${article.author?.node?.slug || ''}`}>
                    {article.author?.node?.name}
                  </Link>
                  <div className="fb-author-dates">
                    {t('article.publishedOn', { date: publishedDate })}
                    {showUpdatedTimestamp && updatedDate && <span> · {t('article.updatedOn', { date: updatedDate })}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="hidden xl:block w-[290px] flex-shrink-0 pt-7">
            <div className="sticky top-32 space-y-8">
              {articlesToShow.length > 0 && (
                <section className="fb-side">
                  <h2>{(gameArticles.length ? primaryGameTag?.name : primaryCategory?.name) || t('article.relatedTitle')}</h2>
                  {articlesToShow.slice(0, 4).map((post) => (
                    <Link prefetch={false} key={post.id} href={`/${post.slug}`}>
                      {post.title}
                    </Link>
                  ))}
                </section>
              )}
              {SHOW_MANUAL_ADS && (
                <div>
                  <div className="ad-label text-xs mb-3">{t('article.adLabel')}</div>
                  <VerticalAd adSlot="1258229391" />
                </div>
              )}
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

      <RelatedArticles
        articles={articlesToShow}
        sequentialPosts={{ newer: extras.newer, older: extras.older }}
        authorPosts={extras.authorPosts}
        sectionTitle={
          gameArticles.length && primaryGameTag
            ? t('article.relatedCategoryTitle', { category: primaryGameTag.name })
            : extras.related.length > 0 && primaryCategory
              ? t('article.relatedCategoryTitle', { category: primaryCategory.name })
              : t('article.relatedTitle')
        }
      />
    </div>
  );
}
