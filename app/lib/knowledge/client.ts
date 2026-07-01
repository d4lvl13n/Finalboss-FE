// Server-side client for the GPBot Knowledge API.
//
// IMPORTANT: server-only. The KNOWLEDGE_API_KEY must never reach the browser —
// this module is imported only from Server Components / route handlers. It is
// completely independent of the existing IGDB client (app/lib/igdb-client.ts).

import type { Envelope, GamePagePayload, SitemapEntry } from './types';

const BASE_URL = (process.env.KNOWLEDGE_API_URL || 'http://localhost:5003').replace(/\/+$/, '');
const API_KEY = process.env.KNOWLEDGE_API_KEY || '';
const VERTICAL = 'gaming';
const DEFAULT_REVALIDATE = 3600;

interface FetchOpts {
  tags?: string[];
  revalidate?: number;
}

async function kfetch<T>(path: string, opts: FetchOpts = {}): Promise<T | null> {
  if (!API_KEY) {
    // Fail soft in dev/preview without the key: the surface simply renders empty.
    console.warn('[knowledge] KNOWLEDGE_API_KEY is not set — skipping', path);
    return null;
  }
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'X-Api-Key': API_KEY, Accept: 'application/json' },
      next: { revalidate: opts.revalidate ?? DEFAULT_REVALIDATE, tags: opts.tags },
    });
  } catch (err) {
    console.error('[knowledge] fetch failed', path, err);
    return null;
  }
  if (res.status === 404) return null;
  if (!res.ok) {
    console.error('[knowledge]', path, '->', res.status);
    return null;
  }
  return (await res.json()) as T;
}

/** Full aggregate payload for one game page (single request, no fan-out). */
export async function getGamePage(slug: string): Promise<GamePagePayload | null> {
  const body = await kfetch<Envelope<GamePagePayload>>(
    `/v1/${VERTICAL}/entities/game/${encodeURIComponent(slug)}/page`,
    { tags: [`game:${slug}`, 'games'] },
  );
  return body?.data ?? null;
}

/** Indexable game slugs for the dedicated /games/sitemap.xml. */
export async function getGamesSitemap(): Promise<SitemapEntry[]> {
  const body = await kfetch<Envelope<SitemapEntry[]>>(
    `/v1/${VERTICAL}/sitemap?entity_type=game`,
    { tags: ['games-sitemap'] },
  );
  return body?.data ?? [];
}

/** Build a cover/screenshot URL from an IGDB image id (covers already allowed in next.config). */
export function igdbImage(imageId?: string | null, size: string = 't_cover_big'): string | null {
  if (!imageId) return null;
  return `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.jpg`;
}
