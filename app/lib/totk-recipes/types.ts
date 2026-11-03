export const TOTK_GAME = 'the-legend-of-zelda-tears-of-the-kingdom';
export const RECIPES_PATH = `/game/${TOTK_GAME}/recipes`;
export const RECIPES_PER_PAGE = 24;
export type CookingMethod = 'pot' | 'roast' | 'freeze' | 'boil' | 'elixir';
export type Ingredient = {
  id: string;
  name: string;
  slug: string;
  group: string;
  effect: string | null;
  image: string | null;
};
export type CookingResult = {
  mealName: string;
  recipeNumber: number;
  healthRecovery: string;
  effect: string;
  effectType: string | null;
  effectDuration: string;
  effectLevel: string;
  criticalRate: number;
  sellPrice: number;
  rng: string;
  isFailure: boolean;
};
export type CookingVariant = { ingredients: string[]; result: CookingResult };
export type TotkRecipe = {
  number: number;
  slug: string;
  name: string;
  actor: string;
  method: CookingMethod;
  description: string;
  image: string | null;
  ingredientImage: string | null;
  effects: string[];
  ingredients: string[];
  variants: CookingVariant[];
};
export type RecipeSummary = Omit<TotkRecipe, 'variants' | 'actor'>;
export const METHODS: {
  id: CookingMethod;
  label: string;
  instruction: string;
}[] = [
  {
    id: 'pot',
    label: 'Cooking pot',
    instruction:
      'Hold the ingredients together, then drop them into a lit cooking pot. A portable pot also works.',
  },
  {
    id: 'roast',
    label: 'Roasted',
    instruction:
      'Place the raw ingredient beside a fire or on hot ground. Pick it up once it changes into the roasted dish. Do not put it in a cooking pot.',
  },
  {
    id: 'freeze',
    label: 'Frozen',
    instruction:
      'Expose the raw ingredient to freezing conditions, then collect the frozen food. This is prepared in the environment rather than a cooking pot.',
  },
  {
    id: 'boil',
    label: 'Hot spring',
    instruction:
      'Drop a Bird Egg into a hot spring, wait for it to become a Hard-Boiled Egg, then collect it.',
  },
  {
    id: 'elixir',
    label: 'Elixir',
    instruction:
      'Combine the listed critter and monster part in a lit cooking pot. The critter determines the effect.',
  },
];
export const EFFECTS = [
  {
    id: 'AttackUp',
    slug: 'attack-up',
    label: 'Attack up',
    intro:
      'Prepare Mighty dishes and elixirs for an attack boost. Choose a recipe below to see an ingredient combination that keeps that effect.',
  },
  {
    id: 'DefenseUp',
    slug: 'defense-up',
    label: 'Defense up',
    intro:
      'Browse Tough dishes and elixirs for a defense boost. Open a recipe to compare its effect-specific ingredient combinations.',
  },
  {
    id: 'LifeMaxUp',
    slug: 'extra-hearts',
    label: 'Extra hearts',
    intro:
      'Find Hearty meals and elixirs made with heart-boosting ingredients. The chosen ingredients determine the bonus hearts.',
  },
  {
    id: 'StaminaRecover',
    slug: 'stamina-recovery',
    label: 'Stamina',
    intro:
      'Find Energizing recipes for recovering stamina during a climb, swim or glide. Use the simulator to compare different quantities.',
  },
  {
    id: 'ExStaminaMaxUp',
    slug: 'extra-stamina',
    label: 'Extra stamina',
    intro:
      'Browse Enduring recipes made with ingredients such as Endura Carrots or Tireless Frogs. Check each combination in the cooking simulator.',
  },
  {
    id: 'AllSpeed',
    slug: 'speed-up',
    label: 'Speed up',
    intro:
      'Find Hasty meals and elixirs for traveling across Hyrule. See which ingredients produce the effect without changing the numbered dish.',
  },
  {
    id: 'QuietnessUp',
    slug: 'stealth-up',
    label: 'Stealth',
    intro:
      'Browse Sneaky recipes for a stealth boost. Select a dish to see the ingredient quantities and calculated effect.',
  },
  {
    id: 'ResistCold',
    slug: 'cold-resistance',
    label: 'Cold resistance',
    intro:
      'Find Spicy meals and elixirs for cold areas. Ingredient choice and quantity affect the strength and duration.',
  },
  {
    id: 'ResistHot',
    slug: 'heat-resistance',
    label: 'Heat resistance',
    intro:
      'Browse Chilly dishes and elixirs made with heat-resistant ingredients. Check the combination and duration before setting out.',
  },
  {
    id: 'ResistElectric',
    slug: 'shock-resistance',
    label: 'Shock resistance',
    intro:
      'Find Electro recipes made with shock-resistant ingredients. Compare the calculated effect on each recipe page.',
  },
  {
    id: 'ResistBurn',
    slug: 'flame-guard',
    label: 'Flame guard',
    intro:
      'Find Fireproof elixirs prepared with fire-resistant critters and monster parts. Flame Guard is a separate effect from heat resistance.',
  },
  {
    id: 'NotSlippy',
    slug: 'slip-resistance',
    label: 'Slip resistance',
    intro:
      'Browse Sticky recipes for wet climbing conditions. Use the simulator to compare Sticky Frog and Sticky Lizard combinations.',
  },
  {
    id: 'LightEmission',
    slug: 'glow',
    label: 'Glow',
    intro:
      'Find Bright meals and elixirs that give Link a glow. Open a recipe to see a combination and its calculated duration.',
  },
  {
    id: 'LifeRepair',
    slug: 'gloom-recovery',
    label: 'Gloom recovery',
    intro:
      'Browse Sunny meals made with ingredients such as Sundelions. These combinations target hearts affected by gloom.',
  },
  {
    id: 'MiasmaGuard',
    slug: 'gloom-resistance',
    label: 'Gloom resistance',
    intro:
      'Find Warding dishes made with Dark Clumps. Gloom resistance and gloom recovery are separate effects.',
  },
  {
    id: 'AttackUpCold',
    slug: 'cold-weather-attack',
    label: 'Cold weather attack',
    intro:
      'Find Biting dishes made with ingredients that boost attacks in cold weather. These are different from cold-resistant meals.',
  },
  {
    id: 'AttackUpHot',
    slug: 'hot-weather-attack',
    label: 'Hot weather attack',
    intro:
      'Find Scorching dishes for an attack boost in hot weather. Check the ingredients and calculated effect for each combination.',
  },
  {
    id: 'AttackUpThunderstorm',
    slug: 'stormy-weather-attack',
    label: 'Stormy weather attack',
    intro:
      'Browse Stormy dishes for an attack boost during thunderstorms. Use the simulator to adjust the ingredient quantities.',
  },
  {
    id: 'SwimSpeedUp',
    slug: 'swim-speed-up',
    label: 'Swim speed',
    intro:
      'Find Rapid dishes made with Splash Fruit for a swimming speed boost. Open a recipe to see a calculated combination.',
  },
] as const;
export function recipePath(recipe: Pick<TotkRecipe, 'slug'>) {
  return `${RECIPES_PATH}/${recipe.slug}`;
}
export function recipesPath(effect = 'all', page = 1) {
  return `${RECIPES_PATH}${effect === 'all' ? '' : `/effect/${effect}`}${page > 1 ? `/page/${page}` : ''}`;
}
export function methodLabel(method: CookingMethod) {
  return METHODS.find((m) => m.id === method)!.label;
}
export function effectLabel(effect: string | null) {
  return EFFECTS.find((e) => e.id === effect)?.label || 'No added effect';
}
export function simulatorPath(ingredients: string[] = []) {
  return `${RECIPES_PATH}/cooking-simulator${ingredients.length ? `?ingredients=${encodeURIComponent(ingredients.join(','))}` : ''}`;
}
