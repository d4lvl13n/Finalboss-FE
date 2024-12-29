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

  private getImageUrl(imageId: string, size: string): string {
    return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
  }

  private transformGameData(game: any): IGDBGame {
    return {
      id: game.id,
      name: game.name,
      cover_url: game.cover?.image_id 
        ? this.getImageUrl(game.cover.image_id, 'cover_big')
        : undefined,
      description: game.summary,
      release_date: game.first_release_date 
        ? new Date(game.first_release_date * 1000).toISOString()
        : undefined,
      rating: game.rating,
      platforms: game.platforms?.map((p: any) => ({
        id: p.id,
        name: p.name
      })),
      genres: game.genres?.map((g: any) => g.name),
      screenshots: game.screenshots?.map((s: any) => 
        this.getImageUrl(s.image_id, 'screenshot_big')
      ),
      videos: game.videos?.map((v: any) => ({
        id: v.id,
        name: v.name,
        video_id: v.video_id
      })),
      websites: game.websites?.map((w: any) => ({
        url: w.url,
        category: w.category
      }))
    };
  }

  async searchGames(query: string, limit = 10): Promise<IGDBResponse<IGDBGame[]>> {
    const response = await this.fetchApi<any[]>(`/search?s=${encodeURIComponent(query)}&limit=${limit}`);
    return {
      success: response.success,
      data: response.data.map(game => this.transformGameData(game))
    };
  }

  async getGameDetails(id: number): Promise<IGDBResponse<IGDBGame>> {
    const response = await this.fetchApi<any>(`/game/${id}`);
    return {
      success: response.success,
      data: this.transformGameData(response.data)
    };
  }

  async getPopularGames(limit = 10): Promise<IGDBResponse<IGDBGame[]>> {
    return this.fetchApi<IGDBGame[]>(`/popular?limit=${limit}`);
  }
}