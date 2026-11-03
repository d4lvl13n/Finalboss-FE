import { notFound } from 'next/navigation';
import RecipeCollectionPage from '@/app/components/totk-recipes/RecipeCollectionPage';
import { TOTK_GAME } from '@/app/lib/totk-recipes/types';
import { recipeCollectionMetadata } from '@/app/lib/totk-recipes/seo';
export const revalidate = 86400;
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ slug: TOTK_GAME }];
}
export function generateMetadata() {
  return recipeCollectionMetadata();
}
export default function RecipesPage({ params }: { params: { slug: string } }) {
  if (params.slug !== TOTK_GAME) notFound();
  return <RecipeCollectionPage />;
}
