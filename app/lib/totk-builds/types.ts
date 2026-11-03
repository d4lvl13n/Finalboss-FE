export const TOTK_GAME_SLUG = 'the-legend-of-zelda-tears-of-the-kingdom';
export const TOTK_BUILDS_PATH = `/game/${TOTK_GAME_SLUG}/builds`;
export const BUILDS_PER_PAGE = 24;

export const BUILD_CATEGORIES = [
  { id: 'all', label: 'All builds' },
  { id: 'flying', label: 'Flying' },
  { id: 'combat', label: 'Combat' },
  { id: 'transport', label: 'Transport' },
  { id: 'water', label: 'On water' },
  { id: 'ground', label: 'On land' },
  { id: 'utility', label: 'Utility' },
  { id: 'glitches', label: 'Glitches' },
  { id: 'other', label: 'More creations' },
] as const;

export type BuildCategory = (typeof BUILD_CATEGORIES)[number]['id'];
export type BuildSort = 'recommended' | 'rating' | 'popular' | 'cost';

export interface TotkBuild {
  id: number;
  slug: string;
  name: string;
  description: string;
  tags: string[];
  categories: Exclude<BuildCategory, 'all'>[];
  type: string;
  zonaite: number | null;
  score: number;
  views: number;
  tested: boolean;
  testCount: number;
  image: string;
  preview: string;
  imageWidth: number;
  imageHeight: number;
}

export interface BuildFilters {
  q: string;
  category: BuildCategory;
  budget: string;
  tested: boolean;
  tag: string;
  sort: BuildSort;
  page: number;
}

export const DEFAULT_BUILD_FILTERS: BuildFilters = {
  q: '', category: 'all', budget: '', tested: false, tag: '', sort: 'recommended', page: 1,
};

export function buildPath(build: Pick<TotkBuild, 'slug'>): string {
  return `${TOTK_BUILDS_PATH}/${build.slug}`;
}

export function categoryLabel(category: BuildCategory): string {
  return BUILD_CATEGORIES.find((item) => item.id === category)?.label || 'More creations';
}
