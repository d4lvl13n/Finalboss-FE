import GuideCategoryClient from '../../components/Guides/GuideCategoryClient';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import client from '../../lib/apolloClient';
import { GET_SUBCATEGORY_ARTICLES } from '../../lib/queries/getSubcategoryArticles';
import { buildPageMetadata } from '../../lib/seo';
import siteConfig from '../../lib/siteConfig';

interface GuideCategoryProps {
  params: { slug: string };
}

interface GuideArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
}

function formatSlug(slug: string) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: GuideCategoryProps) {
  const titleFragment = formatSlug(params.slug);
  return buildPageMetadata({
    title: `${titleFragment} Guides`,
    description: `Explore walkthroughs, tips, and strategies for ${titleFragment}.`,
    path: `/guides/${params.slug}`,
    robots: {
      index: true,
      follow: true,
    },
  });
}

export const revalidate = 3600;

export default async function GuideCategoryPage({ params }: GuideCategoryProps) {
  const baseUrl = siteConfig.url;
  const titleFragment = formatSlug(params.slug);

  let initialArticles: GuideArticle[] = [];
  let initialHasNextPage = false;
  let initialEndCursor: string | null = null;

  try {
    const { data } = await client.query({
      query: GET_SUBCATEGORY_ARTICLES,
      variables: { categorySlug: params.slug, first: 24, after: null },
      fetchPolicy: 'no-cache',
    });

    initialArticles = data?.posts?.nodes || [];
    initialHasNextPage = data?.posts?.pageInfo?.hasNextPage || false;
    initialEndCursor = data?.posts?.pageInfo?.endCursor || null;
  } catch (error) {
    console.error('Error fetching guide category:', error);
  }

  const collectionStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${titleFragment} Guides`,
    description: `Explore walkthroughs, tips, and strategies for ${titleFragment}.`,
    url: `${baseUrl}/guides/${params.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: initialArticles.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${baseUrl}/${article.slug}`,
        name: article.title,
      })),
    },
  };

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${baseUrl}/guides` },
      { '@type': 'ListItem', position: 3, name: `${titleFragment} Guides`, item: `${baseUrl}/guides/${params.slug}` },
    ],
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <GuideCategoryClient
        slug={params.slug}
        initialArticles={initialArticles}
        initialHasNextPage={initialHasNextPage}
        initialEndCursor={initialEndCursor}
      />
      <Footer />
    </>
  );
}
