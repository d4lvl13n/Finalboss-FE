import { GET_POST_BY_SLUG } from '../lib/queries/getPostBySlug';
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

// Separate query for gameTags — may not exist on all WordPress backends
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
  const { data, errors } = await withTimeout(
    client.query({ query: GET_POST_BY_SLUG, variables: { id: slug } }),
    10000,
    `[getPost] "${slug}"`,
  );

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

export const revalidate = 60; // Revalidate article pages every 60 seconds

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
  // Fetch post (deduplicated with generateMetadata via React cache) and gameTags in parallel
  const [article, gameTags] = await Promise.all([
    getPost(params.slug),
    getPostGameTags(params.slug),
  ]);

  if (!article) {
    notFound();
  }

  if (gameTags) {
    article.gameTags = gameTags;
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
