import SectionPage from '../components/Section/SectionPage';
import { fetchSectionPosts } from '../lib/sectionPosts';
import { buildPageMetadata } from '../lib/seo';
import { t } from '../lib/i18n';

export const revalidate = 3600;

const description = 'Stay updated with the latest gaming news, releases, esports, and community stories.';

export async function generateMetadata() {
  return buildPageMetadata({ title: 'Gaming News and Articles', description, path: '/gaming' });
}

export default async function GamingPage() {
  const data = await fetchSectionPosts('Gaming');
  return <SectionPage title={t('nav.news')} description={t('boss.newsIntro')} data={data} categoryName="Gaming" />;
}
