import { notFound, permanentRedirect } from 'next/navigation';
import RecipeCollectionPage from '@/app/components/totk-recipes/RecipeCollectionPage';
import { EFFECTS, TOTK_GAME, recipesPath } from '@/app/lib/totk-recipes/types';
import {
  recipePageCount,
  recipePageParams,
} from '@/app/lib/totk-recipes/catalogue';
import { recipeCollectionMetadata } from '@/app/lib/totk-recipes/seo';
export const revalidate = 86400;
export const dynamicParams = false;
type Props = { params: { slug: string; effect: string; page: string } };
export function generateStaticParams() {
  return EFFECTS.flatMap((e) =>
    ['1', ...recipePageParams(e.slug)].map((page) => ({
      slug: TOTK_GAME,
      effect: e.slug,
      page,
    }))
  );
}
export function generateMetadata({ params }: Props) {
  return recipeCollectionMetadata(params.effect, Number(params.page));
}
export default function RecipesPage({ params }: Props) {
  if (
    params.slug !== TOTK_GAME ||
    !EFFECTS.some((e) => e.slug === params.effect) ||
    !/^\d+$/.test(params.page)
  )
    notFound();
  const page = Number(params.page);
  if (page === 1) permanentRedirect(recipesPath(params.effect));
  if (
    !Number.isSafeInteger(page) ||
    page < 2 ||
    page > recipePageCount(params.effect)
  )
    notFound();
  return <RecipeCollectionPage effect={params.effect} page={page} />;
}
