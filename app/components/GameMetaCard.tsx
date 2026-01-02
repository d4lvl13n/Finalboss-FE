'use client';

import Link from 'next/link';
import { formatDate } from '../utils/formatDate';

interface GameTag {
  name: string;
  slug: string;
  igdbId?: string | null;
  igdbData?: string | null;
}

interface GameMetaCardProps {
  gameTag: GameTag;
}

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
    console.error('Failed to parse igdbData for article meta card:', error);
  }

  return null;
}

function extractNames(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (typeof entry === 'string') {
        return entry;
      }
      if (entry && typeof entry === 'object') {
        const name = (entry as { name?: string }).name;
        return typeof name === 'string' ? name : null;
      }
      return null;
    })
    .filter((entry): entry is string => Boolean(entry));
}

function extractSummary(data: Record<string, unknown> | null): string | null {
  if (!data) {
    return null;
  }

  const summary = data.summary;
  if (typeof summary === 'string' && summary.trim()) {
    return summary.trim();
  }

  const description = data.description;
  if (typeof description === 'string' && description.trim()) {
    return description.trim();
  }

  return null;
}

function clampText(value: string, maxLength = 160) {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

function extractFactPills(data: Record<string, unknown> | null) {
  const facts: string[] = [];
  if (!data) {
    return facts;
  }

  const modes = extractNames(data.game_modes).slice(0, 2);
  if (modes.length) {
    facts.push(`Mode: ${modes.join(', ')}`);
  }

  const perspectives = extractNames(data.player_perspectives).slice(0, 2);
  if (perspectives.length) {
    facts.push(`View: ${perspectives.join(', ')}`);
  }

  const themes = extractNames(data.themes).slice(0, 2);
  if (themes.length) {
    facts.push(`Theme: ${themes.join(', ')}`);
  }

  const franchises = extractNames(data.franchises).slice(0, 1);
  if (franchises.length) {
    facts.push(`Franchise: ${franchises.join(', ')}`);
  }

  return facts;
}

function extractPublisher(value: unknown): string | null {
  if (!Array.isArray(value)) {
    return null;
  }

  for (const entry of value) {
    if (!entry || typeof entry !== 'object') {
      continue;
    }

    const isPublisher = (entry as { publisher?: boolean }).publisher;
    const companyName = (entry as { company?: { name?: string } }).company?.name;
    if (isPublisher && typeof companyName === 'string') {
      return companyName;
    }
  }

  for (const entry of value) {
    if (!entry || typeof entry !== 'object') {
      continue;
    }
    const companyName = (entry as { company?: { name?: string } }).company?.name;
    if (typeof companyName === 'string') {
      return companyName;
    }
  }

  return null;
}

function resolveReleaseDate(data: Record<string, unknown>): string | null {
  if (typeof data.release_date === 'string') {
    return data.release_date;
  }

  const releaseDates = data.release_dates as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(releaseDates)) {
    for (const entry of releaseDates) {
      if (!entry || typeof entry !== 'object') {
        continue;
      }
      const timestamp = entry.date as number | undefined;
      if (typeof timestamp === 'number') {
        return new Date(timestamp * 1000).toISOString();
      }
      const year = entry.y as number | undefined;
      if (typeof year === 'number') {
        return new Date(Date.UTC(year, 0, 1)).toISOString();
      }
    }
  }

  if (typeof data.first_release_date === 'number') {
    return new Date(data.first_release_date * 1000).toISOString();
  }

  return null;
}

export default function GameMetaCard({ gameTag }: GameMetaCardProps) {
  if (!gameTag.igdbId) {
    return null;
  }

  const data = parseIgdbData(gameTag.igdbData);
  const platforms = extractNames(data?.platforms).slice(0, 2);
  const genres = extractNames(data?.genres).slice(0, 3);
  const publisher = extractPublisher(data?.involved_companies) ?? extractNames(data?.companies)[0];
  const releaseDate = data ? resolveReleaseDate(data) : null;
  const summary = clampText(extractSummary(data) || '');
  const factPills = extractFactPills(data).slice(0, 3);

  return (
    <div className="mt-4 rounded-2xl border border-yellow-400/20 bg-gradient-to-br from-gray-900/95 via-gray-900/80 to-gray-800/80 px-4 py-4 text-sm text-gray-200 shadow-[0_18px_40px_-28px_rgba(250,204,21,0.7)] backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-yellow-400/80">Game intel</p>
          <p className="text-lg font-semibold text-white">{gameTag.name}</p>
        </div>
        <Link
          href={`/game/${gameTag.slug}`}
          className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-xs font-semibold text-gray-900 shadow-lg shadow-yellow-400/30 transition-colors hover:bg-yellow-300"
        >
          View hub
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {summary && <p className="mt-3 text-sm text-gray-300">{summary}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {platforms.length > 0 && (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200">
            Platform: {platforms.join(', ')}
          </span>
        )}
        {genres.length > 0 && (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200">
            Genre: {genres.join(', ')}
          </span>
        )}
        {releaseDate && (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200">
            Release: {formatDate(releaseDate)}
          </span>
        )}
        {publisher && (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200">
            Publisher: {publisher}
          </span>
        )}
      </div>

      {factPills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
          {factPills.map((fact) => (
            <span key={fact} className="rounded-full border border-white/10 bg-gray-900/70 px-3 py-1">
              {fact}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
