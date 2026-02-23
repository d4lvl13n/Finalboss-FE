/**
 * Client-side IGDB helper.
 *
 * Calls our own Next.js API routes (/api/igdb/*) which in turn talk directly
 * to the IGDB API via igdb-server.ts.  The API routes return pre-transformed
 * IGDBGame objects, so no client-side transformation is needed.
 *
 * This module is safe to import in 'use client' components.
 */

import { IGDBGame, IGDBResponse } from '../types/igdb';

export class IGDBClient {
  private baseUrl: string;

  constructor() {
    // Client-side uses relative URL; server-side (SSR) needs absolute.
    const isServer = typeof window === 'undefined';
    if (isServer) {
      const base =
        process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : 'https://finalboss.io');
      this.baseUrl = `${base}/api/igdb`;
    } else {
      this.baseUrl = '/api/igdb';
    }
  }

  private async fetchApi<T>(path: string): Promise<IGDBResponse<T>> {
    const url = `${this.baseUrl}${path}`;

    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`IGDB API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'API request failed');
    }

    return data as IGDBResponse<T>;
  }

  async searchGames(
    query: string,
    limit = 10
  ): Promise<IGDBResponse<IGDBGame[]>> {
    return this.fetchApi<IGDBGame[]>(
      `/search?s=${encodeURIComponent(query)}&limit=${limit}`
    );
  }

  async getGameDetails(id: number): Promise<IGDBResponse<IGDBGame>> {
    return this.fetchApi<IGDBGame>(`/game/${id}`);
  }

  async getPopularGames(limit = 10): Promise<IGDBResponse<IGDBGame[]>> {
    return this.fetchApi<IGDBGame[]>(`/popular?limit=${limit}`);
  }
}
