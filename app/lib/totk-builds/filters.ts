import {
  BUILD_CATEGORIES, DEFAULT_BUILD_FILTERS,
  type BuildFilters, type BuildSort, type TotkBuild,
} from './types';

const BUDGETS = ['', '9', '15', '30', '60'];
const SORTS: BuildSort[] = ['recommended', 'rating', 'popular', 'cost'];

export function normalizeSearch(value: string): string {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function readBuildFilters(params: URLSearchParams): BuildFilters {
  const category = BUILD_CATEGORIES.find((item) => item.id === params.get('category'))?.id || 'all';
  const sort = SORTS.find((value) => value === params.get('sort')) || 'recommended';
  const budget = BUDGETS.find((value) => value === params.get('budget')) || '';
  const page = Number(params.get('page'));
  return {
    q: (params.get('q') || '').trim().slice(0, 160),
    category, budget, sort,
    tested: params.get('tested') === '1',
    tag: (params.get('tag') || '').trim().toLowerCase().slice(0, 80),
    page: Number.isSafeInteger(page) && page > 0 ? Math.min(page, 1000) : 1,
  };
}

export function buildFilterParams(filters: BuildFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set('q', filters.q.trim());
  if (filters.category !== 'all') params.set('category', filters.category);
  if (filters.budget) params.set('budget', filters.budget);
  if (filters.tested) params.set('tested', '1');
  if (filters.tag) params.set('tag', filters.tag);
  if (filters.sort !== DEFAULT_BUILD_FILTERS.sort) params.set('sort', filters.sort);
  if (filters.page > 1) params.set('page', String(filters.page));
  return params;
}

export function filterBuilds(builds: readonly TotkBuild[], filters: BuildFilters): TotkBuild[] {
  const words = normalizeSearch(filters.q.trim()).split(/\s+/).filter(Boolean);
  const filtered = builds.filter((build) => {
    if (filters.category !== 'all' && !build.categories.includes(filters.category)) return false;
    if (filters.tested && !build.tested) return false;
    if (filters.budget && (build.zonaite === null || build.zonaite > Number(filters.budget))) return false;
    if (filters.tag && !build.tags.includes(filters.tag)) return false;
    if (!words.length) return true;
    const haystack = normalizeSearch([build.name, build.description, build.type, ...build.tags].join(' '));
    return words.every((word) => haystack.includes(word));
  });
  return filtered.sort((a, b) => {
    if (filters.sort === 'cost') {
      const cost = (a.zonaite ?? Infinity) - (b.zonaite ?? Infinity);
      if (Number.isFinite(cost) && cost !== 0) return cost;
      if (a.zonaite === null && b.zonaite !== null) return 1;
      if (b.zonaite === null && a.zonaite !== null) return -1;
    }
    if (filters.sort === 'popular' && a.views !== b.views) return b.views - a.views;
    if (filters.sort === 'rating' && a.score !== b.score) return b.score - a.score;
    if (filters.sort === 'recommended' && a.tested !== b.tested) return Number(b.tested) - Number(a.tested);
    return b.score - a.score || b.views - a.views || a.id - b.id;
  });
}
