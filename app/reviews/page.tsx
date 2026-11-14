import SectionPage from '../components/Section/SectionPage';
import ReviewsStructuredData from '../components/Reviews/ReviewsStructuredData';
import { fetchSectionPosts } from '../lib/sectionPosts';
import { buildPageMetadata } from '../lib/seo';
import siteConfig from '../lib/siteConfig';

export const revalidate = 3600;

const description = `Read in-depth game reviews, verdicts, and ratings from the ${siteConfig.name} editorial team.`;

export async function generateMetadata() {
  return buildPageMetadata({ title: 'Game Reviews', description, path: '/reviews' });
}

export default async function ReviewsPage() {
  // Throws on a backend failure: an error (retried by crawlers) is better than
  // caching an empty reviews page for an hour.
  const data = await fetchSectionPosts('Reviews');

  return (
    <SectionPage title="Game Reviews" description={description} data={data} categoryName="Reviews">
      <ReviewsStructuredData reviews={data.posts} />
    </SectionPage>
  );
}
