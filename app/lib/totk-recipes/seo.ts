import { absoluteUrl, buildPageMetadata } from '@/app/lib/seo';
import {
  EFFECTS,
  RECIPES_PATH,
  recipePath,
  recipesPath,
  type TotkRecipe,
} from './types';
function compact(text: string) {
  return text.length <= 165
    ? text
    : text.slice(0, 164).replace(/\s+\S*$/, '') + '…';
}
export function recipeMetadata(recipe: TotkRecipe) {
  return buildPageMetadata({
    title: `${recipe.name} Recipe — Zelda TOTK #${recipe.number}`,
    description: compact(
      `Make ${recipe.name} in Zelda TOTK. See recipe #${recipe.number}, ingredients and preparation method${recipe.variants.length ? ', compare calculated effects and try the cooking simulator' : ''}.`
    ),
    path: recipePath(recipe),
    image: recipe.image || undefined,
  });
}
export function recipeCollectionMetadata(effect = 'all', page = 1) {
  const label = EFFECTS.find((e) => e.slug === effect)?.label;
  return buildPageMetadata({
    title: `${label ? `Zelda TOTK ${label} Recipes` : 'Zelda TOTK Recipes: All 228 Dishes & Elixirs'}${page > 1 ? ` — Page ${page}` : ''}`,
    description: compact(
      `${page > 1 ? `Page ${page}. ` : ''}Browse ${label ? `${label.toLowerCase()} recipes` : 'all 228 recipes'} in Zelda: Tears of the Kingdom. Find ingredients, cooking methods and a simulator for up to five materials.`
    ),
    path: recipesPath(effect, page),
  });
}
// These are fictional in-game items, so CreativeWork avoids marking them as
// human food recipes or promising eligibility for Google's recipe rich results.
export function recipeJsonLd(recipe: TotkRecipe) {
  return {
    '@type': 'CreativeWork',
    name: `${recipe.name} — Zelda TOTK recipe`,
    url: absoluteUrl(recipePath(recipe)),
    description: recipe.description,
    image: recipe.image ? absoluteUrl(recipe.image) : undefined,
    identifier: `TOTK recipe #${recipe.number}`,
    isPartOf: { '@type': 'CollectionPage', url: absoluteUrl(RECIPES_PATH) },
    about: {
      '@type': 'VideoGame',
      name: 'The Legend of Zelda: Tears of the Kingdom',
    },
  };
}
