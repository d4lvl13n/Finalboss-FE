'use client';

import { useSearch } from './SearchContext';

/** The one interactive element in the header: opens the search overlay. */
export default function SearchButton({ label }: { label: string }) {
  const { openSearch } = useSearch();
  return (
    <button type="button" className="fb-find" onClick={openSearch} aria-label={label}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M16 16l5 5" />
      </svg>
      <kbd aria-hidden="true">/</kbd>
    </button>
  );
}
