import { GET_POST_BY_SLUG } from '../lib/queries/getPostBySlug';
import { gql } from '@apollo/client';
import client from '../lib/apolloClient';
import ArticleContent from '../components/Article/ArticleContent';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { absoluteUrl } from '../lib/seo';
import siteConfig from '../lib/siteConfig';

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

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const baseUrl = siteConfig.url;
  const { data } = await client.query({
    query: GET_POST_BY_SLUG,
    variables: { id: params.slug },
  });

  const article = data?.post;
  const seo = article?.seo;

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const stripHtml = (value: string | undefined) =>
    value ? value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  const description = stripHtml(seo?.metaDesc || article.excerpt || article.title);
  const openGraphDescription = stripHtml(seo?.opengraphDescription || description);
  const twitterDescription = stripHtml(seo?.twitterDescription || description);
  const rawImage =
    seo?.opengraphImage?.sourceUrl ||
    article.featuredImage?.node?.sourceUrl ||
    siteConfig.ogImagePath;
  const imageUrl = absoluteUrl(rawImage);
  const authorName = article.author?.node?.name;

  return {
    title: seo?.title || `${article.title} | ${siteConfig.name}`,
    description: description || article.title,
    keywords: article.categories?.nodes?.map((c: { name: string }) => c.name),
    authors: authorName ? [{ name: authorName }] : undefined,
    robots: {
      index: !seo?.metaRobotsNoindex,
      follow: !seo?.metaRobotsNofollow,
    },
    openGraph: {
      title: seo?.opengraphTitle || article.title,
      description: openGraphDescription || description,
      images: [{ url: imageUrl }],
      url: `${baseUrl}/${article.slug}`,
      type: 'article',
      publishedTime: article.date,
      modifiedTime: article.modified,
      ...(authorName ? { authors: [authorName] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      title: seo?.twitterTitle || article.title,
      description: twitterDescription || description,
      images: [absoluteUrl(seo?.twitterImage?.sourceUrl || imageUrl)],
    },
    alternates: {
      canonical: `${baseUrl}/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { data } = await client.query({
    query: GET_POST_BY_SLUG,
    variables: { id: params.slug },
  });

  const article = data?.post;

  if (!article) {
    notFound();
  }

  // Fetch gameTags separately — the taxonomy may not exist on all backends (e.g. finalboss.fr)
  try {
    const { data: gameTagData } = await client.query({
      query: GET_POST_GAME_TAGS,
      variables: { id: params.slug },
    });
    if (gameTagData?.post?.gameTags) {
      article.gameTags = gameTagData.post.gameTags;
    }
  } catch {
    // gameTags taxonomy not available on this backend — skip silently
  }

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            image: article.featuredImage?.node?.sourceUrl,
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
            datePublished: article.date,
            dateModified: article.modified,
            description: (article.excerpt || article.title || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${siteConfig.url}/${article.slug}`,
            },
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
