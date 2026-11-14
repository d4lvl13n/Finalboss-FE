'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { useSearch } from './SearchContext';
import { SEARCH_POSTS } from '@/app/lib/queries/searchPosts';
import client from '@/app/lib/apolloClient';
import { t } from '@/app/lib/i18n';
import { trackSearch } from '@/app/lib/fbq';
import PostRow from '../Section/PostRow';
import type { SectionPost } from '@/app/lib/sectionQuery';

const JUMP = [
  { href: '/guides', label: t('nav.guides') },
  { href: '/reviews', label: t('nav.reviews') },
  { href: '/gaming', label: t('nav.news') },
  { href: '/technology', label: t('nav.technology') },
  { href: '/games', label: t('nav.games') },
];

/**
 * Full-screen search. Loaded on demand (see SearchOverlayLazy), so Apollo is
 * only downloaded by people who actually search. Results reuse the same rows
 * as the section pages, so a result looks like every other list on the site.
 */
export default function SearchOverlay() {
  const { isSearchOpen, closeSearch, searchQuery, setSearchQuery } = useSearch();
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounce typing to avoid a request per keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchOpen) inputRef.current?.focus();
  }, [isSearchOpen]);

  const ready = debouncedQuery.trim().length >= 3;
  const { loading, data, error } = useQuery(SEARCH_POSTS, {
    variables: { searchTerm: debouncedQuery, first: 10 },
    client,
    skip: !ready,
  });

  if (!isSearchOpen) return null;

  const results: SectionPost[] = data?.posts?.nodes || [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    trackSearch(debouncedQuery);
    router.push(`/search?q=${encodeURIComponent(debouncedQuery)}`);
    closeSearch();
  };

  return (
    <div className="fb-search" role="dialog" aria-modal="true" aria-label={t('search.title')}>
      <div className="fb-search-top">
        <div className="fb-wrap">
          <form onSubmit={submit} role="search">
            <input
              ref={inputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              aria-label={t('search.placeholder')}
              autoComplete="off"
            />
          </form>
          <button type="button" className="fb-search-close" onClick={closeSearch} aria-label={t('a11y.closeSearch')}>
            Esc
          </button>
        </div>
      </div>

      <div className="fb-wrap fb-search-body" onClick={(e) => (e.target as HTMLElement).closest('a') && closeSearch()}>
        {!ready ? (
          <>
            <p className="fb-search-note">{t('search.minChars')}</p>
            <h2>{t('footer.categories')}</h2>
            <nav className="fb-search-jump" aria-label={t('footer.categories')}>
              {JUMP.map((item) => (
                <Link prefetch={false} key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </>
        ) : loading ? (
          <p className="fb-search-note" role="status">{t('search.searching')}</p>
        ) : error ? (
          <p className="fb-search-note" role="alert">{t('search.error')}</p>
        ) : results.length > 0 ? (
          <>
            <h2>
              {t('search.resultsFor', {
                count: results.length,
                resultWord: results.length !== 1 ? t('search.results') : t('search.result'),
                query: debouncedQuery,
              })}
            </h2>
            {results.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
            <p className="fb-search-all">
              <Link prefetch={false} href={`/search?q=${encodeURIComponent(debouncedQuery)}`} className="fb-btn">
                {t('search.viewAll')}
              </Link>
            </p>
          </>
        ) : (
          <>
            <p className="fb-search-note">{t('search.noResults', { query: debouncedQuery })}</p>
            <p className="fb-search-note">{t('search.noResultsTip')}</p>
          </>
        )}
      </div>
    </div>
  );
}
