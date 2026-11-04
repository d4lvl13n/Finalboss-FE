'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import ResponsiveArticleGrid from '../ResponsiveArticleGrid';
import type { GameArticle } from '../GameArticles';
import { GUIDE_TYPES, OOT_GUIDE_CATEGORY, OOT_GUIDE_INDEX, guideTypes, searchGuides, type GuideType } from '@/app/lib/oot-guides/types';

const PAGE_SIZE = 12;

export default function OotGuideExplorer({ guides }: { guides: GameArticle[] }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<GuideType | 'all'>('all');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const searched = searchGuides(guides, query);
  const filtered = searchGuides(guides, query, type);
  const cards = filtered.slice(0, visible).map((article) => {
    const primary = type === 'all' ? guideTypes(article)[0] : type;
    const label = GUIDE_TYPES.find((item) => item.id === primary)?.label || 'Guide';
    return { ...article, categories: { nodes: [{ name: label, slug: 'gaming-guide' }] } };
  });

  function clear() {
    setQuery('');
    setType('all');
    setVisible(PAGE_SIZE);
  }

  return (
    <section id="oot-guides" aria-labelledby="oot-guides-title" className="bg-gray-900 py-8 md:py-12" data-oot-guide-explorer data-total-guides={guides.length}>
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400">FinalBoss guides</p>
            <h2 id="oot-guides-title" className="mt-2 text-2xl font-bold text-white md:text-3xl">Find your next Ocarina of Time guide.</h2>
            <p className="mt-3 max-w-2xl text-gray-300">Switch 2 dungeon routes, bosses, quests and collectibles. Search the collection or choose a guide type.</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-yellow-400">
            {guides.some((guide) => guide.slug === OOT_GUIDE_INDEX) && <Link prefetch={false} href={'/' + OOT_GUIDE_INDEX} className="hover:text-yellow-300">Guide index →</Link>}
            <Link prefetch={false} href={'/guides/' + OOT_GUIDE_CATEGORY} className="hover:text-yellow-300">All guides →</Link>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-700 bg-gray-800/50 p-4 md:p-5">
          <label htmlFor="oot-guide-search" className="mb-2 block text-sm font-semibold text-gray-200">Search Ocarina of Time guides</label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input id="oot-guide-search" type="search" value={query} maxLength={200}
              placeholder="Try Water Temple, Biggoron or Skulltulas…"
              onChange={(event) => { setQuery(event.target.value); setVisible(PAGE_SIZE); }}
              className="w-full rounded-xl border border-gray-600 bg-gray-900 py-3 pl-12 pr-12 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 [&::-webkit-search-cancel-button]:appearance-none" />
            {query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(''); setVisible(PAGE_SIZE); }} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-300 hover:bg-gray-700 hover:text-white"><X aria-hidden="true" className="h-4 w-4" /></button>}
          </div>

          <div role="group" aria-label="Guide type" className="mt-4 flex flex-wrap gap-2">
            {[{ id: 'all' as const, label: 'All guides' }, ...GUIDE_TYPES].map((item) => {
              const count = item.id === 'all' ? searched.length : searched.filter((article) => guideTypes(article).includes(item.id as GuideType)).length;
              const active = type === item.id;
              return <button key={item.id} type="button" aria-pressed={active} data-guide-type={item.id}
                onClick={() => { setType(item.id); setVisible(PAGE_SIZE); }}
                className={'rounded-full border px-4 py-2 text-sm font-semibold transition-colors ' + (active ? 'border-yellow-400 bg-yellow-400 text-gray-900' : 'border-gray-600 bg-gray-900 text-gray-300 hover:border-gray-400 hover:text-white')}>
                {item.label} <span className={active ? 'ml-1 text-gray-700' : 'ml-1 text-gray-500'}>({count})</span>
              </button>;
            })}
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p role="status" aria-live="polite" className="text-gray-400" data-guide-result-count>
            {filtered.length} {filtered.length === 1 ? 'guide' : 'guides'} found
            {filtered.length > PAGE_SIZE && <span> · Showing {Math.min(visible, filtered.length)}</span>}
          </p>
          {(query || type !== 'all') && <button type="button" onClick={clear} className="font-semibold text-yellow-400 hover:text-yellow-300">Clear filters</button>}
        </div>

        {cards.length ? <div data-oot-guide-results><ResponsiveArticleGrid articles={cards} showFeatured={false} featuredCount={0} /></div> : (
          <div className="rounded-xl border border-gray-700 bg-gray-800/40 px-6 py-12 text-center">
            <h3 className="text-xl font-bold text-white">No guides found</h3>
            <p className="mt-2 text-gray-400">{guides.length ? 'Try another keyword or guide type.' : 'New guides will appear here as they are published.'}</p>
            {(query || type !== 'all') && <button type="button" onClick={clear} className="mt-5 rounded-full bg-yellow-400 px-5 py-2.5 font-semibold text-gray-900 hover:bg-yellow-300">Clear filters</button>}
          </div>
        )}

        {visible < filtered.length && <div className="mt-8 text-center">
          <button type="button" onClick={() => setVisible((current) => current + PAGE_SIZE)} className="rounded-full border border-gray-600 bg-gray-800 px-6 py-3 font-semibold text-white hover:border-yellow-400 hover:text-yellow-400">Show more guides</button>
        </div>}
      </div>
    </section>
  );
}
