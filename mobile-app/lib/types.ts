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
  // Cover can be a URL string or an object with image_id
  cover?: string | { id: number; image_id: string };
  cover_url?: string;
  summary?: string;
  description?: string;
  release_date?: string;
  first_release_date?: number;
  rating?: number;
  rating_count?: number;
  // Platforms can be objects or strings
  platforms?: ({ id: number; name?: string; abbreviation?: string } | string)[];
  // Genres can be objects or strings
  genres?: ({ id: number; name: string } | string)[];
  themes?: string[];
  game_modes?: ({ id: number; name: string } | string)[];
  companies?: ({ id: number; name: string } | string)[];
  involved_companies?: { company: { name: string }; developer?: boolean; publisher?: boolean }[];
  // Screenshots can be URLs or objects with image_id
  screenshots?: (string | { id: number; image_id: string })[];
  videos?: { id: number; name?: string; video_id: string }[];
  websites?: { url: string; category: string | number }[];
}

// Helper to build IGDB image URLs
export function buildIgdbImageUrl(imageId: string, size: 'cover_big' | 'screenshot_big' | '1080p' = 'cover_big'): string {
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
}

// Extract cover URL from various IGDB data formats
export function getIgdbCoverUrl(game: IGDBGame): string | undefined {
  if (game.cover_url) return game.cover_url;
  if (game.cover && typeof game.cover === 'object' && 'image_id' in game.cover) {
    return buildIgdbImageUrl(game.cover.image_id, 'cover_big');
  }
  if (game.cover && typeof game.cover === 'string') return game.cover;
  return undefined;
}

// Extract screenshot URLs
export function getIgdbScreenshots(game: IGDBGame): string[] {
  if (!game.screenshots) return [];
  return game.screenshots.map((s) => {
    if (typeof s === 'string') return s;
    if (s && typeof s === 'object' && 'image_id' in s) {
      return buildIgdbImageUrl(s.image_id, 'screenshot_big');
    }
    return '';
  }).filter(Boolean);
}

// Extract platform names
export function getIgdbPlatforms(game: IGDBGame): string {
  if (!game.platforms) return '';
  return game.platforms.map((p) => {
    if (typeof p === 'string') return p;
    return p.abbreviation || p.name || '';
  }).filter(Boolean).join(', ');
}

// Extract genre names
export function getIgdbGenres(game: IGDBGame): string {
  if (!game.genres) return '';
  return game.genres.map((g) => {
    if (typeof g === 'string') return g;
    return g.name || '';
  }).filter(Boolean).join(', ');
}

// Extract company names
export function getIgdbCompanies(game: IGDBGame): string {
  if (game.involved_companies) {
    return game.involved_companies.map((ic) => ic.company.name).join(', ');
  }
  if (!game.companies) return '';
  return game.companies.map((c) => {
    if (typeof c === 'string') return c;
    return c.name || '';
  }).filter(Boolean).join(', ');
}

// Extract game modes
export function getIgdbGameModes(game: IGDBGame): string {
  if (!game.game_modes) return '';
  return game.game_modes.map((m) => {
    if (typeof m === 'string') return m;
    return m.name || '';
  }).filter(Boolean).join(', ');
}

// Get release date string
export function getIgdbReleaseDate(game: IGDBGame): string | undefined {
  if (game.release_date) return game.release_date;
  if (game.first_release_date) {
    return new Date(game.first_release_date * 1000).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  }
  return undefined;
}

// Get description
export function getIgdbDescription(game: IGDBGame): string | undefined {
  return game.description || game.summary;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}
