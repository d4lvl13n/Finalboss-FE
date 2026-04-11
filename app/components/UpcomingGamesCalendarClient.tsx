'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { IGDBGame } from '../types/igdb';

interface UpcomingGamesCalendarClientProps {
  games: IGDBGame[];
  compact?: boolean;
  title: string;
  description: string;
  href: string;
}

function formatReleaseDate(value?: string) {
  if (!value) {
    return 'Date TBA';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Date TBA';
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatMonthTitle(value?: string) {
  if (!value) {
    return 'Coming Up';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Coming Up';
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function formatPlatforms(game: IGDBGame) {
  const platforms = game.platforms?.map((platform) => platform.name).filter(Boolean) ?? [];

  if (platforms.length <= 3) {
    return platforms.join(' • ');
  }

  return `${platforms.slice(0, 3).join(' • ')} +${platforms.length - 3}`;
}

function groupByMonth(games: IGDBGame[]) {
  const sections = new Map<string, IGDBGame[]>();

  for (const game of games) {
    const key = formatMonthTitle(game.release_date);
    const existing = sections.get(key) ?? [];
    existing.push(game);
    sections.set(key, existing);
  }

  return Array.from(sections.entries()).map(([title, gamesForMonth]) => ({
    title,
    games: gamesForMonth,
  }));
}

function getGameMonths(games: IGDBGame[]) {
  return Array.from(new Set(games.map((game) => formatMonthTitle(game.release_date))));
}

function getPlatforms(games: IGDBGame[]) {
  return Array.from(
    new Set(
      games.flatMap((game) => game.platforms?.map((platform) => platform.name).filter(Boolean) ?? [])
    )
  ).sort((left, right) => left.localeCompare(right));
}

function getGenres(games: IGDBGame[]) {
  return Array.from(new Set(games.flatMap((game) => game.genres ?? []))).sort((left, right) =>
    left.localeCompare(right)
  );
}

function CalendarCard({ game, compact = false }: { game: IGDBGame; compact?: boolean }) {
  const platforms = formatPlatforms(game);
  const genres = game.genres?.slice(0, compact ? 1 : 2).join(' • ');
  const href = `/game/${game.id}`;
  const description = game.description?.replace(/\s+/g, ' ').trim();

  return (
    <Link
      href={href}
      className={`group overflow-hidden rounded-2xl border border-white/10 bg-gray-800/80 transition-all duration-300 hover:border-yellow-400/40 hover:bg-gray-800 ${compact ? '' : 'md:grid md:grid-cols-[132px,1fr]'}`}
    >
      <div className={`relative bg-gray-900 ${compact ? 'aspect-[16/9]' : 'h-full min-h-[188px]'}`}>
        {game.cover_url ? (
          <Image
            src={game.cover_url}
            alt={game.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-black text-gray-600">
            {game.name[0]}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
      <div className={`flex flex-col ${compact ? 'gap-3 p-5' : 'gap-3 p-5 md:p-6'}`}>
        <div className="flex items-center gap-3">
          <span className="inline-flex rounded-full bg-yellow-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-yellow-300">
            {formatReleaseDate(game.release_date)}
          </span>
        </div>
        <div className="space-y-2">
          <h3 className={`${compact ? 'text-xl' : 'text-2xl'} font-bold leading-tight text-white transition-colors group-hover:text-yellow-300`}>
            {game.name}
          </h3>
          {platforms ? (
            <p className="text-sm leading-6 text-gray-300">{platforms}</p>
          ) : null}
          {genres ? (
            <p className="text-sm font-semibold text-yellow-300/90">{genres}</p>
          ) : null}
          {!compact && description ? (
            <p className="line-clamp-2 text-sm leading-6 text-gray-400">{description}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export default function UpcomingGamesCalendarClient({
  games,
  compact = false,
  title,
  description,
  href,
}: UpcomingGamesCalendarClientProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [monthFilter, setMonthFilter] = useState('All Months');
  const [platformFilter, setPlatformFilter] = useState('All Platforms');
  const [genreFilter, setGenreFilter] = useState('All Genres');

  const monthOptions = useMemo(() => ['All Months', ...getGameMonths(games)], [games]);
  const platformOptions = useMemo(() => ['All Platforms', ...getPlatforms(games)], [games]);
  const genreOptions = useMemo(() => ['All Genres', ...getGenres(games)], [games]);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesMonth =
        monthFilter === 'All Months' || formatMonthTitle(game.release_date) === monthFilter;
      const matchesPlatform =
        platformFilter === 'All Platforms' ||
        (game.platforms?.some((platform) => platform.name === platformFilter) ?? false);
      const matchesGenre =
        genreFilter === 'All Genres' || (game.genres?.includes(genreFilter) ?? false);

      return matchesMonth && matchesPlatform && matchesGenre;
    });
  }, [games, genreFilter, monthFilter, platformFilter]);

  if (!games.length) {
    return null;
  }

  if (compact) {
    return (
      <section className="py-10 md:py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center">
                <h2 className="mr-4 text-4xl font-bold text-yellow-400">{title}</h2>
                <div className="h-1 flex-grow rounded-full bg-gradient-to-r from-yellow-400 to-transparent" />
              </div>
              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">{description}</p>
            </div>
            <Link
              href={href}
              className="hidden rounded-full border border-yellow-400/30 px-5 py-3 text-sm font-semibold text-yellow-300 transition-colors hover:bg-yellow-400 hover:text-gray-950 md:inline-flex"
            >
              Open Calendar
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {games.slice(0, 3).map((game) => (
              <CalendarCard key={game.id ?? game.name} game={game} compact />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const sections = groupByMonth(filteredGames);

  return (
    <section className="mt-16">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <h2 className="text-3xl font-bold text-white md:text-4xl">{title}</h2>
          <div className="hidden h-0.5 min-w-24 flex-1 rounded-full bg-gradient-to-r from-yellow-400/80 to-transparent lg:block" />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setFiltersOpen((value) => !value)}
            className="rounded-full border border-yellow-400/25 bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-gray-950 transition-colors hover:bg-yellow-300"
          >
            Filter
          </button>
        </div>
      </div>

      {filtersOpen ? (
        <div className="mb-8 grid gap-3 rounded-2xl border border-white/10 bg-gray-800/45 p-4 md:grid-cols-3">
          <label className="block">
            <span className="sr-only">Month</span>
            <select
              value={monthFilter}
              onChange={(event) => setMonthFilter(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-gray-900 px-4 py-2.5 text-sm font-medium text-white outline-none transition-colors focus:border-yellow-400/60"
            >
              {monthOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="sr-only">Platform</span>
            <select
              value={platformFilter}
              onChange={(event) => setPlatformFilter(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-gray-900 px-4 py-2.5 text-sm font-medium text-white outline-none transition-colors focus:border-yellow-400/60"
            >
              {platformOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="sr-only">Genre</span>
            <select
              value={genreFilter}
              onChange={(event) => setGenreFilter(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-gray-900 px-4 py-2.5 text-sm font-medium text-white outline-none transition-colors focus:border-yellow-400/60"
            >
              {genreOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      {sections.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-gray-800/50 p-8 text-center text-gray-300">
          No upcoming games matched those filters.
        </div>
      ) : (
        <div className="space-y-12">
          {sections.map((section) => (
            <div key={section.title} className="space-y-5">
              <div className="flex items-center gap-4">
                <span className="inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300">
                  {section.title}
                </span>
                <div className="h-px flex-grow bg-white/10" />
              </div>
              <div className="grid gap-5 xl:grid-cols-2">
                {section.games.map((game) => (
                  <CalendarCard key={game.id ?? game.name} game={game} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
