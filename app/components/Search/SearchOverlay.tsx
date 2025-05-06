'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useSearch } from './SearchContext';
import { useQuery } from '@apollo/client';
import { SEARCH_POSTS } from '@/app/lib/queries/searchPosts';
import client from '@/app/lib/apolloClient';
import Image from 'next/image';
import Link from 'next/link';
import { PLACEHOLDER_BASE64 } from '@/app/utils/placeholder';
import { useRouter } from 'next/navigation';
import { SearchResult } from '@/app/types/search';

export default function SearchOverlay() {
  const { isSearchOpen, closeSearch, searchQuery, setSearchQuery } = useSearch();
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Focus search input when overlay opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle escape key to close search
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [closeSearch]);

  // Query for search results
  const { loading, data, error } = useQuery(SEARCH_POSTS, {
    variables: { searchTerm: debouncedQuery, first: 10 },
    client,
    skip: !debouncedQuery || debouncedQuery.length < 3,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debouncedQuery && debouncedQuery.length >= 3) {
      router.push(`/search?q=${encodeURIComponent(debouncedQuery)}`);
      closeSearch();
    }
  };

  const results: SearchResult[] = data?.posts?.nodes || [];
  const hasResults = results.length > 0;

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-md z-50 overflow-y-auto flex flex-col"
        >
          {/* Header with search input and close button */}
          <div className="sticky top-0 bg-gray-900 border-b border-gray-800 shadow-xl">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <form onSubmit={handleSearchSubmit} className="flex-1 mr-4">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400" size={20} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search articles, guides, reviews..."
                      className="w-full py-3 pl-12 pr-4 bg-gray-800 text-white rounded-lg border-2 border-gray-700 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                </form>
                <button
                  onClick={closeSearch}
                  className="p-2 text-white hover:text-yellow-400 transition-colors"
                  aria-label="Close search"
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Search results */}
          <div className="flex-1 container mx-auto px-4 py-6">
            {debouncedQuery.length < 3 ? (
              <div className="text-center text-gray-400 mt-12">
                <p>Enter at least 3 characters to search</p>
              </div>
            ) : loading ? (
              <div className="text-center text-gray-400 mt-12">
                <p>Searching...</p>
              </div>
            ) : error ? (
              <div className="text-center text-red-400 mt-12">
                <p>Error searching. Please try again.</p>
              </div>
            ) : hasResults ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">
                  {results.length} result{results.length !== 1 ? 's' : ''} for "{debouncedQuery}"
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-yellow-400/20 transition-shadow"
                    >
                      <Link href={`/${result.slug}`} onClick={closeSearch}>
                        <div className="relative h-40">
                          <Image
                            src={result.featuredImage?.node?.sourceUrl || PLACEHOLDER_BASE64}
                            alt={result.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = PLACEHOLDER_BASE64;
                            }}
                          />
                          {result.categories?.nodes?.[0] && (
                            <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                              {result.categories.nodes[0].name}
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-white mb-2">{result.title}</h3>
                          <div 
                            className="text-sm text-gray-300 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: result.excerpt }}
                          />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-center mt-8">
                  <Link 
                    href={`/search?q=${encodeURIComponent(debouncedQuery)}`} 
                    onClick={closeSearch}
                    className="inline-block bg-yellow-400 text-black px-6 py-2 rounded-full hover:bg-yellow-300 transition-colors"
                  >
                    View all results
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 mt-12">
                <p>No results found for "{debouncedQuery}"</p>
                <p className="mt-2 text-sm">Try different keywords or check your spelling</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 