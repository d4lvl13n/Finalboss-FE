'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import ResponsiveArticleGrid from '../ResponsiveArticleGrid';
import type { GameArticle } from '../GameArticles';
import { GUIDE_TYPES, OOT_GUIDE_CATEGORY, OOT_GUIDE_INDEX, OOT_GUIDE_INDEX_FR, guideTypes, searchGuides, type GuideType } from '@/app/lib/oot-guides/types';

import { t } from '@/app/lib/i18n';

const PAGE_SIZE = 12;

export default function OotGuideExplorer({ guides }: { guides: GameArticle[] }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<GuideType | 'all'>('all');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const searched = searchGuides(guides, query);
  const filtered = searchGuides(guides, query, type);
  const index = guides.find((guide) => guide.slug === OOT_GUIDE_INDEX || guide.slug === OOT_GUIDE_INDEX_FR);
  const cards = filtered.slice(0, visible).map((article) => {
    const primary = type === 'all' ? guideTypes(article)[0] : type;
    const label = primary ? t(`oot.types.${primary}`) : t('guide.categoryDefault');
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
            <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400">{t('oot.brandLabel')}</p>
            <h2 id="oot-guides-title" className="mt-2 text-2xl font-bold text-white md:text-3xl">{t('oot.title')}</h2>
            <p className="mt-3 max-w-2xl text-gray-300">{t('oot.intro')}</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-yellow-400">
            {index && <Link prefetch={false} href={'/' + index.slug} className="hover:text-yellow-300">{t('oot.index')} →</Link>}
            <Link prefetch={false} href={'/guides/' + OOT_GUIDE_CATEGORY} className="hover:text-yellow-300">{t('guide.allGuides')} →</Link>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-700 bg-gray-800/50 p-4 md:p-5">
          <label htmlFor="oot-guide-search" className="mb-2 block text-sm font-semibold text-gray-200">{t('oot.search')}</label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input id="oot-guide-search" type="search" value={query} maxLength={200}
              placeholder={t('oot.placeholder')}
              onChange={(event) => { setQuery(event.target.value); setVisible(PAGE_SIZE); }}
              className="w-full rounded-xl border border-gray-600 bg-gray-900 py-3 pl-12 pr-12 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 [&::-webkit-search-cancel-button]:appearance-none" />
            {query && <button type="button" aria-label={t('oot.clearSearch')} onClick={() => { setQuery(''); setVisible(PAGE_SIZE); }} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-300 hover:bg-gray-700 hover:text-white"><X aria-hidden="true" className="h-4 w-4" /></button>}
          </div>

          <div role="group" aria-label={t('oot.guideType')} className="mt-4 flex flex-wrap gap-2">
            {[{ id: 'all' as const }, ...GUIDE_TYPES].map((item) => {
              const count = item.id === 'all' ? searched.length : searched.filter((article) => guideTypes(article).includes(item.id as GuideType)).length;
              const active = type === item.id;
              return <button key={item.id} type="button" aria-pressed={active} data-guide-type={item.id}
                onClick={() => { setType(item.id); setVisible(PAGE_SIZE); }}
                className={'rounded-full border px-4 py-2 text-sm font-semibold transition-colors ' + (active ? 'border-yellow-400 bg-yellow-400 text-gray-900' : 'border-gray-600 bg-gray-900 text-gray-300 hover:border-gray-400 hover:text-white')}>
                {item.id === 'all' ? t('guide.allGuides') : t(`oot.types.${item.id}`)} <span className={active ? 'ml-1 text-gray-700' : 'ml-1 text-gray-500'}>({count})</span>
              </button>;
            })}
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p role="status" aria-live="polite" className="text-gray-400" data-guide-result-count>
            {t(filtered.length === 1 ? 'oot.resultOne' : 'oot.results', { count: filtered.length })}
            {filtered.length > PAGE_SIZE && <span> · {t('oot.showing', { count: Math.min(visible, filtered.length) })}</span>}
          </p>
          {(query || type !== 'all') && <button type="button" onClick={clear} className="font-semibold text-yellow-400 hover:text-yellow-300">{t('oot.clearFilters')}</button>}
        </div>

        {cards.length ? <div data-oot-guide-results><ResponsiveArticleGrid articles={cards} showFeatured={false} featuredCount={0} /></div> : (
          <div className="rounded-xl border border-gray-700 bg-gray-800/40 px-6 py-12 text-center">
            <h3 className="text-xl font-bold text-white">{t('oot.noGuides')}</h3>
            <p className="mt-2 text-gray-400">{guides.length ? t('oot.tryAgain') : t('oot.empty')}</p>
            {(query || type !== 'all') && <button type="button" onClick={clear} className="mt-5 rounded-full bg-yellow-400 px-5 py-2.5 font-semibold text-gray-900 hover:bg-yellow-300">{t('oot.clearFilters')}</button>}
          </div>
        )}

        {visible < filtered.length && <div className="mt-8 text-center">
          <button type="button" onClick={() => setVisible((current) => current + PAGE_SIZE)} className="rounded-full border border-gray-600 bg-gray-800 px-6 py-3 font-semibold text-white hover:border-yellow-400 hover:text-yellow-400">{t('oot.loadMore')}</button>
        </div>}
      </div>
    </section>
  );
}
