import { GET_POST_BY_SLUG } from '../../lib/queries/getPostBySlug';
import client from '../../lib/apolloClient';
import ArticleContent from '../../components/Article/ArticleContent';
import { Metadata } from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface PageProps {
  params: { category: string; slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data } = await client.query({
    query: GET_POST_BY_SLUG,
    variables: { id: params.slug },
  });

  const article = data?.post;

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | FinalBoss.io`,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      images: [{ url: article.featuredImage?.node?.sourceUrl }],
      url: `https://finalboss.io/${article.slug}`,
      type: 'article',
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
            },
            datePublished: article.date,
            description: article.excerpt || article.title,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://finalboss.io/${article.slug}`,
            },
          }),
        }}
      />
      <ArticleContent article={article} />
      <Footer />
    </>
  );
}
