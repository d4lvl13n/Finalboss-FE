import { notFound, permanentRedirect } from 'next/navigation';
import RecipeCollectionPage from '@/app/components/totk-recipes/RecipeCollectionPage';
import { RECIPES_PATH, TOTK_GAME } from '@/app/lib/totk-recipes/types';
import {
  recipePageCount,
  recipePageParams,
} from '@/app/lib/totk-recipes/catalogue';
import { recipeCollectionMetadata } from '@/app/lib/totk-recipes/seo';
export const revalidate = 86400;
export const dynamicParams = false;
type Props = { params: { slug: string; page: string } };
export function generateStaticParams() {
  return ['1', ...recipePageParams()].map((page) => ({
    slug: TOTK_GAME,
    page,
  }));
}
export function generateMetadata({ params }: Props) {
  return recipeCollectionMetadata('all', Number(params.page));
}
export default function RecipesPage({ params }: Props) {
  if (params.slug !== TOTK_GAME || !/^\d+$/.test(params.page)) notFound();
  const page = Number(params.page);
  if (page === 1) permanentRedirect(RECIPES_PATH);
  if (!Number.isSafeInteger(page) || page < 2 || page > recipePageCount())
    notFound();
  return <RecipeCollectionPage page={page} />;
}
