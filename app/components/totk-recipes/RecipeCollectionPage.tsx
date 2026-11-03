import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowUpRight, BookOpen, CookingPot } from 'lucide-react';
import {
  EFFECTS,
  RECIPES_PATH,
  RECIPES_PER_PAGE,
  TOTK_GAME,
  recipePath,
  recipesPath,
  simulatorPath,
} from '@/app/lib/totk-recipes/types';
import {
  TOTK_INGREDIENTS,
  TOTK_RECIPES,
  recipePageCount,
  recipesForEffect,
} from '@/app/lib/totk-recipes/catalogue';
import { absoluteUrl } from '@/app/lib/seo';
import { breadcrumbJsonLd, graph } from '@/app/lib/jsonld';
import RecipeExplorer from './RecipeExplorer';
import styles from './Recipes.module.css';

export function CookingNav({ active }: { active: 'recipes' | 'simulator' }) {
  return (
    <nav
      aria-label="Tears of the Kingdom tools"
      className="mb-7 flex flex-wrap gap-1 border-b border-gray-700 text-sm"
    >
      <Link
        prefetch={false}
        href={`/game/${TOTK_GAME}/builds`}
        className="px-4 py-3 text-gray-400 hover:text-white"
      >
        Autobuilds
      </Link>
      <a
        href={RECIPES_PATH}
        aria-current={active === 'recipes' ? 'page' : undefined}
        className={`border-b-2 px-4 py-3 ${active === 'recipes' ? 'border-yellow-400 font-semibold text-yellow-400' : 'border-transparent text-gray-400 hover:text-white'}`}
      >
        Recipes
      </a>
      <a
        href={simulatorPath()}
        aria-current={active === 'simulator' ? 'page' : undefined}
        className={`border-b-2 px-4 py-3 ${active === 'simulator' ? 'border-yellow-400 font-semibold text-yellow-400' : 'border-transparent text-gray-400 hover:text-white'}`}
      >
        Cooking simulator
      </a>
    </nav>
  );
}
export default function RecipeCollectionPage({
  effect = 'all',
  page = 1,
}: {
  effect?: string;
  page?: number;
}) {
  const category = EFFECTS.find((e) => e.slug === effect);
  if (
    (effect !== 'all' && !category) ||
    page < 1 ||
    page > recipePageCount(effect)
  )
    notFound();
  const recipes = recipesForEffect(effect);
  const featured = [131, 107, 47, 221].map(
    (n) => TOTK_RECIPES.find((r) => r.number === n)!
  );
  const visible = recipes.slice(
    (page - 1) * RECIPES_PER_PAGE,
    page * RECIPES_PER_PAGE
  );
  const title = category ? `${category.label} recipes` : 'Zelda TOTK recipes';
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pb-16 pt-28 text-white">
      <div className="container mx-auto px-4">
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-2 text-xs text-gray-400"
        >
          <Link
            prefetch={false}
            href="/games"
            className="hover:text-yellow-400"
          >
            Games
          </Link>
          <span>/</span>
          <Link
            prefetch={false}
            href={`/game/${TOTK_GAME}`}
            className="hover:text-yellow-400"
          >
            Tears of the Kingdom
          </Link>
          <span>/</span>
          <span className="text-gray-200">Recipes</span>
        </nav>
        <CookingNav active="recipes" />
        <header className="mb-9 grid overflow-hidden rounded-lg border border-gray-700 bg-gray-800 lg:grid-cols-[1.3fr_1fr]">
          <div className="p-6 sm:p-9 lg:p-10">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[.22em] text-yellow-400">
              The Hyrule kitchen / Tears of the Kingdom
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {title}
              <span className="text-yellow-400">.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
              {category
                ? category.intro
                : 'A good meal changes the adventure. Find every numbered dish and elixir, choose your ingredients, and cook something worth carrying.'}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href={simulatorPath()}
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-yellow-400 px-5 py-3 text-sm font-bold text-gray-900 transition-colors hover:bg-yellow-300"
              >
                <CookingPot size={18} />
                Open the simulator
                <ArrowUpRight size={16} />
              </a>
              <span className="flex items-center gap-2 text-xs text-gray-400">
                <BookOpen size={16} className="text-yellow-400" />
                228 recipes · 251 materials
              </span>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-2 border-t border-gray-700 pt-4 lg:hidden">
              {featured.map((r) => (
                <Link
                  key={r.slug}
                  prefetch={false}
                  href={recipePath(r)}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <Image
                    src={r.image!}
                    width={52}
                    height={52}
                    alt={r.name}
                    className="h-13 w-13 object-contain"
                  />
                  <span className="text-[9px] leading-snug text-gray-400">
                    {r.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div
            className={`${styles.plate} hidden grid-cols-2 items-center gap-2 border-l border-gray-700 bg-gray-900/40 p-6 lg:grid`}
            aria-label="Featured dishes"
          >
            {featured.map((r, i) => (
              <Link
                prefetch={false}
                key={r.slug}
                href={recipePath(r)}
                className={`group flex items-center gap-3 rounded-lg px-2 py-3 hover:bg-gray-800 ${i % 2 ? 'translate-y-3' : '-translate-y-1'}`}
              >
                <Image
                  src={r.image!}
                  width={86}
                  height={86}
                  alt={r.name}
                  priority
                  className="h-20 w-20 shrink-0 object-contain drop-shadow-lg transition-transform group-hover:-rotate-6"
                />
                <span className="text-xs font-semibold text-gray-300 group-hover:text-yellow-400">
                  {r.name}
                  <span className="mt-1 block font-mono text-[10px] font-normal text-gray-500">
                    #{String(r.number).padStart(3, '0')}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </header>
        <nav
          aria-label="Recipes by effect"
          className="mb-9 flex flex-wrap gap-2"
        >
          <a
            href={RECIPES_PATH}
            className={`min-h-10 rounded-full border px-4 py-2 text-xs ${effect === 'all' ? 'border-yellow-400 text-yellow-400' : 'border-gray-600 text-gray-300 hover:border-yellow-400'}`}
          >
            All effects
          </a>
          {EFFECTS.slice(0, 8).map((e) => (
            <a
              key={e.id}
              href={recipesPath(e.slug)}
              aria-current={effect === e.slug ? 'page' : undefined}
              className={`min-h-10 rounded-full border px-4 py-2 text-xs ${effect === e.slug ? 'border-yellow-400 text-yellow-400' : 'border-gray-600 text-gray-300 hover:border-yellow-400'}`}
            >
              {e.label}
            </a>
          ))}
          <a
            href="#all-effects"
            className="min-h-10 px-3 py-2 text-xs text-gray-400 hover:text-white"
          >
            More effects ↓
          </a>
        </nav>
        <RecipeExplorer
          recipes={recipes}
          ingredients={TOTK_INGREDIENTS}
          effect={effect}
          initialPage={page}
        />
        <section
          id="all-effects"
          className="mt-12 scroll-mt-24 rounded-lg border border-gray-700 bg-gray-800 p-6 sm:p-8"
        >
          <h2 className="text-2xl font-bold text-yellow-400">
            Cook for the effect you need
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-300">
            The ingredients determine a cooked dish’s effect. Combining
            different effects can cancel the bonus, so build around one effect
            and use the simulator to check the result. Roasting, freezing and
            hot-spring preparation are listed separately.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {EFFECTS.map((e) => (
              <a
                key={e.id}
                href={recipesPath(e.slug)}
                className="flex min-h-11 items-center justify-between gap-2 rounded-lg bg-gray-900/70 px-3 py-2 text-xs text-gray-300 hover:text-yellow-400"
              >
                {e.label}
                <ArrowUpRight size={13} className="shrink-0 text-yellow-400" />
              </a>
            ))}
          </div>
        </section>
        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            [
              'How many recipes are there?',
              'The recipe book contains 228 numbered entries, including meals, roasted and frozen foods, elixirs and Fairy Tonic. Variations in ingredients can produce different bonuses under the same number.',
            ],
            [
              'What does the simulator calculate?',
              'Choose up to five ingredients to calculate a cooking-pot result: dish, hearts, effect, duration, critical-success chance and sell price. It does not roast or freeze ingredients.',
            ],
            [
              'Do all dishes need a cooking pot?',
              'No. Roasted food is prepared beside heat, frozen food in freezing conditions, and Hard-Boiled Eggs in hot springs. Each recipe page gives the preparation method.',
            ],
          ].map(([heading, text]) => (
            <div key={heading}>
              <h2 className="text-lg font-bold text-white">{heading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                {text}
              </p>
            </div>
          ))}
        </section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              graph([
                breadcrumbJsonLd([
                  { name: 'Games', path: '/games' },
                  { name: 'Tears of the Kingdom', path: `/game/${TOTK_GAME}` },
                  { name: 'Recipes', path: RECIPES_PATH },
                  ...(category
                    ? [{ name: category.label, path: recipesPath(effect) }]
                    : []),
                  ...(page > 1
                    ? [
                        {
                          name: `Page ${page}`,
                          path: recipesPath(effect, page),
                        },
                      ]
                    : []),
                ]),
                {
                  '@type': 'CollectionPage',
                  name: title,
                  url: absoluteUrl(recipesPath(effect, page)),
                  mainEntity: {
                    '@type': 'ItemList',
                    numberOfItems: visible.length,
                    itemListElement: visible.map((r, i) => ({
                      '@type': 'ListItem',
                      position: (page - 1) * RECIPES_PER_PAGE + i + 1,
                      name: r.name,
                      url: absoluteUrl(recipePath(r)),
                    })),
                  },
                },
              ])
            ).replace(/</g, '\\u003c'),
          }}
        />
      </div>
    </main>
  );
}
