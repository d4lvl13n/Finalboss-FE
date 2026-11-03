import { notFound, permanentRedirect } from 'next/navigation';
import BuildCollectionPage from '@/app/components/totk-builds/BuildCollectionPage';
import { TOTK_BUILDS } from '@/app/lib/totk-builds/catalogue';
import { TOTK_GAME_SLUG } from '@/app/lib/totk-builds/types';
import { cataloguePath, collectionPageCount, paginatedCollectionParams } from '@/app/lib/totk-builds/collections';
import { collectionSeo } from '@/app/lib/totk-builds/seo';

export const revalidate = 86400;
export const dynamicParams = false;
type Props = { params: { slug: string; page: string } };
export function generateStaticParams() {
  return ['1', ...paginatedCollectionParams(TOTK_BUILDS, 'all')].map((page) => ({ slug: TOTK_GAME_SLUG, page }));
}
export function generateMetadata({ params }: Props) { return collectionSeo('all', Number(params.page)); }
export default function PaginatedBuildsPage({ params }: Props) {
  if (params.slug !== TOTK_GAME_SLUG || !/^\d+$/.test(params.page)) notFound();
  const page = Number(params.page);
  if (page === 1) permanentRedirect(cataloguePath());
  if (!Number.isSafeInteger(page) || page < 2 || page > collectionPageCount(TOTK_BUILDS, 'all')) notFound();
  return <BuildCollectionPage page={page} />;
}
