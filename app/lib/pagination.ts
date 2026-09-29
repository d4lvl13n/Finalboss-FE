import { cache } from 'react';
import siteConfig from './siteConfig';

export const ARTICLE_PAGE_SIZE = 24;

type PaginatedArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
};

type PaginatedResponse = {
  articles: PaginatedArticle[];
  total: number;
};

// Uses the WP REST API rather than GraphQL: offset pagination on GraphQL
// required the WPGraphQL Offset Pagination plugin, which is no longer active
// on the backend (its removal silently emptied /articles and /articles/page/N
// — the query hard-errored and the pages fell back to []). REST paginates and
// reports totals (X-WP-Total) natively, with no plugin to disappear.
export const fetchPaginatedArticles = cache(
  async (pageNumber: number): Promise<PaginatedResponse> => {
    const url =
      `${siteConfig.wordpressUrl}/wp-json/wp/v2/posts` +
      `?per_page=${ARTICLE_PAGE_SIZE}&page=${Math.max(1, pageNumber)}` +
      `&_embed=wp:featuredmedia&_fields=id,title,slug,excerpt,_links,_embedded&status=publish`;

    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) {
      // Page beyond the last returns 400 from WP REST — treat as empty.
      return { articles: [], total: Number(res.headers.get('X-WP-Total')) || 0 };
    }

    const total = Number(res.headers.get('X-WP-Total')) || 0;
    const posts: Array<{
      id: number;
      slug: string;
      title?: { rendered?: string };
      excerpt?: { rendered?: string };
      _embedded?: { 'wp:featuredmedia'?: Array<{ source_url?: string }> };
    }> = await res.json();

    const articles: PaginatedArticle[] = posts.map((p) => {
      const sourceUrl = p._embedded?.['wp:featuredmedia']?.[0]?.source_url;
      return {
        id: String(p.id),
        title: p.title?.rendered ?? '',
        slug: p.slug,
        excerpt: p.excerpt?.rendered ?? '',
        featuredImage: sourceUrl ? { node: { sourceUrl } } : undefined,
      };
    });

    return { articles, total };
  },
);

/** Total published posts, from the REST collection headers (1 tiny request). */
export const fetchTotalPosts = cache(async (): Promise<number> => {
  const res = await fetch(
    `${siteConfig.wordpressUrl}/wp-json/wp/v2/posts?per_page=1&_fields=id&status=publish`,
    { signal: AbortSignal.timeout(10_000) },
  );
  return Number(res.headers.get('X-WP-Total')) || 0;
});
