import { notFound } from 'next/navigation';
import RecipeCollectionPage from '@/app/components/totk-recipes/RecipeCollectionPage';
import { EFFECTS, TOTK_GAME } from '@/app/lib/totk-recipes/types';
import { recipeCollectionMetadata } from '@/app/lib/totk-recipes/seo';
export const revalidate = 86400;
export const dynamicParams = false;
type Props = { params: { slug: string; effect: string } };
export function generateStaticParams() {
  return EFFECTS.map((e) => ({ slug: TOTK_GAME, effect: e.slug }));
}
export function generateMetadata({ params }: Props) {
  return recipeCollectionMetadata(params.effect);
}
export default function RecipesPage({ params }: Props) {
  if (
    params.slug !== TOTK_GAME ||
    !EFFECTS.some((e) => e.slug === params.effect)
  )
    notFound();
  return <RecipeCollectionPage effect={params.effect} />;
}
