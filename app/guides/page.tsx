import SectionPage from '../components/Section/SectionPage';
import GuidesStructuredData from '../components/Guides/GuidesStructuredData';
import { GET_GUIDE_CATEGORIES_AND_POSTS } from '../lib/queries/getGuideCategories';
import client from '../lib/apolloClient';
import { fetchSectionPosts } from '../lib/sectionPosts';
import { buildPageMetadata } from '../lib/seo';
import siteConfig from '../lib/siteConfig';

export const revalidate = 3600;

const description = `Master every quest with ${siteConfig.name} guides, walkthroughs, and strategy breakdowns.`;

export async function generateMetadata() {
  return buildPageMetadata({ title: 'Game Guides & Walkthroughs', description, path: '/guides' });
}

interface GuideCategory {
  id: string;
  name: string;
  slug: string;
}

// The category tree is the heavy part of this query on the WordPress side (it
// has crashed PHP at high post counts). Ask it for a single post: the guides
// themselves come from the shared section query. A failure here only hides the
// "by game" links, it never fails the page.
async function getGuideCategories(): Promise<GuideCategory[]> {
  try {
    const { data } = await client.query({
      query: GET_GUIDE_CATEGORIES_AND_POSTS,
      variables: { first: 1, after: null },
      fetchPolicy: 'no-cache',
    });
    return data?.categories?.nodes?.[0]?.children?.nodes ?? [];
  } catch {
    return [];
  }
}

export default async function GuidesPage() {
  const [data, subcategories] = await Promise.all([fetchSectionPosts('gaming-guide'), getGuideCategories()]);

  return (
    <SectionPage
      title="Game Guides"
      description={description}
      data={data}
      categoryName="gaming-guide"
      chips={subcategories.map((c) => ({ name: c.name.replace(/\s+Guide$/i, ''), href: `/guides/${c.slug}` }))}
      chipsLabel="Guides by game"
    >
      <GuidesStructuredData categories={subcategories} guides={data.posts} />
    </SectionPage>
  );
}
