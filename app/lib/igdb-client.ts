// lib/igdb-client.ts
import { IGDBGame, IGDBResponse } from '../types/igdb';

export class IGDBClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    if (!baseUrl) {
      this.baseUrl = 'https://backend.finalboss.io';
    } else {
      this.baseUrl = baseUrl;
    }
  }

  private async fetchApi<T>(endpoint: string): Promise<IGDBResponse<T>> {
    try {
      const url = `${this.baseUrl}/wp-json/igdb/v1${endpoint}`;
      console.log('Fetching:', url);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }

      return data as IGDBResponse<T>;
    } catch (error) {
      console.error('Fetch Error:', error);
      throw error;
    }
  }

  async searchGames(query: string, limit = 10): Promise<IGDBResponse<IGDBGame[]>> {
    return this.fetchApi<IGDBGame[]>(`/search?s=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async getGameDetails(id: number): Promise<IGDBResponse<IGDBGame>> {
    return this.fetchApi<IGDBGame>(`/game/${id}`);
  }

  async getPopularGames(limit = 10): Promise<IGDBResponse<IGDBGame[]>> {
    return this.fetchApi<IGDBGame[]>(`/popular?limit=${limit}`);
  }
}