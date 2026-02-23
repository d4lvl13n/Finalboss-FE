// components/GameSearch.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { IGDBClient } from '../lib/igdb-client';
import { IGDBGame } from '../types/igdb';
import debounce from 'lodash/debounce';
import { useRouter } from 'next/navigation';
import { t } from '../lib/i18n';
import { formatDate } from '../utils/formatDate';

const client = new IGDBClient();

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('GameSearch error boundary captured an error:', error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-4">
          <p className="text-red-500">{t('common.error.generic')}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Helper function to safely get platform name
const getPlatformName = (platform?: { name?: string } | string): string => {
  if (typeof platform === 'string') return platform;
  if (platform && typeof platform === 'object' && 'name' in platform) {
    return platform.name ?? t('game.unknownPlatform');
  }
  return t('game.unknownPlatform');
};

// Game card component to isolate potential rendering issues
const GameCard = ({ game }: { game: IGDBGame }) => {
  try {
    const platforms = Array.isArray(game.platforms) 
      ? game.platforms.map(getPlatformName)
      : [];

    return (
      <div
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
      >
        {game.cover_url && (
          <div className="relative h-48">
            <Image
              src={game.cover_url}
              alt={game.name || 'Game cover'}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <h3 className="text-xl font-bold text-white mb-2">
            {game.name || t('game.untitled')}
          </h3>
          {game.release_date && (
            <p className="text-gray-400 text-sm mb-2">
              {t('game.released', { date: formatDate(game.release_date) })}
            </p>
          )}
          {game.rating && (
            <div className="flex items-center mb-2">
              <span className="text-yellow-400 mr-1">★</span>
              <span className="text-white">{Math.round(game.rating)}/100</span>
            </div>
          )}
          {platforms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {platforms.map((platformName, index) => (
                <span
                  key={`${game.id}-${index}`}
                  className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                >
                  {platformName}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering game card:', error, game);
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <p className="text-red-500">{t('game.displayError')}</p>
      </div>
    );
  }
};

export function GameSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IGDBGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await client.searchGames(searchQuery);
        console.log('API Response:', response);

        if (!response || !response.data) {
          throw new Error('Invalid response format');
        }

        setResults(response.data);
      } catch (err: unknown) {
        console.error('Search error:', err);
        const message = err instanceof Error ? err.message : 'An error occurred while searching';
        setError(message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleGameClick = async (game: IGDBGame) => {
    try {
      const response = await fetch('/api/games/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: {
            title: game.name,
            description: game.description || '',
            igdbData: {
              ...game,
              igdb_id: game.id
            }
          }
        })
      });

      const { success, slug } = await response.json();
      if (success) {
        router.push(`/game/${slug}`);
      } else {
        throw new Error('Failed to create game post');
      }
    } catch (error) {
      console.error('Error saving game:', error);
      // Fallback to direct IGDB ID route
      router.push(`/game/${game.id}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-8">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={t('game.searchPlaceholder')}
            className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:outline-none"
          />
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.length > 0 ? (
            results.map((game) => (
              <ErrorBoundary key={game.id?.toString()}>
                <div onClick={() => handleGameClick(game)} className="cursor-pointer">
                  <GameCard game={game} />
                </div>
              </ErrorBoundary>
            ))
          ) : (
            query.trim() && !loading && (
              <div className="col-span-full text-center text-gray-400">
                {t('game.noGamesFound')}
              </div>
            )
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
