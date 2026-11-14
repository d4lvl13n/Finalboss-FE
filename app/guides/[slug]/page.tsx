import SectionPage from '../../components/Section/SectionPage';
import type { SectionPost } from '../../lib/sectionQuery';
import client from '../../lib/apolloClient';
import { GET_SUBCATEGORY_ARTICLES } from '../../lib/queries/getSubcategoryArticles';
import { buildPageMetadata } from '../../lib/seo';
import siteConfig from '../../lib/siteConfig';
import { cache } from 'react';
import { permanentRedirect } from 'next/navigation';

interface GuideCategoryProps {
  params: { slug: string };
}

const getCategory = cache(async (slug: string) => {
  const { data, errors } = await client.query({
    query: GET_SUBCATEGORY_ARTICLES,
    variables: { categorySlug: slug, first: 24, after: null },
    fetchPolicy: 'no-cache',
  });
  if (errors?.length || !data?.posts || !data?.categories) throw new Error('Failed to fetch guide category');
  const category = data.categories.nodes[0];
  // Resolve the category before streaming metadata. Old /guides/article-slug
  // addresses still receive an HTTP redirect to their canonical article URL.
  if (!category || category.parent?.node?.slug !== 'gaming-guide') permanentRedirect(`/${slug}`);
  return { title: category.name.replace(/\s+guide$/i, ''), posts: data.posts };
});

export async function generateMetadata({ params }: GuideCategoryProps) {
  const { title: titleFragment } = await getCategory(params.slug);
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
export const dynamic = 'force-static';

export default async function GuideCategoryPage({ params }: GuideCategoryProps) {
  const baseUrl = siteConfig.url;
  const { title: titleFragment, posts } = await getCategory(params.slug);
  const initialArticles: SectionPost[] = posts.nodes;

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
    <SectionPage
      title={`${titleFragment} Guides`}
      description={`Explore walkthroughs, tips, and strategies for ${titleFragment}.`}
      data={{
        posts: initialArticles,
        hasNextPage: Boolean(posts.pageInfo?.hasNextPage),
        endCursor: posts.pageInfo?.endCursor ?? null,
      }}
      // WordPress accepts the category slug here, so "load more" stays inside this game
      categoryName={params.slug}
      chips={[{ name: 'All game guides', href: '/guides' }]}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionStructuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }} />
    </SectionPage>
  );
}
