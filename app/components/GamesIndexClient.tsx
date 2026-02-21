'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { t } from '../lib/i18n';

interface GameTag {
  name: string;
  slug: string;
  igdbData?: string | null;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface GamesIndexClientProps {
  initialTags: GameTag[];
  initialPageInfo: PageInfo;
  pageSize: number;
}

const GAME_TAGS_QUERY = `
  query GameTagsForIndex($first: Int!, $after: String) {
    gameTags(first: $first, after: $after) {
      nodes {
        name
        slug
        igdbData
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

function parseIgdbData(igdbData?: string | null): Record<string, unknown> | null {
  if (!igdbData) {
    return null;
  }

  try {
    const parsed = JSON.parse(igdbData);
    if (typeof parsed === 'string') {
      return JSON.parse(parsed) as Record<string, unknown>;
    }
    if (parsed && typeof parsed === 'object') {
      return parsed as Record<string, unknown>;
    }
  } catch (error) {
    console.error('Failed to parse igdbData:', error);
  }

  return null;
}

function buildIgdbImageUrl(imageId: string, size: 'cover_big' | 'screenshot_big') {
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
}

function getCoverUrl(igdbData: Record<string, unknown> | null): string | null {
  if (!igdbData) {
    return null;
  }

  const coverUrl = typeof igdbData.cover_url === 'string' ? igdbData.cover_url : null;
  if (coverUrl) {
    return coverUrl;
  }

  const cover = igdbData.cover as { image_id?: string } | undefined;
  if (cover?.image_id) {
    return buildIgdbImageUrl(cover.image_id, 'cover_big');
  }

  return null;
}

function extractNames(
  values: unknown,
  fallbackKey: 'name' | null = 'name'
): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((value) => {
      if (typeof value === 'string') {
        return value;
      }
      if (value && typeof value === 'object' && fallbackKey) {
        const name = (value as { name?: string })[fallbackKey];
        return typeof name === 'string' ? name : null;
      }
      return null;
    })
    .filter((name): name is string => Boolean(name));
}

export default function GamesIndexClient({
  initialTags,
  initialPageInfo,
  pageSize,
}: GamesIndexClientProps) {
  const [tags, setTags] = useState<GameTag[]>(initialTags);
  const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const allLabel = t('game.filterAll');
  const [platformFilter, setPlatformFilter] = useState(allLabel);
  const [genreFilter, setGenreFilter] = useState(allLabel);

  const decoratedTags = useMemo(
    () =>
      tags.map((tag) => {
        const parsed = parseIgdbData(tag.igdbData);
        const platforms = extractNames(parsed?.platforms);
        const genres = extractNames(parsed?.genres);
        return {
          ...tag,
          parsed,
          platforms,
          genres,
          coverUrl: getCoverUrl(parsed),
        };
      }),
    [tags]
  );

  const availablePlatforms = useMemo(() => {
    const set = new Set<string>();
    decoratedTags.forEach((tag) => {
      tag.platforms.forEach((platform) => set.add(platform));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [decoratedTags]);

  const availableGenres = useMemo(() => {
    const set = new Set<string>();
    decoratedTags.forEach((tag) => {
      tag.genres.forEach((genre) => set.add(genre));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [decoratedTags]);

  const filteredTags = useMemo(() => {
    return decoratedTags.filter((tag) => {
      const matchesPlatform =
        platformFilter === allLabel || tag.platforms.includes(platformFilter);
      const matchesGenre =
        genreFilter === allLabel || tag.genres.includes(genreFilter);
      return matchesPlatform && matchesGenre;
    });
  }, [decoratedTags, platformFilter, genreFilter]);

  const handleLoadMore = async () => {
    if (!pageInfo.hasNextPage || loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/wordpress-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: GAME_TAGS_QUERY,
          variables: {
            first: pageSize,
            after: pageInfo.endCursor,
          },
        }),
      });

      const json = await response.json();
      const newNodes: GameTag[] = json?.data?.gameTags?.nodes ?? [];
      const nextPageInfo: PageInfo = json?.data?.gameTags?.pageInfo ?? {
        hasNextPage: false,
        endCursor: null,
      };

      setTags((prev) => {
        const seen = new Set(prev.map((tag) => tag.slug));
        const merged = [...prev];
        newNodes.forEach((node) => {
          if (!seen.has(node.slug)) {
            seen.add(node.slug);
            merged.push(node);
          }
        });
        return merged;
      });
      setPageInfo(nextPageInfo);
    } catch (err) {
      console.error('Failed to load more games:', err);
      setError(t('common.error.loadMoreGames'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-14">
      <div className="flex items-center mb-6">
        <h2 className="text-3xl font-bold text-white mr-4">{t('game.browseHubs')}</h2>
        <div className="flex-grow h-0.5 bg-gradient-to-r from-yellow-400/80 to-transparent rounded-full" />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm text-gray-400 mb-2" htmlFor="platform-filter">
            {t('game.platformFilter')}
          </label>
          <select
            id="platform-filter"
            value={platformFilter}
            onChange={(event) => setPlatformFilter(event.target.value)}
            className="w-full rounded-lg bg-gray-800 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-yellow-400"
          >
            <option>{t('game.filterAll')}</option>
            {availablePlatforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-400 mb-2" htmlFor="genre-filter">
            {t('game.genreFilter')}
          </label>
          <select
            id="genre-filter"
            value={genreFilter}
            onChange={(event) => setGenreFilter(event.target.value)}
            className="w-full rounded-lg bg-gray-800 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-yellow-400"
          >
            <option>{t('game.filterAll')}</option>
            {availableGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-400 lg:text-right">
          {t('game.showingCount', { filtered: filteredTags.length, total: decoratedTags.length })}
        </div>
      </div>

      {filteredTags.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/game/${tag.slug}`}
              className="group rounded-xl border border-white/10 bg-gray-800/70 hover:bg-gray-800 transition-colors overflow-hidden"
            >
              <div className="relative h-40 bg-gray-900">
                {tag.coverUrl ? (
                  <Image
                    src={tag.coverUrl}
                    alt={tag.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">
                    {t('game.noCover')}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                  {tag.name}
                </h3>
                <p className="text-sm text-gray-400">{t('game.exploreCoverage')}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-gray-800/70 p-6 text-gray-300">
          {t('game.noMatchFilters')}
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-3">
        {error && <p className="text-sm text-red-400">{error}</p>}
        {pageInfo.hasNextPage && (
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-3 rounded-full bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-60"
          >
            {loading ? t('common.loadingMore') : t('common.loadMore')}
          </button>
        )}
        {!pageInfo.hasNextPage && (
          <p className="text-sm text-gray-500">{t('game.endOfList')}</p>
        )}
      </div>
    </section>
  );
}
