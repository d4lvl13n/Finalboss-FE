export interface IGDBPlatform {
  id: number;
  name: string;
}

export interface IGDBImage {
  id: string;
  image_id: string;
}

export interface IGDBGame {
  id?: number;
  name: string;
  cover_url?: string;
  description?: string;
  release_date?: string;
  rating?: number;
  platforms?: Array<{ id: number; name: string }>;
  genres?: string[];
  screenshots?: string[];
  videos?: Array<{ id: number; name: string; video_id: string }>;
  websites?: Array<{ url: string; category: string }>;
  meta?: {
    igdb_id: number;
    rating?: number;
    release_date?: string;
    platforms?: Array<{ id: number; name: string }>;
    screenshots?: string[];
    videos?: Array<{ id: number; name: string; video_id: string }>;
    websites?: Array<{ url: string; category: string }>;
  };
}

export interface IGDBResponse<T> {
  success: boolean;
  data: T;
  code?: string;
  message?: string;
} 