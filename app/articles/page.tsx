import { fetchTotalPosts } from '../lib/pagination';
import { buildPageMetadata } from '../lib/seo';
import siteConfig from '../lib/siteConfig';
import SectionPage from '../components/Section/SectionPage';
import { fetchSectionPosts, type SectionPost } from '../lib/sectionPosts';
const baseUrl = siteConfig.url;
const PAGE_SIZE = 24;

// The publish/update cron invalidates this listing every five minutes when needed.
// An hourly fallback avoids rebuilding it every minute just because it is visited.
export const revalidate = 3600;

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'All Articles',
    description: 'Explore every article across news, reviews, guides, and technology.',
    path: '/articles',
  });
}

export default async function AllArticlesPage() {
  let data = { posts: [] as SectionPost[], hasNextPage: false, endCursor: null as string | null };
  let totalCount = 0;

  try {
    data = await fetchSectionPosts(null);
    // Total comes from the REST headers — GraphQL only exposes it via the
    // offset-pagination plugin, which is no longer active on the backend.
    totalCount = (await fetchTotalPosts().catch(() => 0)) || data.posts.length;
  } catch (error) {
    console.error('Error fetching articles:', error);
    // Continue with an empty list
  }

  const collectionStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All Articles',
    description: 'Explore every article across news, reviews, guides, and technology.',
    url: `${baseUrl}/articles`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: data.posts.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: { '@type': 'Article', name: article.title, url: `${baseUrl}/${article.slug}` },
      })),
    },
  };
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: `${baseUrl}/articles` },
    ],
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <SectionPage
      title="All Articles"
      description="Explore every article across news, reviews, guides, and technology."
      data={data}
      categoryName={null}
      olderHref={totalPages > 1 ? '/articles/page/2' : undefined}
      olderLabel="Browse older articles"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionStructuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }} />
    </SectionPage>
  );
}
