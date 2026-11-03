'use client';
import { Fragment, memo, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Search, X } from 'lucide-react';
import {
  EFFECTS,
  METHODS,
  RECIPES_PER_PAGE,
  recipesPath,
  type Ingredient,
  type RecipeSummary,
} from '@/app/lib/totk-recipes/types';
import { scheduleJourneySlots } from '@/app/lib/totk-builds/journey';
import RecipeCard from './RecipeCard';
import styles from './Recipes.module.css';

const RecipeAdBreak = memo(function RecipeAdBreak({
  after,
}: {
  after: number;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) scheduleJourneySlots();
  }, [ready]);
  return (
    <div data-recipe-ad-after={after} suppressHydrationWarning>
      <div
        className={ready ? 'mv_slot_target' : undefined}
        data-slot="content"
      />
    </div>
  );
});

export default function RecipeExplorer({
  recipes,
  ingredients,
  effect = 'all',
  initialPage = 1,
}: {
  recipes: RecipeSummary[];
  ingredients: Ingredient[];
  effect?: string;
  initialPage?: number;
}) {
  const [filters, setFilters] = useState({
    q: '',
    method: '',
    ingredient: '',
    page: initialPage,
  });
  useEffect(() => {
    const read = () => {
      const p = new URLSearchParams(window.location.search);
      setFilters({
        q: p.get('q')?.slice(0, 160) || '',
        method: p.get('method') || '',
        ingredient: p.get('ingredient') || '',
        page: initialPage,
      });
    };
    read();
    window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, [initialPage]);
  const ingredientNames = useMemo(
    () => Object.fromEntries(ingredients.map((i) => [i.id, i.name])),
    [ingredients]
  );
  const results = useMemo(
    () =>
      recipes.filter(
        (r) =>
          (!filters.method || r.method === filters.method) &&
          (!filters.ingredient || r.ingredients.includes(filters.ingredient)) &&
          `${r.name} ${r.number} ${r.ingredients.map((id) => ingredientNames[id]).join(' ')}`
            .toLocaleLowerCase()
            .includes(filters.q.trim().toLocaleLowerCase())
      ),
    [recipes, filters, ingredientNames]
  );
  const pages = Math.max(1, Math.ceil(results.length / RECIPES_PER_PAGE));
  const current = Math.min(filters.page, pages);
  const visible = results.slice(
    (current - 1) * RECIPES_PER_PAGE,
    current * RECIPES_PER_PAGE
  );
  const active = Boolean(filters.q || filters.method || filters.ingredient);
  function location(next: typeof filters, page = 1) {
    const p = new URLSearchParams();
    if (next.q) p.set('q', next.q);
    if (next.method) p.set('method', next.method);
    if (next.ingredient) p.set('ingredient', next.ingredient);
    return `${recipesPath(effect, page)}${p.size ? `?${p}` : ''}`;
  }
  function change(patch: Partial<typeof filters>) {
    const next = { ...filters, ...patch, page: 1 };
    setFilters(next);
    window.history.replaceState(null, '', location(next));
  }
  return (
    <section id="recipe-book" className="scroll-mt-24">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-2xl font-bold text-white">The recipe book</h2>
        <span className="font-mono text-xs uppercase tracking-wider text-gray-400">
          Find your next favorite
        </span>
      </div>
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_190px_230px]">
          <div className="relative">
            <Search
              size={19}
              aria-hidden="true"
              className="absolute left-4 top-4 text-yellow-400"
            />
            <label htmlFor="recipe-search" className="sr-only">
              Search recipes
            </label>
            <input
              id="recipe-search"
              type="search"
              value={filters.q}
              onChange={(e) => change({ q: e.target.value })}
              placeholder="Search dishes, ingredients or recipe number…"
              maxLength={160}
              className="min-h-12 w-full rounded-lg border border-gray-600 bg-gray-900 py-3 pl-12 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
            />
          </div>
          <label className="sr-only" htmlFor="recipe-effect">
            Recipe effect
          </label>
          <select
            id="recipe-effect"
            value={effect}
            onChange={(e) => {
              window.location.href = recipesPath(e.target.value);
            }}
            className="min-h-12 rounded-lg border border-gray-600 bg-gray-900 px-3 text-sm focus:outline-yellow-400"
          >
            <option value="all">All effects</option>
            {EFFECTS.map((e) => (
              <option key={e.id} value={e.slug}>
                {e.label}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="recipe-ingredient">
            Example ingredient
          </label>
          <select
            id="recipe-ingredient"
            value={filters.ingredient}
            onChange={(e) => change({ ingredient: e.target.value })}
            className="min-h-12 min-w-0 rounded-lg border border-gray-600 bg-gray-900 px-3 text-sm focus:outline-yellow-400"
          >
            <option value="">Any example ingredient</option>
            {ingredients
              .filter((i) => recipes.some((r) => r.ingredients.includes(i.id)))
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Cooking method">
          {[{ id: '', label: 'All dishes' }, ...METHODS].map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={filters.method === m.id}
              onClick={() => change({ method: m.id })}
              className={`min-h-10 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${filters.method === m.id ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700/70 text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <div className="my-5 flex min-h-8 items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-sm text-gray-400">
          <strong className="font-semibold text-white">{results.length}</strong>{' '}
          recipe{results.length === 1 ? '' : 's'}
          {results.length > RECIPES_PER_PAGE
            ? ` · ${(current - 1) * RECIPES_PER_PAGE + 1}–${Math.min(current * RECIPES_PER_PAGE, results.length)}`
            : ''}
        </p>
        {active && (
          <button
            onClick={() => change({ q: '', method: '', ingredient: '' })}
            className="flex min-h-10 items-center gap-1.5 text-xs font-semibold text-yellow-400"
          >
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>
      {visible.length ? (
        <div
          className={`${styles.grid} grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4`}
        >
          {visible.map((r, i) => (
            <Fragment key={r.slug}>
              <RecipeCard
                recipe={r}
                effect={EFFECTS.find((e) => e.slug === effect)?.id}
              />
              {visible.length >= 16 &&
                [8, 16].includes(i + 1) &&
                i + 1 <= visible.length - 4 && <RecipeAdBreak after={i + 1} />}
            </Fragment>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-600 px-6 py-16 text-center">
          <CookingEmpty />
          <h3 className="mt-3 text-xl font-semibold">No recipes found</h3>
          <p className="mt-2 text-sm text-gray-400">
            Try another ingredient or clear the filters to open the full recipe
            book.
          </p>
          <button
            onClick={() => change({ q: '', method: '', ingredient: '' })}
            className="mt-5 rounded-full bg-yellow-400 px-5 py-3 text-sm font-bold text-gray-900"
          >
            Clear filters
          </button>
        </div>
      )}
      {pages > 1 && (
        <nav
          aria-label="Recipe pages"
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          {current > 1 && (
            <a
              href={location(filters, current - 1)}
              className="flex min-h-11 items-center gap-1 px-3 text-sm text-gray-300"
            >
              <ArrowLeft size={15} />
              Previous
            </a>
          )}
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <a
              key={n}
              aria-current={current === n ? 'page' : undefined}
              href={location(filters, n)}
              className={`flex h-11 min-w-11 items-center justify-center rounded-lg text-sm font-semibold ${current === n ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              {n}
            </a>
          ))}
          {current < pages && (
            <a
              href={location(filters, current + 1)}
              className="flex min-h-11 items-center gap-1 px-3 text-sm text-gray-300"
            >
              Next
              <ArrowRight size={15} />
            </a>
          )}
        </nav>
      )}
    </section>
  );
}
function CookingEmpty() {
  return (
    <Search size={30} className="mx-auto text-yellow-400" aria-hidden="true" />
  );
}
