'use client';
import { useEffect, useState } from 'react';
import { ArrowUpRight, CookingPot } from 'lucide-react';
import {
  effectLabel,
  simulatorPath,
  type Ingredient,
  type TotkRecipe,
} from '@/app/lib/totk-recipes/types';
import { CookingFacts, IngredientImage } from './CookingFacts';

export default function RecipePreparation({
  recipe,
  ingredients,
}: {
  recipe: TotkRecipe;
  ingredients: Ingredient[];
}) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const read = () => {
      const effect = window.location.hash.replace('#effect-', '');
      const match = recipe.variants.findIndex(
        (v) => v.result.effectType === effect
      );
      if (match >= 0) setIndex(match);
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, [recipe.variants]);
  const variant = recipe.variants[index];
  const selected = variant?.ingredients || recipe.ingredients;
  const quantities = Object.entries(
    selected.reduce<Record<string, number>>(
      (all, id) => ({ ...all, [id]: (all[id] || 0) + 1 }),
      {}
    )
  );
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-5 sm:p-6">
      <h2 className="text-xl font-bold text-white">What goes in</h2>
      {recipe.variants.length > 1 && (
        <label className="mt-5 block text-xs text-gray-400">
          Choose a combination
          <select
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
            className="mt-2 min-h-11 w-full rounded-lg border border-gray-600 bg-gray-900 px-3 text-sm text-white focus:outline-yellow-400"
          >
            {recipe.variants.map((v, i) => (
              <option key={i} value={i}>
                {effectLabel(v.result.effectType)} · {v.ingredients.length}{' '}
                ingredient{v.ingredients.length === 1 ? '' : 's'}
              </option>
            ))}
          </select>
        </label>
      )}
      <ul className="mb-6 mt-4 divide-y divide-gray-700">
        {quantities.map(([id, quantity]) => {
          const ingredient = ingredients.find((i) => i.id === id)!;
          return (
            <li key={id} className="flex items-center gap-3 py-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-900">
                <IngredientImage ingredient={ingredient} />
              </span>
              <span className="flex-1 text-sm text-gray-200">
                {ingredient.name}
              </span>
              <span className="font-mono text-sm text-yellow-400">
                ×{quantity}
              </span>
            </li>
          );
        })}
      </ul>
      {variant && (
        <>
          <p className="mb-3 text-xs text-gray-400">
            Calculated for this combination
          </p>
          <CookingFacts result={variant.result} />
          <a
            href={simulatorPath(selected)}
            className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-3 text-sm font-bold text-gray-900 hover:bg-yellow-300"
          >
            <CookingPot size={17} />
            Try this combination
            <ArrowUpRight size={16} />
          </a>
        </>
      )}
      {!variant && (
        <p className="rounded-lg bg-gray-900 p-4 text-sm leading-relaxed text-gray-300">
          Prepare this ingredient using the method on this page. The cooking-pot
          simulator produces a different dish.
        </p>
      )}
    </div>
  );
}
