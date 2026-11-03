'use client';

import { memo, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowLeft, ArrowRight, Search, SlidersHorizontal, X } from 'lucide-react';
import BuildCard from './BuildCard';
import { SectionHeading } from '@/app/components/game-hub/ui';
import {
  BUILD_CATEGORIES, BUILDS_PER_PAGE, DEFAULT_BUILD_FILTERS,
  type BuildCategory, type BuildFilters, type BuildSort, type TotkBuild,
} from '@/app/lib/totk-builds/types';
import { buildFilterParams, filterBuilds, readBuildFilters } from '@/app/lib/totk-builds/filters';
import { catalogueLocation, cataloguePath } from '@/app/lib/totk-builds/collections';
import { buildAdPositions } from '@/app/lib/totk-builds/ads';
import { scheduleJourneySlots } from '@/app/lib/totk-builds/journey';
import styles from './BuildGrid.module.css';

function watchWideGrid(listener: () => void) {
  const media = window.matchMedia('(min-width: 1280px)');
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
}

// Journey inserts its own DOM beside the inner marker. Keep that DOM inside a
// stable, memoized island when cards are reordered or filters are adjusted.
const BuildAdBreak = memo(function BuildAdBreak({ after }: { after: number }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  useEffect(() => { if (ready) scheduleJourneySlots(); }, [ready]);
  return <div className="col-span-full" data-build-ad-after={after} suppressHydrationWarning><div className={ready ? 'mv_slot_target' : undefined} data-slot="content" /></div>;
});

function catalogueUrl(filters: BuildFilters): string {
  const params = buildFilterParams(filters);
  params.delete('category');
  params.delete('page');
  const query = params.toString();
  return `${cataloguePath(filters.category, filters.page)}${query ? `?${query}` : ''}`;
}

