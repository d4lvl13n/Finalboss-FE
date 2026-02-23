/**
 * Server-side IGDB API client.
 *
 * Authenticates via Twitch OAuth2 client-credentials flow, caches the token
 * in-memory, and talks directly to the IGDB v4 API.  Replaces the WordPress
 * igdb-wordpress-integration proxy so that game data no longer depends on a
 * WordPress plugin.
 *
 * Required env vars (server-side only — NOT prefixed with NEXT_PUBLIC_):
 *   TWITCH_CLIENT_ID
 *   TWITCH_CLIENT_SECRET
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TwitchTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface IGDBRawImage {
  image_id: string;
}

interface IGDBRawVideo {
  id: number;
  name: string;
  video_id: string;
}

interface IGDBRawWebsite {
  url: string;
  category: number | string;
}

interface IGDBRawNamedEntry {
  name: string;
}

interface IGDBRawCompanyEntry {
  company?: { name?: string };
  developer?: boolean;
  publisher?: boolean;
}

interface IGDBRawReleaseDate {
  date?: number;
  y?: number;
}

interface IGDBRawGame {
  id: number;
  name: string;
  cover?: IGDBRawImage;
  summary?: string;
  first_release_date?: number;
  rating?: number;
  rating_count?: number;
  aggregated_rating?: number;
  aggregated_rating_count?: number;
  platforms?: Array<{ id: number; name: string }>;
  genres?: IGDBRawNamedEntry[];
  screenshots?: IGDBRawImage[];
  videos?: IGDBRawVideo[];
  websites?: IGDBRawWebsite[];
  themes?: IGDBRawNamedEntry[];
  game_modes?: IGDBRawNamedEntry[];
  player_perspectives?: IGDBRawNamedEntry[];
  franchises?: IGDBRawNamedEntry[];
  collections?: IGDBRawNamedEntry[];
  involved_companies?: IGDBRawCompanyEntry[];
  release_dates?: IGDBRawReleaseDate[];
}

import { IGDBGame } from '../types/igdb';

// ---------------------------------------------------------------------------
// Token management
// ---------------------------------------------------------------------------

let cachedToken: string | null = null;
let tokenExpiresAt = 0; // epoch ms

async function getAccessToken(): Promise<string> {
  const now = Date.now();

  // Return cached token if still valid (with 60 s margin)
  if (cachedToken && tokenExpiresAt - now > 60_000) {
    return cachedToken;
  }

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      '[igdb-server] Missing TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET env vars.'
    );
  }

  const res = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[igdb-server] Twitch token request failed (${res.status}): ${text}`);
  }

  const json: TwitchTokenResponse = await res.json();
  cachedToken = json.access_token;
  tokenExpiresAt = now + json.expires_in * 1000;

  return cachedToken;
}

// ---------------------------------------------------------------------------
// Low-level IGDB API helper
// ---------------------------------------------------------------------------

async function igdbFetch<T>(endpoint: string, body: string): Promise<T> {
  const token = await getAccessToken();
  const clientId = process.env.TWITCH_CLIENT_ID!;

  const res = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
    method: 'POST',
    headers: {
      'Client-ID': clientId,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body,
    next: { revalidate: 3600 }, // 1-hour ISR cache
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[igdb-server] IGDB API error (${res.status}): ${text}`);
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Image URL helper
// ---------------------------------------------------------------------------

function igdbImageUrl(imageId: string, size: string): string {
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
}

// ---------------------------------------------------------------------------
// Transform raw IGDB response → IGDBGame
// ---------------------------------------------------------------------------

function transformGame(raw: IGDBRawGame): IGDBGame {
  // Rating: prefer user rating, fall back to aggregated
  const rating = raw.rating ?? raw.aggregated_rating;
  const ratingCount =
    raw.rating_count ?? raw.aggregated_rating_count;

  // Release date: prefer first_release_date, fall back to release_dates array
  let releaseDate: string | undefined;
  if (raw.first_release_date) {
    releaseDate = new Date(raw.first_release_date * 1000).toISOString();
  } else if (raw.release_dates?.length) {
    const earliest = raw.release_dates.reduce<number | null>((min, rd) => {
      const ts = rd.date ?? (rd.y ? Date.UTC(rd.y, 0, 1) / 1000 : null);
      if (ts === null) return min;
      return min === null || ts < min ? ts : min;
    }, null);
    if (earliest !== null) {
      releaseDate = new Date(earliest * 1000).toISOString();
    }
  }

  return {
    id: raw.id,
    name: raw.name,
    cover_url: raw.cover?.image_id
      ? igdbImageUrl(raw.cover.image_id, 'cover_big')
      : undefined,
    description: raw.summary,
    release_date: releaseDate,
    rating,
    rating_count: ratingCount,
    platforms: raw.platforms?.map((p) => ({ id: p.id, name: p.name })),
    genres: raw.genres?.map((g) => g.name),
    themes: raw.themes?.map((t) => t.name),
    game_modes: raw.game_modes?.map((m) => m.name),
    player_perspectives: raw.player_perspectives?.map((p) => p.name),
    franchises: raw.franchises?.map((f) => f.name),
    collections: raw.collections?.map((c) => c.name),
    companies: raw.involved_companies
      ?.map((e) => e.company?.name)
      .filter((n): n is string => Boolean(n)),
    screenshots: raw.screenshots?.map((s) =>
      igdbImageUrl(s.image_id, 'screenshot_big')
    ),
    videos: raw.videos?.map((v) => ({
      id: v.id,
      name: v.name,
      video_id: v.video_id,
    })),
    websites: raw.websites?.map((w) => ({
      url: w.url,
      category: String(w.category),
    })),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const SEARCH_FIELDS = [
  'name',
  'cover.image_id',
  'summary',
  'first_release_date',
  'rating',
  'platforms.name',
  'platforms.id',
  'genres.name',
  'screenshots.image_id',
  'videos.*',
  'websites.*',
  'themes.name',
  'game_modes.name',
  'player_perspectives.name',
  'franchises.name',
  'collections.name',
  'involved_companies.company.name',
  'involved_companies.developer',
  'involved_companies.publisher',
].join(',');

const DETAIL_FIELDS = [
  SEARCH_FIELDS,
  'rating_count',
  'aggregated_rating',
  'aggregated_rating_count',
  'release_dates.*',
].join(',');

export async function searchGames(
  query: string,
  limit = 10
): Promise<IGDBGame[]> {
  const body = `search "${query.replace(/"/g, '\\"')}"; fields ${SEARCH_FIELDS}; limit ${limit};`;
  const raw = await igdbFetch<IGDBRawGame[]>('games', body);
  return raw.map(transformGame);
}

export async function getGameDetails(id: number): Promise<IGDBGame> {
  const body = `fields ${DETAIL_FIELDS}; where id = ${id};`;
  const raw = await igdbFetch<IGDBRawGame[]>('games', body);

  if (!raw.length) {
    throw new Error(`[igdb-server] Game not found: ${id}`);
  }

  return transformGame(raw[0]);
}

export async function getPopularGames(limit = 10): Promise<IGDBGame[]> {
  const body = `fields ${SEARCH_FIELDS}; sort rating desc; where rating_count > 100; limit ${limit};`;
  const raw = await igdbFetch<IGDBRawGame[]>('games', body);
  return raw.map(transformGame);
}
