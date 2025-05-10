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
      url: `https://finalboss.io/${article.slug}`,
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
      canonical: seo?.canonical || `https://finalboss.io/${article.slug}`,
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
              '@id': `https://finalboss.io/${article.slug}`,
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
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://finalboss.io/',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: article.title,
                item: `https://finalboss.io/${article.slug}`,
              },
            ],
          }),
        }}
      />
      <ArticleContent article={article} />
      <Footer />
      <link rel="canonical" href={`https://finalboss.io/${article.slug}`} />
    </>
  );
}
