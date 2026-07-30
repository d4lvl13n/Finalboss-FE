import { GET_POST_BY_SLUG, GET_POST_BY_SLUG_WITH_TAGS } from '../lib/queries/getPostBySlug';
import { gql } from '@apollo/client';
import client from '../lib/apolloClient';
import ArticleContent from '../components/Article/ArticleContent';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { absoluteUrl } from '../lib/seo';
import { normalizeWordPressImageSrc } from '../lib/imageUrl';
import siteConfig, { intlLocale } from '../lib/siteConfig';
import { cache } from 'react';

// Fallback-only query for gameTags — used when the backend's schema doesn't
// expose the taxonomy on `post` and the combined query is therefore rejected.
const GET_POST_GAME_TAGS = gql`
  query GetPostGameTags($id: ID!) {
    post(id: $id, idType: SLUG) {
      gameTags {
        nodes {
          name
          slug
          igdbId
          igdbData
        }
      }
    }
  }
`;

// Whether this backend's schema accepts `gameTags` on `post`. Starts optimistic:
// we try the single combined query, and only if the backend rejects the FIELD
// itself do we latch to false and use the two-query path for the rest of this
// lambda instance. So a supporting backend never pays the probe more than once,
// and a non-supporting one degrades to exactly the previous behaviour.
let backendSupportsGameTags = true;

// A GraphQL *validation* error about the gameTags field means "this schema
// doesn't have it" — permanent, so latch. Any other error (network, timeout,
// backend hiccup) is transient and must NOT disable the fast path.
function isGameTagsSchemaError(errors?: readonly { message: string }[]): boolean {
  if (!errors?.length) return false;
  return errors.some((e) => /gameTags/i.test(e.message) && /Cannot query field|Unknown field|not exist/i.test(e.message));
}

// Reject if a promise doesn't settle within `ms`. We deliberately DON'T use an
// AbortController signal in the fetch: passing a signal marks the underlying
// fetch uncacheable, which forces the whole route to render dynamically on every
// request (defeating `revalidate = 60`). With a plain timeout race, the fetch
// stays ISR-eligible, so a brief WordPress slowdown no longer forces a live
// round-trip — and no longer 404s every article at once.
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer)) as Promise<T>;
}

// Deduplicate the post query between generateMetadata and the page component.
// React cache() ensures the same slug only fetches once per request lifecycle.
//
// IMPORTANT: this must throw on a fetch failure (network/timeout/GraphQL error)
// and only return null for a GENUINE "post does not exist". A thrown error
// renders the error boundary (HTTP 500, which Google retries), whereas a null
// triggers notFound() (HTTP 404). Swallowing failures into null was soft-404'ing
// valid articles whenever the backend hiccuped.
const getPost = cache(async (slug: string) => {
  let { data, errors } = await withTimeout(
    client.query({
      query: backendSupportsGameTags ? GET_POST_BY_SLUG_WITH_TAGS : GET_POST_BY_SLUG,
      variables: { id: slug },
    }),
    10000,
    `[getPost] "${slug}"`,
  );

  // Backend schema has no gameTags on post: latch it off and retry the base
  // query once, so this request still succeeds rather than 500-ing.
  if (backendSupportsGameTags && !data?.post && isGameTagsSchemaError(errors)) {
    backendSupportsGameTags = false;
    console.warn(`[getPost] backend has no post.gameTags — falling back to two-query path`);
    ({ data, errors } = await withTimeout(
      client.query({ query: GET_POST_BY_SLUG, variables: { id: slug } }),
      10000,
      `[getPost:fallback] "${slug}"`,
    ));
  }

  if (!data?.post) {
    if (errors && errors.length) {
      // errorPolicy:'all' returns GraphQL errors here instead of throwing.
      // An empty result caused by a backend error is NOT a real 404.
      throw new Error(
        `[getPost] GraphQL error for "${slug}": ${errors
          .map((e: { message: string }) => e.message)
          .join('; ')}`,
      );
    }
    return null; // genuine 404: query succeeded, no errors, no post
  }
  return data.post;
});

// gameTags is supplementary (the taxonomy may not exist on all backends), so a
// failure here degrades gracefully to null and must NEVER fail the page.
//
// Only reached on backends where the combined query isn't supported — when it
// is, the tags already came back on the post and this second round trip is
// skipped entirely.
const getPostGameTags = cache(async (slug: string) => {
  try {
    const { data } = await withTimeout(
      client.query({ query: GET_POST_GAME_TAGS, variables: { id: slug } }),
      5000,
      `[getPostGameTags] "${slug}"`,
    );
    return data?.post?.gameTags || null;
  } catch {
    return null;
  }
});

