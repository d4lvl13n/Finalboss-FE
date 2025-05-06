/**
 * Common types for search functionality
 */

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
  categories?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
}

export interface SearchResponse {
  posts: {
    nodes: SearchResult[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
} 