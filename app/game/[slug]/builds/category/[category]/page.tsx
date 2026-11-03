import { notFound } from 'next/navigation';
import BuildCollectionPage from '@/app/components/totk-builds/BuildCollectionPage';
import { TOTK_GAME_SLUG } from '@/app/lib/totk-builds/types';
import { TOTK_COLLECTIONS } from '@/app/lib/totk-builds/collections';
import { collectionSeo } from '@/app/lib/totk-builds/seo';

export const revalidate = 86400;
export const dynamicParams = false;
type Props = { params: { slug: string; category: string } };
export function generateStaticParams() {
  return TOTK_COLLECTIONS.filter((c) => c.id !== 'all').map((c) => ({ slug: TOTK_GAME_SLUG, category: c.id }));
}
function categoryFrom(params: Props['params']) {
  const collection = TOTK_COLLECTIONS.find((c) => c.id === params.category && c.id !== 'all');
  if (params.slug !== TOTK_GAME_SLUG || !collection) notFound();
  return collection.id;
}
export function generateMetadata({ params }: Props) { return collectionSeo(categoryFrom(params), 1); }
export default function BuildCategoryPage({ params }: Props) { return <BuildCollectionPage category={categoryFrom(params)} />; }
