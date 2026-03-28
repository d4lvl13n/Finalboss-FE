export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  modified?: string;
  content?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
  categories?: {
    nodes: { name: string; slug: string }[];
  };
  author?: {
    node: {
      id?: string;
      name: string;
      slug?: string;
      description?: string;
      avatar?: { url: string };
    };
  };
}

export interface GameTag {
  databaseId?: number;
  name: string;
  slug: string;
  description?: string;
  igdbId?: string;
  igdbData?: string;
  posts?: {
    nodes: Post[];
    pageInfo: PageInfo;
  };
}

export interface IGDBGame {
  id?: number;
  name: string;
  cover_url?: string;
  description?: string;
  release_date?: string;
  rating?: number;
  rating_count?: number;
  platforms?: { id: number; name: string }[];
  genres?: string[];
  themes?: string[];
  game_modes?: string[];
  companies?: string[];
  screenshots?: string[];
  videos?: { id: number; name: string; video_id: string }[];
  websites?: { url: string; category: string }[];
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}
