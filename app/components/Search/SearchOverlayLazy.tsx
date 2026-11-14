'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useSearch } from './SearchContext';

// The overlay pulls in Apollo and framer-motion. Loading it only when someone
// actually opens search keeps both libraries out of every page's first load.
const SearchOverlay = dynamic(() => import('./SearchOverlay'), { ssr: false });

export default function SearchOverlayLazy() {
  const { isSearchOpen } = useSearch();
  const [wanted, setWanted] = useState(false);
  useEffect(() => {
    if (isSearchOpen) setWanted(true);
  }, [isSearchOpen]);
  return wanted ? <SearchOverlay /> : null;
}
