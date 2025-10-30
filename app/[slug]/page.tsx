import { GET_POST_BY_SLUG } from '../lib/queries/getPostBySlug';
import client from '../lib/apolloClient';
import ArticleContent from '../components/Article/ArticleContent';
import { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io';
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

  return {
    title: seo?.title || `${article.title} | FinalBoss.io`,
    description: seo?.metaDesc || article.excerpt || article.title,
    keywords: article.categories?.nodes?.map((c: { name: string }) => c.name),
    authors: article.author?.node?.name ? [{ name: article.author.node.name }] : undefined,
    robots: {
      index: !seo?.metaRobotsNoindex,
      follow: !seo?.metaRobotsNofollow,
    },
    openGraph: {
      title: seo?.opengraphTitle || article.title,
      description: seo?.opengraphDescription || article.excerpt,
      images: [{ 
        url: seo?.opengraphImage?.sourceUrl || article.featuredImage?.node?.sourceUrl 
      }],
      url: `${baseUrl}/${article.slug}`,
      type: 'article',
      publishedTime: article.date,
      modifiedTime: article.modified,
      authors: [article.author?.node?.name],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@finalbossio',
      title: seo?.twitterTitle || article.title,
      description: seo?.twitterDescription || article.excerpt,
      images: [seo?.twitterImage?.sourceUrl || article.featuredImage?.node?.sourceUrl],
    },
    alternates: {
      canonical: seo?.canonical || `${baseUrl}/${article.slug}`,
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
    return <div>Article not found</div>;
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
            description: article.excerpt || article.title,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io'}/${article.slug}`,
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
              const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io';
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
