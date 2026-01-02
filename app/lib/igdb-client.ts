// lib/igdb-client.ts
import { IGDBGame, IGDBResponse } from '../types/igdb';

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
  category: string;
}

interface IGDBRawNamedEntry {
  name: string;
}

interface IGDBRawCompanyEntry {
  company?: {
    name?: string;
  };
  developer?: boolean;
  publisher?: boolean;
}

interface IGDBRawGame {
  id: number;
  name: string;
  cover?: IGDBRawImage;
  summary?: string;
  first_release_date?: number;
  rating?: number;
  platforms?: Array<{ id: number; name: string }>;
  genres?: Array<{ name: string }>;
  screenshots?: IGDBRawImage[];
  videos?: IGDBRawVideo[];
  websites?: IGDBRawWebsite[];
  themes?: IGDBRawNamedEntry[];
  game_modes?: IGDBRawNamedEntry[];
  player_perspectives?: IGDBRawNamedEntry[];
  franchises?: IGDBRawNamedEntry[];
  collections?: IGDBRawNamedEntry[];
  involved_companies?: IGDBRawCompanyEntry[];
}

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

  private transformGameData(game: IGDBRawGame): IGDBGame {
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
      platforms: game.platforms?.map((p) => ({
        id: p.id,
        name: p.name
      })),
      genres: game.genres?.map((g) => g.name),
      themes: game.themes?.map((t) => t.name),
      game_modes: game.game_modes?.map((mode) => mode.name),
      player_perspectives: game.player_perspectives?.map((perspective) => perspective.name),
      franchises: game.franchises?.map((franchise) => franchise.name),
      collections: game.collections?.map((collection) => collection.name),
      companies: game.involved_companies
        ?.map((entry) => entry.company?.name)
        .filter((name): name is string => Boolean(name)),
      screenshots: game.screenshots?.map((s) => 
        this.getImageUrl(s.image_id, 'screenshot_big')
      ),
      videos: game.videos?.map((v) => ({
        id: v.id,
        name: v.name,
        video_id: v.video_id
      })),
      websites: game.websites?.map((w) => ({
        url: w.url,
        category: w.category
      }))
    };
  }

  async searchGames(query: string, limit = 10): Promise<IGDBResponse<IGDBGame[]>> {
    const response = await this.fetchApi<IGDBRawGame[]>(`/search?s=${encodeURIComponent(query)}&limit=${limit}`);
    return {
      success: response.success,
      data: response.data.map(game => this.transformGameData(game))
    };
  }

  async getGameDetails(id: number): Promise<IGDBResponse<IGDBGame>> {
    const response = await this.fetchApi<IGDBRawGame>(`/game/${id}`);
    return {
      success: response.success,
      data: this.transformGameData(response.data)
    };
  }

  async getPopularGames(limit = 10): Promise<IGDBResponse<IGDBGame[]>> {
    return this.fetchApi<IGDBGame[]>(`/popular?limit=${limit}`);
  }
}
