import data from './catalogue.json';
import {
  EFFECTS,
  RECIPES_PER_PAGE,
  type Ingredient,
  type RecipeSummary,
  type TotkRecipe,
} from './types';

export const TOTK_RECIPES = data.recipes as TotkRecipe[];
export const TOTK_INGREDIENTS = data.ingredients as Ingredient[];
export const RECIPE_SUMMARIES: RecipeSummary[] = TOTK_RECIPES.map((r) => ({
  number: r.number,
  slug: r.slug,
  name: r.name,
  method: r.method,
  description: r.description,
  image: r.image,
  ingredientImage: r.ingredientImage,
  effects: r.effects,
  ingredients: r.ingredients,
}));
export function getRecipe(slug: string) {
  return TOTK_RECIPES.find((r) => r.slug === slug);
}
export function recipesForEffect(effect = 'all') {
  const id = EFFECTS.find((e) => e.slug === effect)?.id;
  return effect === 'all'
    ? RECIPE_SUMMARIES
    : RECIPE_SUMMARIES.filter((r) => id && r.effects.includes(id));
}
export function recipePageCount(effect = 'all') {
  return Math.ceil(recipesForEffect(effect).length / RECIPES_PER_PAGE);
}
export function recipePageParams(effect = 'all') {
  return Array.from(
    { length: Math.max(0, recipePageCount(effect) - 1) },
    (_, i) => String(i + 2)
  );
}
