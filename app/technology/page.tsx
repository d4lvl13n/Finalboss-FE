import SectionPage from '../components/Section/SectionPage';
import TechnologyStructuredData from '../components/TechnologyStructuredData';
import { fetchSectionPosts } from '../lib/sectionPosts';
import { buildPageMetadata } from '../lib/seo';

export const revalidate = 3600;

const description = 'Explore the latest in gaming technology, hardware reviews, and industry innovation.';

export async function generateMetadata() {
  return buildPageMetadata({ title: 'Gaming & Tech Articles', description, path: '/technology' });
}

export default async function TechnologyPage() {
  const data = await fetchSectionPosts('Tech');

  return (
    <SectionPage title="Gaming & Tech" description={description} data={data} categoryName="Tech">
      <TechnologyStructuredData articles={data.posts} />
    </SectionPage>
  );
}
