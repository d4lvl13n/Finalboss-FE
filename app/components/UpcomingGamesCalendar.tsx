import Link from 'next/link';
import Image from 'next/image';
import { getUpcomingGames } from '../lib/igdb-server';
import type { IGDBGame } from '../types/igdb';

interface UpcomingGamesCalendarProps {
  limit?: number;
  compact?: boolean;
  title?: string;
  description?: string;
  href?: string;
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

export default async function UpcomingGamesCalendar({
  limit = 12,
  compact = false,
  title = 'Releasing Soon',
  description = 'Track the next wave of launches from IGDB without digging through the full catalog.',
  href = '/games',
}: UpcomingGamesCalendarProps) {
  const games = await getUpcomingGames(limit);

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

  const sections = groupByMonth(games);

  return (
    <section className="mt-16">
      <div className="mb-10">
        <div className="flex items-center">
          <h2 className="mr-4 text-3xl font-bold text-white md:text-4xl">{title}</h2>
          <div className="h-0.5 flex-grow rounded-full bg-gradient-to-r from-yellow-400/80 to-transparent" />
        </div>
        <p className="mt-4 max-w-3xl text-base leading-7 text-gray-400">{description}</p>
      </div>

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
    </section>
  );
}