export default function BuildExplorer({ builds, initialCategory = 'all', initialPage = 1 }: {
  builds: TotkBuild[]; initialCategory?: BuildCategory; initialPage?: number;
}) {
  const [filters, setFilters] = useState<BuildFilters>({ ...DEFAULT_BUILD_FILTERS, category: initialCategory, page: initialPage });
  const resultsRef = useRef<HTMLDivElement>(null);
  const wide = useSyncExternalStore(watchWideGrid, () => window.matchMedia('(min-width: 1280px)').matches, () => true);

  useEffect(() => {
    const read = () => {
      const params = new URLSearchParams(window.location.search);
      const location = catalogueLocation(window.location.pathname);
      const parsed = readBuildFilters(params);
      setFilters({ ...parsed, category: params.has('category') ? parsed.category : location.category, page: params.has('page') ? parsed.page : location.page });
    };
    read();
    window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, []);

  const results = useMemo(() => filterBuilds(builds, filters), [builds, filters]);
  const pages = Math.max(1, Math.ceil(results.length / BUILDS_PER_PAGE));
  const page = Math.min(filters.page, pages);
  const visible = results.slice((page - 1) * BUILDS_PER_PAGE, page * BUILDS_PER_PAGE);
  const adPositions = buildAdPositions(visible.length, wide);
  const categoryCounts = useMemo(() => Object.fromEntries(BUILD_CATEGORIES.map((category) => [
    category.id,
    category.id === 'all' ? builds.length : builds.filter((build) => build.categories.includes(category.id as Exclude<typeof category.id, 'all'>)).length,
  ])), [builds]);
  const active = Boolean(filters.q || filters.category !== initialCategory || filters.budget || filters.tested || filters.tag || filters.sort !== 'recommended');
  const resetFilters = { ...DEFAULT_BUILD_FILTERS, category: initialCategory };

  function change(patch: Partial<BuildFilters>, replace = false) {
    const next = { ...filters, page: 1, ...patch };
    setFilters(next);
    const url = catalogueUrl(next);
    if (replace) window.history.replaceState(null, '', url);
    else window.history.pushState(null, '', url);
  }

  return (
    <section id="browse-builds" aria-label="Find an Autobuild blueprint" className="scroll-mt-24">
      <SectionHeading>Browse Builds</SectionHeading>

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 sm:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400" size={21} aria-hidden="true" />
          <label htmlFor="build-search" className="sr-only">Search builds</label>
          <input
            id="build-search"
            type="search"
            value={filters.q}
            maxLength={160}
            onChange={(event) => change({ q: event.target.value }, true)}
            placeholder="Search hoverbikes, tanks, apple pickers…"
            className="w-full rounded-lg border border-gray-700 bg-gray-900 py-4 pl-12 pr-4 text-base text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Build categories">
          {BUILD_CATEGORIES.filter((category) => categoryCounts[category.id] > 0).map((category) => (
            <a
              href={catalogueUrl({ ...filters, category: category.id, page: 1 })}
              key={category.id}
              aria-current={filters.category === category.id ? 'page' : undefined}
              className={`min-h-10 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 ${filters.category === category.id ? 'border-yellow-400 bg-yellow-400 text-gray-900' : 'border-gray-700 text-gray-300 hover:border-yellow-400/50 hover:text-white'}`}
            >
              {category.label}<span className={`ml-2 text-xs ${filters.category === category.id ? 'text-gray-900/70' : 'text-gray-500'}`}>{categoryCounts[category.id]}</span>
            </a>
          ))}
        </div>
        <div className="mt-5 flex flex-col gap-4 border-t border-gray-700 pt-4 sm:flex-row sm:flex-wrap sm:items-center">
          <SlidersHorizontal size={16} className="hidden text-gray-500 sm:block" aria-hidden="true" />
          <label className="flex items-center justify-between gap-3 text-sm text-gray-300 sm:justify-start">
            Zonaite budget
            <select value={filters.budget} onChange={(event) => change({ budget: event.target.value })} className="min-h-10 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:outline-yellow-400">
              <option value="">Any cost</option>
              {[9, 15, 30, 60].map((budget) => <option key={budget} value={budget}>{budget} or less</option>)}
            </select>
          </label>
          <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={filters.tested} onChange={(event) => change({ tested: event.target.checked })} className="h-4 w-4 accent-yellow-400" />
            Community tested only
          </label>
          <label className="flex items-center justify-between gap-3 text-sm text-gray-300 sm:ml-auto sm:justify-start">
            Sort by
            <select value={filters.sort} onChange={(event) => change({ sort: event.target.value as BuildSort })} className="min-h-10 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:outline-yellow-400">
              <option value="recommended">Recommended</option>
              <option value="rating">Top rated</option>
              <option value="popular">Most viewed</option>
              <option value="cost">Lowest cost</option>
            </select>
          </label>
        </div>
      </div>

      <div ref={resultsRef} className="mb-5 mt-6 flex scroll-mt-24 flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-gray-400">
          <span className="font-semibold text-white">{results.length}</span> {results.length === 1 ? 'build' : 'builds'}{results.length > 0 && ` · Showing ${(page - 1) * BUILDS_PER_PAGE + 1}–${Math.min(page * BUILDS_PER_PAGE, results.length)}`}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {filters.tag && <button type="button" onClick={() => change({ tag: '' })} className="inline-flex items-center gap-2 rounded-full bg-yellow-400/10 px-3 py-1.5 text-sm text-yellow-300">#{filters.tag}<X size={13} aria-hidden="true" /><span className="sr-only">Remove tag filter</span></button>}
          {active && <button type="button" onClick={() => change(resetFilters)} className="inline-flex min-h-10 items-center gap-1.5 text-sm text-gray-300 underline decoration-gray-600 underline-offset-4 hover:text-white"><X size={14} aria-hidden="true" />Clear filters</button>}
        </div>
      </div>

      {visible.length ? (
        // Explicit Journey slot targets avoid adding another automatically
        // scanned content area (which could stack ads on top of these breaks).
        <div id="totk-build-results" className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${styles.grid}`} suppressHydrationWarning>
          {visible.flatMap((build, index) => [
            <BuildCard key={build.id} build={build} priority={index < 4} />,
            ...(adPositions.includes(index + 1) ? [<BuildAdBreak key={`ad-${index + 1}`} after={index + 1} />] : []),
          ])}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-600 px-6 py-16 text-center">
          <Search size={32} className="mx-auto mb-4 text-yellow-400" aria-hidden="true" />
          <h3 className="text-xl font-semibold text-white">No blueprints found</h3>
          <p className="mx-auto mt-2 max-w-md text-gray-400">Try a different name, a higher Zonaite budget or another category.</p>
          <button type="button" onClick={() => change(resetFilters)} className="mt-6 rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-gray-900 hover:bg-yellow-300">Show all builds</button>
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="Build catalogue pagination" className="mt-8 flex items-center justify-between gap-3 border-t border-gray-700 pt-6">
          {page > 1 ? <a href={catalogueUrl({ ...filters, page: page - 1 })} rel="prev" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm text-white hover:border-yellow-400 sm:px-5"><ArrowLeft size={16} aria-hidden="true" />Previous</a> : <span aria-disabled="true" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm text-white opacity-30 sm:px-5"><ArrowLeft size={16} aria-hidden="true" />Previous</span>}
          <span className="text-sm text-gray-400">Page <span className="text-white">{page}</span> of {pages}</span>
          {page < pages ? <a href={catalogueUrl({ ...filters, page: page + 1 })} rel="next" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm text-white hover:border-yellow-400 sm:px-5">Next<ArrowRight size={16} aria-hidden="true" /></a> : <span aria-disabled="true" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm text-white opacity-30 sm:px-5">Next<ArrowRight size={16} aria-hidden="true" /></span>}
          <div className="flex w-full flex-wrap justify-center gap-1.5 pt-3">
            {Array.from({ length: pages }, (_, index) => index + 1).map((number) => <a key={number} href={catalogueUrl({ ...filters, page: number })} aria-label={`Page ${number}`} aria-current={number === page ? 'page' : undefined} className={`flex min-h-11 min-w-11 items-center justify-center rounded-lg border px-2 text-sm ${number === page ? 'border-yellow-400 bg-yellow-400 font-semibold text-gray-900' : 'border-gray-700 text-gray-300 hover:border-yellow-400 hover:text-white'}`}>{number}</a>)}
          </div>
        </nav>
      )}
      <noscript><p className="mt-6 text-sm text-gray-300">Browse categories and result pages using the links above. Enable JavaScript to search and filter by cost or community test status.</p></noscript>
    </section>
  );
}
