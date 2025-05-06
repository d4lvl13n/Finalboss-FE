'use client';

import React, { ReactNode } from 'react';
import { SearchProvider } from './SearchContext';
import SearchOverlay from './SearchOverlay';

export default function SearchClientWrapper({ children }: { children: ReactNode }) {
  return (
    <SearchProvider>
      {children}
      <SearchOverlay />
    </SearchProvider>
  );
} 