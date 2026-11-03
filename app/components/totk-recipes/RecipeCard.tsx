import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CookingPot, Snowflake } from 'lucide-react';
import {
  methodLabel,
  recipePath,
  type RecipeSummary,
} from '@/app/lib/totk-recipes/types';
import styles from './Recipes.module.css';

export default function RecipeCard({
  recipe,
  effect,
}: {
  recipe: RecipeSummary;
  effect?: string;
}) {
  const image = recipe.image || recipe.ingredientImage;
  return (
    <Link
      prefetch={false}
      href={`${recipePath(recipe)}${effect ? `#effect-${effect}` : ''}`}
      data-recipe-card={recipe.number}
      className={`${styles.card} group flex h-full flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-800 hover:border-yellow-400/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400`}
    >
      <div
        className={`${styles.plate} relative flex h-40 items-center justify-center bg-gray-900/45 sm:h-44`}
      >
        <span className="absolute left-3 top-3 font-mono text-[11px] text-gray-500">
          #{String(recipe.number).padStart(3, '0')}
        </span>
        {image ? (
          <Image
            src={image}
            alt={
              recipe.image ? recipe.name : `Raw ingredient for ${recipe.name}`
            }
            width={116}
            height={116}
            className="h-28 w-28 object-contain"
          />
        ) : (
          <Snowflake
            size={58}
            className="text-gray-500"
            aria-label="Frozen dish"
          />
        )}
        {!recipe.image && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 text-[9px] text-gray-400">
            <Snowflake size={10} />
            Raw ingredient
          </span>
        )}
        <ArrowUpRight
          size={17}
          aria-hidden="true"
          className="absolute bottom-3 right-3 text-gray-500 group-hover:text-yellow-400"
        />
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-yellow-400/90">
          {methodLabel(recipe.method)}
        </p>
        <h3 className="text-base font-bold leading-snug text-white group-hover:text-yellow-300 sm:text-lg">
          {recipe.name}
        </h3>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
          <CookingPot size={13} aria-hidden="true" />
          {recipe.ingredients.length} ingredient
          {recipe.ingredients.length === 1 ? '' : 's'} in example
        </p>
      </div>
    </Link>
  );
}
