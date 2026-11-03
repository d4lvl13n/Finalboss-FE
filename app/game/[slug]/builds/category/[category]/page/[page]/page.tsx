import { notFound, permanentRedirect } from 'next/navigation';
import BuildCollectionPage from '@/app/components/totk-builds/BuildCollectionPage';
import { TOTK_BUILDS } from '@/app/lib/totk-builds/catalogue';
import { TOTK_GAME_SLUG } from '@/app/lib/totk-builds/types';
import { TOTK_COLLECTIONS, cataloguePath, collectionPageCount, paginatedCollectionParams } from '@/app/lib/totk-builds/collections';
import { collectionSeo } from '@/app/lib/totk-builds/seo';

export const revalidate = 86400;
export const dynamicParams = false;
type Props = { params: { slug: string; category: string; page: string } };
export function generateStaticParams() {
  return TOTK_COLLECTIONS.filter((c) => c.id !== 'all').flatMap((c) => ['1', ...paginatedCollectionParams(TOTK_BUILDS, c.id)].map((page) => ({ slug: TOTK_GAME_SLUG, category: c.id, page })));
}
function categoryFrom(params: Props['params']) {
  const collection = TOTK_COLLECTIONS.find((c) => c.id === params.category && c.id !== 'all');
  if (params.slug !== TOTK_GAME_SLUG || !collection) notFound();
  return collection.id;
}
export function generateMetadata({ params }: Props) { return collectionSeo(categoryFrom(params), Number(params.page)); }
export default function PaginatedBuildCategoryPage({ params }: Props) {
  const category = categoryFrom(params);
  const page = Number(params.page);
  if (page === 1) permanentRedirect(cataloguePath(category));
  if (!/^\d+$/.test(params.page) || !Number.isSafeInteger(page) || page < 2 || page > collectionPageCount(TOTK_BUILDS, category)) notFound();
  return <BuildCollectionPage category={category} page={page} />;
}
