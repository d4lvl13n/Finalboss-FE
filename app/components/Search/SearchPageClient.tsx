'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { SEARCH_POSTS } from '@/app/lib/queries/searchPosts';
import client from '@/app/lib/apolloClient';
import Image from 'next/image';
import Link from 'next/link';
import { PLACEHOLDER_BASE64 } from '@/app/utils/placeholder';
import { FaSearch } from 'react-icons/fa';
import { SearchResult } from '@/app/types/search';
import { t } from '@/app/lib/i18n';
import { formatDateShort } from '@/app/utils/formatDate';

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);
  const [debouncedInput, setDebouncedInput] = useState(query);
  const router = useRouter();

  const { loading, data, error, fetchMore } = useQuery(SEARCH_POSTS, {
    variables: { searchTerm: query, first: 20 },
    client,
    skip: !query,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (debouncedInput && debouncedInput.length >= 3) {
      router.push(`/search?q=${encodeURIComponent(debouncedInput)}`);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const results: SearchResult[] = data?.posts?.nodes || [];
  const hasNextPage = data?.posts?.pageInfo?.hasNextPage || false;
  const endCursor = data?.posts?.pageInfo?.endCursor || '';

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchMore({
        variables: { after: endCursor },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            posts: {
              ...fetchMoreResult.posts,
              nodes: [...prev.posts.nodes, ...fetchMoreResult.posts.nodes],
            },
          };
        },
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {query ? t('search.pageTitle', { query }) : t('search.title')}
          </h1>

          <form className="max-w-2xl mb-8" onSubmit={handleSearch}>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400" size={20} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full py-3 pl-12 pr-4 bg-gray-800 text-white rounded-lg border-2 border-gray-700 focus:border-yellow-400 focus:outline-none"
              />
            </div>
          </form>

          {!query ? (
            <div className="text-center text-gray-400 mt-12">
              <p>{t('search.emptyState')}</p>
            </div>
          ) : loading || isLoading ? (
            <div className="text-center text-gray-400 mt-12">
              <p>{t('search.searching')}</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 mt-12">
              <p>{t('search.error')}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center text-gray-400 mt-12">
              <p>{t('search.noResults', { query })}</p>
              <p className="mt-2 text-sm">{t('search.noResultsTip')}</p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 mb-8">
                {t('search.found', { count: results.length, resultWord: results.length !== 1 ? t('search.results') : t('search.result'), query })}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result: SearchResult) => (
                  <div
                    key={result.id}
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-yellow-400/20 transition-shadow"
                  >
                    <Link href={`/${result.slug}`}>
                      <div className="relative h-48">
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
                        <h2 className="text-xl font-semibold text-white mb-2">{result.title}</h2>
                        <div
                          className="text-sm text-gray-300 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: result.excerpt }}
                        />
                        <div className="mt-4 text-sm text-gray-400">
                          {formatDateShort(result.date)}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {hasNextPage && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="inline-block bg-yellow-400 text-black px-6 py-2 rounded-full hover:bg-yellow-300 transition-colors"
                  >
                    {t('search.loadMore')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