// Articles are effectively immutable after publish, and WordPress pushes an
// on-demand revalidation on publish/update (app/api/notifications/article-published),
// so freshness no longer depends on a short window. Matches the 3600 used by
// every other content route. At 60s this route was regenerating 6k+ articles
// once a minute against an uncached backend and dominated function duration.
export const revalidate = 3600;

// REQUIRED for the revalidate above to do anything. Apollo's HttpLink issues a
// POST, which Next's Data Cache never caches; an uncached fetch opts the whole
// route out of the Full Route Cache, so Next was emitting
// `Cache-Control: private, no-cache, no-store` and every request — including
// every crawler hit across 6k+ articles — ran the function. `force-static` puts
// the route back under the Full Route Cache so ISR actually applies.
// `dynamicParams` stays true (the default): unknown slugs still render on demand.
export const dynamic = 'force-static';

interface PageProps {
  params: { slug: string };
}

function stripHtml(value: string | undefined): string {
  return value ? value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';
}

function cleanArticleTitle(value: string | undefined, fallback: string): string {
  const rawTitle = stripHtml(value || fallback);
  const withoutBrandSuffix = rawTitle
    .replace(/\s*(?:[-–—|:]\s*)(?:FinalBoss(?:\.io)?|Final Boss(?:\.io)?)(?:\s*[-–—|:].*)?$/i, '')
    .trim();

  return withoutBrandSuffix || stripHtml(fallback);
}

