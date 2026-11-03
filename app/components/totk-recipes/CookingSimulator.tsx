'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  CookingPot,
  Plus,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import {
  recipePath,
  type CookingResult,
  type Ingredient,
  type RecipeSummary,
} from '@/app/lib/totk-recipes/types';
import type TotkCookSim from '@/app/lib/totk-recipes/engine';
import { CookingFacts, IngredientImage } from './CookingFacts';
import styles from './Recipes.module.css';

export default function CookingSimulator({
  ingredients,
  recipes,
}: {
  ingredients: Ingredient[];
  recipes: RecipeSummary[];
}) {
  const [slots, setSlots] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('');
  const [limit, setLimit] = useState(48);
  const [result, setResult] = useState<CookingResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const sim = useRef<TotkCookSim | null>(null);
  const calculation = useRef(0);
  const cookButton = useRef<HTMLButtonElement>(null);
  const [showMobileBar, setShowMobileBar] = useState(false);
  useEffect(() => {
    const button = cookButton.current;
    if (!button) return;
    const observer = new IntersectionObserver(([entry]) =>
      setShowMobileBar(!entry.isIntersecting)
    );
    observer.observe(button);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('ingredients');
    const ids = raw?.split(',') || [];
    if (
      ids.length &&
      ids.length <= 5 &&
      ids.every((id) => ingredients.some((i) => i.id === id))
    )
      setSlots(ids);
  }, [ingredients]);
  const groups = useMemo(
    () => Array.from(new Set(ingredients.map((i) => i.group))),
    [ingredients]
  );
  const matches = useMemo(
    () =>
      ingredients.filter(
        (i) =>
          (!group || i.group === group) &&
          i.name.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [ingredients, group, query]
  );
  const meal = result
    ? recipes.find((r) => r.number === result.recipeNumber)
    : null;
  function select(next: string[]) {
    if (next.length <= 5) {
      calculation.current++;
      setSlots(next);
      setResult(null);
      setError('');
    }
  }
  async function cook() {
    if (!slots.length || busy) return;
    setBusy(true);
    setError('');
    const current = calculation.current;
    try {
      if (!sim.current) {
        const [engine, data] = await Promise.all([
          import('@/app/lib/totk-recipes/engine'),
          import('@/app/lib/totk-recipes/engine-data.json'),
        ]);
        sim.current = new engine.default(data.default);
      }
      if (current === calculation.current) setResult(sim.current.cook(slots));
    } catch {
      setError('The calculation could not finish. Try again.');
    } finally {
      setBusy(false);
    }
  }
  const presets = [
    {
      label: 'Attack boost',
      input: Array(5).fill('Mighty Bananas') as string[],
    },
    {
      label: 'Stamina recovery',
      input: Array(3).fill('Stamella Shroom') as string[],
    },
    {
      label: 'Gloom recovery',
      input: ['Sundelion', 'Sundelion', 'Hyrule Herb'],
    },
    { label: 'Hearty meal', input: ['Hearty Truffle'] },
  ];
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[400px_1fr] xl:grid-cols-[440px_1fr]">
      <section
        id="cooking-pot"
        aria-label="Your cooking pot"
        className="scroll-mt-24 rounded-lg border border-gray-700 bg-gray-800 p-5 sm:p-6 lg:sticky lg:top-24"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Your cooking pot</h2>
          <span className="font-mono text-xs text-yellow-400">
            {slots.length}/5
          </span>
        </div>
        <div
          className={`${styles.slot} my-5 flex items-center justify-center rounded-lg border border-gray-700 bg-gray-900 py-6`}
        >
          <CookingPot
            size={60}
            strokeWidth={1.2}
            className="text-yellow-400"
            aria-hidden="true"
          />
          <p className="ml-5 max-w-40 text-xs leading-relaxed text-gray-400">
            {slots.length === 5
              ? 'Your pot is full. Ready to cook?'
              : 'Add up to five ingredients. Tap a filled slot to remove it.'}
          </p>
        </div>
        <div
          className="grid grid-cols-5 gap-2"
          aria-label="Selected ingredients"
        >
          {Array.from({ length: 5 }, (_, i) => {
            const ingredient = ingredients.find((item) => item.id === slots[i]);
            return ingredient ? (
              <button
                key={i}
                type="button"
                title={`Remove ${ingredient.name}`}
                aria-label={`Remove ${ingredient.name} from slot ${i + 1}`}
                onClick={() => select(slots.filter((_, n) => n !== i))}
                className="group relative flex h-16 min-w-0 items-center justify-center rounded-lg border border-yellow-400/40 bg-gray-900 hover:border-yellow-400"
              >
                <IngredientImage ingredient={ingredient} size={42} />
                <X
                  size={12}
                  aria-hidden="true"
                  className="absolute right-1 top-1 text-gray-400 group-hover:text-white"
                />
              </button>
            ) : (
              <span
                key={i}
                className="flex h-16 min-w-0 items-center justify-center rounded-lg border border-dashed border-gray-600"
              >
                <Plus size={17} className="text-gray-600" />
              </span>
            );
          })}
        </div>
        <div className="mt-5 flex gap-2">
          <button
            ref={cookButton}
            onClick={cook}
            disabled={!slots.length || busy}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-3 text-sm font-bold text-gray-900 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-500"
          >
            <CookingPot size={17} />
            {busy ? 'Calculating…' : 'Cook recipe'}
          </button>
          <button
            aria-label="Empty cooking pot"
            onClick={() => select([])}
            disabled={!slots.length}
            className="flex w-12 items-center justify-center rounded-lg border border-gray-600 text-gray-300 hover:border-yellow-400 disabled:opacity-30"
          >
            <RotateCcw size={17} />
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-4 text-sm text-yellow-400">
            {error}
          </p>
        )}
        <div aria-live="polite" className="mt-6">
          {result ? (
            <div data-cooking-result>
              <div className="mb-5 flex items-center gap-4">
                {meal?.image && (
                  <Image
                    src={meal.image}
                    alt={result.mealName}
                    width={80}
                    height={80}
                    className="h-20 w-20 object-contain"
                  />
                )}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-yellow-400">
                    {result.isFailure ? 'Cooking result' : 'Fresh from the pot'}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-white">
                    {result.mealName}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-gray-500">
                    Recipe #{result.recipeNumber}
                  </p>
                </div>
              </div>
              <CookingFacts result={result} />
              {meal && (
                <Link
                  prefetch={false}
                  href={recipePath(meal)}
                  className="mt-5 flex min-h-10 items-center gap-2 text-sm font-semibold text-yellow-400"
                >
                  View recipe page
                  <ArrowUpRight size={15} />
                </Link>
              )}
              {result.isFailure && (
                <p className="mt-3 text-xs leading-relaxed text-gray-400">
                  These ingredients do not make a regular meal. Try food
                  ingredients together, or a critter with a monster part for an
                  elixir.
                </p>
              )}
            </div>
          ) : (
            <div className="border-t border-gray-700 pt-5">
              <p className="text-sm font-semibold text-gray-200">
                Need a starting point?
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() =>
                      select(
                        p.input.map(
                          (name) => ingredients.find((i) => i.name === name)!.id
                        )
                      )
                    }
                    className="min-h-10 rounded-full bg-gray-700 px-3 py-2 text-xs text-gray-300 hover:text-yellow-400"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <section aria-label="Ingredient pantry" className="min-w-0">
        <div className="mb-5 flex items-baseline justify-between gap-3">
          <h2 className="text-xl font-bold">The pantry</h2>
          <span role="status" className="text-xs text-gray-400">
            {matches.length} materials
          </span>
        </div>
        <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_180px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-4 text-yellow-400"
              aria-hidden="true"
            />
            <label htmlFor="pantry-search" className="sr-only">
              Search ingredients
            </label>
            <input
              id="pantry-search"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setLimit(48);
              }}
              placeholder="Find an ingredient…"
              className="min-h-12 w-full rounded-lg border border-gray-600 bg-gray-800 py-3 pl-11 pr-3 text-sm focus:outline-yellow-400"
            />
          </div>
          <label htmlFor="pantry-group" className="sr-only">
            Ingredient category
          </label>
          <select
            id="pantry-group"
            value={group}
            onChange={(e) => {
              setGroup(e.target.value);
              setLimit(48);
            }}
            className="min-h-12 rounded-lg border border-gray-600 bg-gray-800 px-3 text-sm focus:outline-yellow-400"
          >
            <option value="">All materials</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <p className="mb-4 text-xs text-gray-500">
          Select an ingredient to add it. You can use the same one more than
          once.
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
          {matches.slice(0, limit).map((i) => (
            <button
              key={i.id}
              onClick={() => select([...slots, i.id])}
              disabled={slots.length >= 5}
              aria-label={`Add ${i.name}`}
              className="group flex min-h-32 flex-col items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800 p-2 text-center transition-colors hover:border-yellow-400 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <IngredientImage ingredient={i} size={44} />
              <span className="text-[11px] font-medium leading-snug text-gray-300 group-hover:text-white">
                {i.name}
              </span>
              <span className="text-[9px] text-gray-500">{i.group}</span>
            </button>
          ))}
        </div>
        {!matches.length && (
          <p className="rounded-lg border border-dashed border-gray-600 p-10 text-center text-sm text-gray-400">
            No ingredients match. Try a shorter name or another category.
          </p>
        )}
        {matches.length > limit && (
          <button
            onClick={() => setLimit(limit + 48)}
            className="mx-auto mt-6 flex min-h-11 items-center rounded-full border border-gray-600 px-6 py-2 text-sm font-semibold text-gray-300 hover:border-yellow-400 hover:text-yellow-400"
          >
            Show more ingredients
          </button>
        )}
        <p className="mt-7 text-xs leading-relaxed text-gray-500">
          The calculator handles cooking-pot combinations. Roasted, frozen and
          hot-spring foods use their own preparation methods. The figures shown
          are calculated values; critical successes and Monster Extract can
          change the outcome.
        </p>
      </section>
      {showMobileBar && (
        <div
          data-mobile-cooking-controls
          className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-gray-700 bg-gray-900 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-2xl lg:hidden"
        >
          <a
            href="#cooking-pot"
            className="flex min-h-11 items-center gap-2 text-sm text-gray-300"
          >
            <CookingPot size={18} className="text-yellow-400" />
            Your pot{' '}
            <span className="font-mono text-yellow-400">{slots.length}/5</span>
          </a>
          <button
            onClick={() => {
              cook();
              document
                .getElementById('cooking-pot')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            disabled={!slots.length || busy}
            className="min-h-11 rounded-lg bg-yellow-400 px-6 text-sm font-bold text-gray-900 disabled:bg-gray-700 disabled:text-gray-500"
          >
            {busy ? 'Calculating…' : 'Cook recipe'}
          </button>
        </div>
      )}
    </div>
  );
}
