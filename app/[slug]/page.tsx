import { GET_POST_BY_SLUG } from '../lib/queries/getPostBySlug';
import { gql } from '@apollo/client';
import client from '../lib/apolloClient';
import ArticleContent from '../components/Article/ArticleContent';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { absoluteUrl } from '../lib/seo';
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

// Deduplicate the post query between generateMetadata and the page component
// React cache() ensures the same slug only fetches once per request lifecycle.
const getPost = cache(async (slug: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
  try {
    const { data } = await client.query({
      query: GET_POST_BY_SLUG,
      variables: { id: slug },
      context: { fetchOptions: { signal: controller.signal } },
    });
    return data?.post || null;
  } catch (err) {
    // If the request timed out or failed, return null
    console.error(`[getPost] Failed to fetch post "${slug}":`, err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
});

// Fetch gameTags separately with its own timeout
const getPostGameTags = cache(async (slug: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout
  try {
    const { data } = await client.query({
      query: GET_POST_GAME_TAGS,
      variables: { id: slug },
      context: { fetchOptions: { signal: controller.signal } },
    });
    return data?.post?.gameTags || null;
  } catch {
    // gameTags taxonomy not available or timed out — skip silently
    return null;
  } finally {
    clearTimeout(timeout);
  }
});

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const baseUrl = siteConfig.url;
  const article = await getPost(params.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const stripHtml = (value: string | undefined) =>
    value ? value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  const description = stripHtml(article.excerpt || article.title);
  const authorName = article.author?.node?.name;

  // Discover requires og:image ≥1200px wide for hero cards.
  // Fall back to the default OG image (which we control) when the
  // featured image is missing or too narrow.
  const mediaWidth = article.featuredImage?.node?.mediaDetails?.width;
  const mediaHeight = article.featuredImage?.node?.mediaDetails?.height;
  const featuredUrl = article.featuredImage?.node?.sourceUrl;
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
    title: article.title,
    description: description || article.title,
    keywords: article.categories?.nodes?.map((c: { name: string }) => c.name),
    authors: authorName ? [{ name: authorName }] : undefined,
    openGraph: {
      title: article.title,
      description,
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
      title: article.title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/${article.slug}`,
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

  return (
    <>
      <head>
        <meta property="article:content_tier" content="free" />
      </head>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: article.title,
            image: [article.featuredImage?.node?.sourceUrl].filter(Boolean),
            author: {
              '@type': 'Person',
              name: article.author?.node?.name,
              description: article.author?.node?.description,
              image: article.author?.node?.avatar?.url,
              sameAs: [
                article.author?.node?.social?.twitter &&
                  `https://x.com/${article.author.node.social.twitter}`,
                article.author?.node?.social?.linkedin,
                article.author?.node?.social?.website,
              ].filter(Boolean),
            },
            publisher: {
              '@type': 'Organization',
              name: siteConfig.name,
              logo: {
                '@type': 'ImageObject',
                url: `${siteConfig.url}${siteConfig.logoPath}`,
              },
            },
            datePublished: article.date,
            dateModified: article.modified,
            description: (article.excerpt || article.title || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
            isAccessibleForFree: true,
            inLanguage: siteConfig.lang,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${siteConfig.url}/${article.slug}`,
            },
            ...(article.gameTags?.nodes?.length ? {
              about: article.gameTags.nodes.map((tag: { name: string; slug: string }) => ({
                '@type': 'VideoGame',
                name: tag.name,
                url: `${siteConfig.url}/game/${tag.slug}`,
              })),
            } : {}),
          }),
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