function buildMetaDescription(value: string | undefined, fallback: string): string {
  const description = stripHtml(value || fallback);
  if (description.length <= 155) {
    return description;
  }

  return `${description.slice(0, 152).trimEnd()}...`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const baseUrl = siteConfig.url;
  const article = await getPost(params.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const seo = article.seo;
  const seoTitle = cleanArticleTitle(seo?.title || article.title, article.title);
  const ogTitle = cleanArticleTitle(seo?.opengraphTitle || seoTitle, article.title);
  const description = buildMetaDescription(seo?.metaDesc || article.excerpt, article.title);
  const ogDescription = buildMetaDescription(seo?.opengraphDescription || description, article.title);
  const authorName = article.author?.node?.name;

  // Discover requires og:image ≥1200px wide for hero cards.
  // Fall back to the default OG image (which we control) when the
  // featured image is missing or too narrow.
  const mediaWidth = article.featuredImage?.node?.mediaDetails?.width;
  const mediaHeight = article.featuredImage?.node?.mediaDetails?.height;
  const featuredUrl = normalizeWordPressImageSrc(article.featuredImage?.node?.sourceUrl);
  const hasLargeEnoughImage = featuredUrl && typeof mediaWidth === 'number' && mediaWidth >= 1200;
  const rawImage = hasLargeEnoughImage ? featuredUrl : siteConfig.ogImagePath;
  const imageUrl = absoluteUrl(rawImage);

  const ogImage: { url: string; secureUrl?: string; width?: number; height?: number } = { url: imageUrl };
  if (imageUrl.startsWith('https://')) ogImage.secureUrl = imageUrl;
  if (hasLargeEnoughImage && typeof mediaWidth === 'number' && typeof mediaHeight === 'number') {
    ogImage.width = mediaWidth;
    ogImage.height = mediaHeight;
  }

  return {
    title: seoTitle,
    description: description || article.title,
    keywords: article.categories?.nodes?.map((c: { name: string }) => c.name),
    authors: authorName ? [{ name: authorName }] : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      siteName: siteConfig.siteName,
      images: [ogImage],
      url: `${baseUrl}/${article.slug}`,
      locale: intlLocale,
      type: 'article',
      publishedTime: article.date,
      modifiedTime: article.modified,
      section: article.categories?.nodes?.[0]?.name,
      tags: article.categories?.nodes?.map((c: { name: string }) => c.name),
      ...(authorName ? { authors: [authorName] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      title: ogTitle,
      description: ogDescription,
      images: [imageUrl],
    },
    alternates: {
      // An editor-set Yoast canonical (syndicated/duplicate content) wins over
      // the default self-referencing canonical.
      canonical: article.seo?.canonical?.trim() || `${baseUrl}/${article.slug}`,
    },
    other: {
      'article:content_tier': 'free',
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  // Deduplicated with generateMetadata via React cache. On backends that support
  // it, gameTags arrived with the post — no second round trip.
  const article = await getPost(params.slug);

  if (!article) {
    notFound();
  }

  if (!article.gameTags) {
    const gameTags = await getPostGameTags(params.slug);
    if (gameTags) {
      article.gameTags = gameTags;
    }
  }

  // Category-aware structured data: Review (with a real rating) for reviews,
  // NewsArticle for news, Article otherwise — so Google treats each type correctly
  // and we only claim rich-result schema we actually back with on-page data.
  const categoryNodes: { name?: string; slug?: string }[] = article.categories?.nodes || [];
  const hasCategory = (...names: string[]) =>
    categoryNodes.some(
      (c) => names.includes((c.slug || '').toLowerCase()) || names.includes((c.name || '').toLowerCase()),
    );
  // "gaming" is FinalBoss's de-facto news bucket (there is no "news" category).
  const isNews = hasCategory('gaming');
  const isReview = hasCategory('review', 'reviews');
  const primaryCategory = categoryNodes[0]?.name;

  const reviewedGame = article.gameTags?.nodes?.[0] as { name?: string; slug?: string } | undefined;
  const scoreMatch =
    typeof article.content === 'string'
      ? article.content.match(/(?:Score|Provisional\s+score)\s*:?\s*(\d+(?:[.,]\d+)?)\s*\/\s*10/i)
      : null;
  const reviewScore = scoreMatch ? Number(scoreMatch[1].replace(',', '.')) : null;

  const ldImage = [normalizeWordPressImageSrc(article.featuredImage?.node?.sourceUrl)].filter(Boolean);
  const ldAuthor = {
    '@type': 'Person',
    name: article.author?.node?.name,
    description: article.author?.node?.description,
    image: article.author?.node?.avatar?.url,
    sameAs: [
      article.author?.node?.social?.twitter && `https://x.com/${article.author.node.social.twitter}`,
      article.author?.node?.social?.linkedin,
      article.author?.node?.social?.website,
    ].filter(Boolean),
  };
  const ldPublisher = {
    '@type': 'Organization',
    name: siteConfig.name,
    logo: { '@type': 'ImageObject', url: `${siteConfig.url}${siteConfig.logoPath}` },
  };
  const ldDescription = (article.excerpt || article.title || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const ldPageId = `${siteConfig.url}/${article.slug}`;

  // A valid Review rich result requires a real on-page rating + the reviewed item.
  const postSchema =
    isReview && reviewScore != null && reviewedGame?.name
      ? {
          '@context': 'https://schema.org',
          '@type': 'Review',
          name: article.title,
          itemReviewed: {
            '@type': 'VideoGame',
            name: reviewedGame.name,
            ...(reviewedGame.slug ? { url: `${siteConfig.url}/game/${reviewedGame.slug}` } : {}),
          },
          reviewRating: { '@type': 'Rating', ratingValue: reviewScore, bestRating: 10, worstRating: 0 },
          author: ldAuthor,
          publisher: ldPublisher,
          datePublished: article.date,
          dateModified: article.modified,
          reviewBody: ldDescription,
          image: ldImage,
          inLanguage: siteConfig.lang,
          mainEntityOfPage: { '@type': 'WebPage', '@id': ldPageId },
        }
      : {
          '@context': 'https://schema.org',
          // A review is never NewsArticle; news (gaming) is, everything else is Article.
          '@type': isNews && !isReview ? 'NewsArticle' : 'Article',
          ...(primaryCategory ? { articleSection: primaryCategory } : {}),
          headline: article.title,
          image: ldImage,
          author: ldAuthor,
          publisher: ldPublisher,
          datePublished: article.date,
          dateModified: article.modified,
          description: ldDescription,
          isAccessibleForFree: true,
          inLanguage: siteConfig.lang,
          mainEntityOfPage: { '@type': 'WebPage', '@id': ldPageId },
          ...(article.gameTags?.nodes?.length
            ? {
                about: article.gameTags.nodes.map((tag: { name: string; slug: string }) => ({
                  '@type': 'VideoGame',
                  name: tag.name,
                  url: `${siteConfig.url}/game/${tag.slug}`,
                })),
              }
            : {}),
        };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(postSchema),
        }}
      />
      {/* Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: (function () {
              const base = siteConfig.url;
              const category = article.categories?.nodes?.[0];
              const items = [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
              ];
              if (category?.name && category?.slug) {
                items.push({
                  '@type': 'ListItem',
                  position: 2,
                  name: category.name,
                  item: `${base}/articles?category=${category.slug}`,
                });
                items.push({
                  '@type': 'ListItem',
                  position: 3,
                  name: article.title,
                  item: `${base}/${article.slug}`,
                });
              } else {
                items.push({
                  '@type': 'ListItem',
                  position: 2,
                  name: article.title,
                  item: `${base}/${article.slug}`,
                });
              }
              return items;
            })(),
          }),
        }}
      />
      <ArticleContent article={article} />
      <Footer />
    </>
  );
}
