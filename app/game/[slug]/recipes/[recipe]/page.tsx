import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, CookingPot, Snowflake } from 'lucide-react';
import {
  TOTK_GAME,
  RECIPES_PATH,
  METHODS,
  methodLabel,
  recipePath,
} from '@/app/lib/totk-recipes/types';
import {
  TOTK_INGREDIENTS,
  TOTK_RECIPES,
  getRecipe,
} from '@/app/lib/totk-recipes/catalogue';
import { recipeJsonLd, recipeMetadata } from '@/app/lib/totk-recipes/seo';
import { breadcrumbJsonLd, graph } from '@/app/lib/jsonld';
import { CookingNav } from '@/app/components/totk-recipes/RecipeCollectionPage';
import RecipePreparation from '@/app/components/totk-recipes/RecipePreparation';
import RecipeCard from '@/app/components/totk-recipes/RecipeCard';
import styles from '@/app/components/totk-recipes/Recipes.module.css';
export const revalidate = 86400;
export const dynamicParams = false;
type Props = { params: { slug: string; recipe: string } };
export function generateStaticParams() {
  return TOTK_RECIPES.map((r) => ({ slug: TOTK_GAME, recipe: r.slug }));
}
export function generateMetadata({ params }: Props) {
  const recipe = getRecipe(params.recipe);
  return recipe ? recipeMetadata(recipe) : { title: 'Recipe not found' };
}
export default function RecipePage({ params }: Props) {
  const recipe =
    params.slug === TOTK_GAME ? getRecipe(params.recipe) : undefined;
  if (!recipe) notFound();
  const method = METHODS.find((m) => m.id === recipe.method)!;
  const related = TOTK_RECIPES.filter(
    (r) => r.number !== recipe.number && r.method === recipe.method
  )
    .sort(
      (a, b) =>
        Math.abs(a.number - recipe.number) - Math.abs(b.number - recipe.number)
    )
    .slice(0, 4);
  const ingredientNames = recipe.ingredients.map(
    (id) => TOTK_INGREDIENTS.find((i) => i.id === id)!.name
  );
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pb-16 pt-28 text-white">
      <div className="container mx-auto px-4">
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap gap-2 text-xs text-gray-400"
        >
          <Link
            prefetch={false}
            href={`/game/${TOTK_GAME}`}
            className="hover:text-yellow-400"
          >
            Tears of the Kingdom
          </Link>
          <span>/</span>
          <a href={RECIPES_PATH} className="hover:text-yellow-400">
            Recipes
          </a>
          <span>/</span>
          <span className="text-gray-200">{recipe.name}</span>
        </nav>
        <CookingNav active="recipes" />
        <a
          href={RECIPES_PATH}
          className="mb-6 inline-flex min-h-10 items-center gap-2 text-sm text-gray-400 hover:text-yellow-400"
        >
          <ArrowLeft size={15} />
          Back to the recipe book
        </a>
        <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
          <div>
            <div
              className={`${styles.plate} relative mb-7 flex h-64 items-center justify-center rounded-lg border border-gray-700 bg-gray-900 sm:h-80`}
            >
              <span className="absolute left-5 top-5 font-mono text-xs text-gray-500">
                #{String(recipe.number).padStart(3, '0')}
              </span>
              {recipe.image || recipe.ingredientImage ? (
                <Image
                  src={(recipe.image || recipe.ingredientImage)!}
                  alt={
                    recipe.image
                      ? recipe.name
                      : `Raw ingredient for ${recipe.name}`
                  }
                  width={200}
                  height={200}
                  priority
                  className="h-48 w-48 object-contain drop-shadow-xl"
                />
              ) : (
                <Snowflake size={100} className="text-gray-500" />
              )}
              {!recipe.image && (
                <span className="absolute bottom-5 left-5 text-xs text-gray-400">
                  Raw ingredient · freeze to prepare
                </span>
              )}
              <span className="absolute bottom-5 right-5 rounded-full bg-gray-800 px-4 py-2 text-xs text-yellow-400">
                {methodLabel(recipe.method)}
              </span>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-yellow-400">
              Tears of the Kingdom / Recipe #{recipe.number}
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              {recipe.name}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-gray-300">
              {recipe.description}
            </p>
            <section className="mt-7 rounded-lg bg-gray-800 p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-yellow-400">
                <CookingPot size={20} />
                How to make {recipe.name}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                {method.instruction}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                {recipe.variants.length
                  ? `One working combination uses ${ingredientNames.join(', ')}. ${recipe.variants.length > 1 ? 'Choose another effect in the ingredient panel to see an alternative combination.' : 'Use the simulator to try different quantities.'}`
                  : `Start with ${ingredientNames.join(', ')}. Follow the preparation method above to create recipe #${recipe.number}.`}
              </p>
              {recipe.number === 145 || recipe.number === 146 ? (
                <p className="mt-3 text-sm text-yellow-400">
                  This is a failed cooking result, included here because it has
                  a numbered recipe-book entry.
                </p>
              ) : null}
            </section>
          </div>
          <RecipePreparation recipe={recipe} ingredients={TOTK_INGREDIENTS} />
        </div>
        {!!related.length && (
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-yellow-400">
              Keep cooking
            </h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {related.map((r) => (
                <RecipeCard key={r.slug} recipe={r} />
              ))}
            </div>
          </section>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              graph([
                breadcrumbJsonLd([
                  { name: 'Games', path: '/games' },
                  { name: 'Tears of the Kingdom', path: `/game/${TOTK_GAME}` },
                  { name: 'Recipes', path: RECIPES_PATH },
                  { name: recipe.name, path: recipePath(recipe) },
                ]),
                recipeJsonLd(recipe),
              ])
            ).replace(/</g, '\\u003c'),
          }}
        />
      </div>
    </main>
  );
}
