// lib/igdb-client.ts
import { IGDBGame, IGDBResponse } from '../types/igdb';

export class IGDBClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    if (!baseUrl) {
      throw new Error('WordPress URL is required for IGDB client');
    }
    this.baseUrl = `${baseUrl}/wp-json/igdb/v1`;
  }

  private async fetchApi<T>(endpoint: string): Promise<IGDBResponse<T>> {
    try {
      console.log('Fetching:', `${this.baseUrl}${endpoint}`); // Debug log

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // Important for CORS
        cache: 'no-store', // Disable caching for debugging
      });

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        console.error('Non-JSON response:', await response.text());
        throw new Error('Invalid response format from server');
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log

      if (!response.ok) {
        const errorMessage = data.message || `API request failed with status ${response.status}`;
        console.error('API Error:', errorMessage);
        throw new Error(errorMessage);
      }

      if (!data.success) {
        const errorMessage = data.message || 'API request was not successful';
        console.error('API Success False:', errorMessage);
        throw new Error(errorMessage);
      }

      return data as IGDBResponse<T>;
    } catch (error) {
      console.error('Fetch Error:', error);
      if (error instanceof Error) {
        throw new Error(`API Request Failed: ${error.message}`);
      }
      throw new Error('Unknown error occurred during API request');
    }
  }

  async searchGames(query: string, limit = 10): Promise<IGDBResponse<IGDBGame[]>> {
    if (!query.trim()) {
      throw new Error('Search query is required');
    }
    try {
      return await this.fetchApi<IGDBGame[]>(
        `/search?s=${encodeURIComponent(query)}&limit=${limit}`
      );
    } catch (error) {
      console.error('Search Games Error:', error);
      throw error;
    }
  }

  async getGameDetails(id: number): Promise<IGDBResponse<IGDBGame>> {
    if (!id) {
      throw new Error('Game ID is required');
    }
    try {
      return await this.fetchApi<IGDBGame>(`/game/${id}`);
    } catch (error) {
      console.error('Get Game Details Error:', error);
      throw error;
    }
  }

  async getPopularGames(limit = 10): Promise<IGDBResponse<IGDBGame[]>> {
    try {
      return await this.fetchApi<IGDBGame[]>(`/popular?limit=${limit}`);
    } catch (error) {
      console.error('Get Popular Games Error:', error);
      throw error;
    }
  }
}