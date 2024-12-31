export interface IGDBPlatform {
  id: number;
  name: string;
}

export interface IGDBImage {
  id: string;
  image_id: string;
}

export interface IGDBVideo {
  id: number;
  name: string;
  video_id: string;
}

export interface IGDBWebsite {
  url: string;
  category: string;
}

export interface IGDBGameMeta {
  igdb_id: number;
  rating?: number;
  release_date?: string;
  platforms?: IGDBPlatform[];
  screenshots?: string[];
  videos?: IGDBVideo[];
  websites?: IGDBWebsite[];
}

export interface IGDBGame {
  id?: number;
  name: string;
  cover_url?: string;
  description?: string;
  release_date?: string;
  rating?: number;
  platforms?: IGDBPlatform[];
  genres?: string[];
  screenshots?: string[];
  videos?: IGDBVideo[];
  websites?: IGDBWebsite[];
  meta?: IGDBGameMeta;
}

export interface IGDBResponse<T> {
  success: boolean;
  data: T;
  code?: string;
  message?: string;
} 