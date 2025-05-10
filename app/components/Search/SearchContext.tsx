'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SearchContextType {
  isSearchOpen: boolean;
  searchQuery: string;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const openSearch = () => {
    setIsSearchOpen(true);
    // Add focus to search input and prevent scrolling when overlay is open
    document.body.style.overflow = 'hidden';
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    // Re-enable scrolling
    document.body.style.overflow = '';
  };

  // Keyboard shortcut listener – '/'  or cmd/ctrl + k
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement as HTMLElement)?.tagName?.toLowerCase();
      const isEditable = activeTag === 'input' || activeTag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable;
      // Ignore when user is already typing in a field
      if (isEditable) return;

      if (e.key === '/' && !isSearchOpen) {
        e.preventDefault();
        openSearch();
      }
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey) && !isSearchOpen) {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault();
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  return (
    <SearchContext.Provider
      value={{
        isSearchOpen,
        searchQuery,
        openSearch,
        closeSearch,
        setSearchQuery
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
} 