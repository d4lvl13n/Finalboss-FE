export interface IGDBPlatform {
  id: number;
  name: string;
}

export interface IGDBImage {
  id: string;
  image_id: string;
}

export interface IGDBGame {
  id: number;
  name: string;
  cover_url?: string;
  release_date?: string;
  rating?: number;
  platforms?: IGDBPlatform[];
  genres?: string[];
  description?: string;
  screenshots?: string[];
  videos?: {
    id: string;
    name: string;
    video_id: string;
  }[];
  websites?: {
    url: string;
    category: string;
  }[];
  dlcs?: {
    id: number;
    name: string;
  }[];
}

export interface IGDBResponse<T> {
  success: boolean;
  data: T;
  code?: string;
  message?: string;
} 