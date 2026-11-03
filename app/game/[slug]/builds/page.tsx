import { notFound } from 'next/navigation';
import BuildCollectionPage from '@/app/components/totk-builds/BuildCollectionPage';
import { TOTK_GAME_SLUG } from '@/app/lib/totk-builds/types';
import { collectionSeo } from '@/app/lib/totk-builds/seo';

export const revalidate = 86400;
export const dynamicParams = false;
export function generateStaticParams() { return [{ slug: TOTK_GAME_SLUG }]; }
export function generateMetadata() { return collectionSeo('all', 1); }

export default function TotkBuildsPage({ params }: { params: { slug: string } }) {
  if (params.slug !== TOTK_GAME_SLUG) notFound();
  return <BuildCollectionPage />;
}
