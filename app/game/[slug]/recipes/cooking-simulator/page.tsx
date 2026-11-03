import { notFound } from 'next/navigation';
import Link from 'next/link';
import CookingSimulator from '@/app/components/totk-recipes/CookingSimulator';
import { CookingNav } from '@/app/components/totk-recipes/RecipeCollectionPage';
import {
  RECIPE_SUMMARIES,
  TOTK_INGREDIENTS,
} from '@/app/lib/totk-recipes/catalogue';
import {
  RECIPES_PATH,
  TOTK_GAME,
  simulatorPath,
} from '@/app/lib/totk-recipes/types';
import { buildPageMetadata } from '@/app/lib/seo';
import { breadcrumbJsonLd } from '@/app/lib/jsonld';
export const revalidate = 86400;
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ slug: TOTK_GAME }];
}
export function generateMetadata() {
  return buildPageMetadata({
    title: 'Zelda TOTK Cooking Simulator & Recipe Calculator',
    description:
      'Choose up to five ingredients in the Zelda TOTK cooking simulator. Calculate the dish, hearts, effect, duration, critical-success chance and sell price.',
    path: simulatorPath(),
  });
}
export default function SimulatorPage({
  params,
}: {
  params: { slug: string };
}) {
  if (params.slug !== TOTK_GAME) notFound();
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pb-16 pt-28 text-white">
      <div className="container mx-auto px-4">
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap gap-2 text-xs text-gray-400"
        >
          <Link prefetch={false} href={`/game/${TOTK_GAME}`}>
            Tears of the Kingdom
          </Link>
          <span>/</span>
          <a href={RECIPES_PATH} className="hover:text-yellow-400">
            Recipes
          </a>
          <span>/</span>
          <span className="text-gray-200">Cooking simulator</span>
        </nav>
        <CookingNav active="simulator" />
        <header className="mb-8">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[.22em] text-yellow-400">
            The Hyrule kitchen
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Zelda TOTK cooking simulator
            <span className="text-yellow-400">.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300">
            A little less guesswork, a better meal. Pick your ingredients, put
            them in the pot, and see what you’ll make before you cook in Hyrule.
          </p>
        </header>
        <CookingSimulator
          ingredients={TOTK_INGREDIENTS}
          recipes={RECIPE_SUMMARIES}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              breadcrumbJsonLd([
                { name: 'Tears of the Kingdom', path: `/game/${TOTK_GAME}` },
                { name: 'Recipes', path: RECIPES_PATH },
                { name: 'Cooking simulator', path: simulatorPath() },
              ])
            ).replace(/</g, '\\u003c'),
          }}
        />
      </div>
    </main>
  );
}
