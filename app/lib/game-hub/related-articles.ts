// Fetch the hub's "Read next" articles as rich cards so the section renders
// through the site's own ResponsiveArticleGrid (native ArticleCard look),
// instead of a plain link list. Server-only. Fails soft to a minimal card.

import type { ReadNext } from './types';

const WP = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://backend.finalboss.io').replace(/\/+$/, '');

export interface HubArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date?: string;
  featuredImage?: { node: { sourceUrl: string } };
  categories?: { nodes?: { name: string; slug?: string }[] };
  author?: { node?: { name?: string; avatar?: { url?: string } } };
}

function slugFromUrl(url: string): string {
  return url.replace(/^https?:\/\/[^/]+\//, '').replace(/\/+$/, '');
}

function fallback(a: ReadNext, slug: string): HubArticle {
  return { id: slug, title: a.title, slug };
}

function mapPost(p: Record<string, unknown>, a: ReadNext): HubArticle {
  const slug = String(p.slug || slugFromUrl(a.url));
  const embedded = (p._embedded || {}) as Record<string, unknown>;
  const media = (embedded['wp:featuredmedia'] as Array<{ source_url?: string }> | undefined)?.[0];
  const terms = (embedded['wp:term'] as Array<Array<{ name?: string; slug?: string; taxonomy?: string }>> | undefined) || [];
  const cats = (terms.flat() || []).filter((t) => t?.taxonomy === 'category' && t?.name);
  const author = (embedded.author as Array<{ name?: string; avatar_urls?: Record<string, string> }> | undefined)?.[0];
  const title = (p.title as { rendered?: string })?.rendered || a.title;
  const excerpt = (p.excerpt as { rendered?: string })?.rendered;
  return {
    id: String(p.id ?? slug),
    title,
    slug,
    excerpt,
    date: typeof p.date === 'string' ? p.date : undefined,
    ...(media?.source_url ? { featuredImage: { node: { sourceUrl: media.source_url } } } : {}),
    ...(cats.length ? { categories: { nodes: cats.map((c) => ({ name: c.name as string, slug: c.slug })) } } : {}),
    ...(author?.name ? { author: { node: { name: author.name, avatar: { url: author.avatar_urls?.['96'] } } } } : {}),
  };
}

export async function fetchReadNextArticles(articles: ReadNext[]): Promise<HubArticle[]> {
  const out = await Promise.all(
    articles.map(async (a) => {
      const slug = slugFromUrl(a.url);
      try {
        const res = await fetch(`${WP}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`, {
          next: { revalidate: 3600 },
        });
        if (!res.ok) return fallback(a, slug);
        const arr = (await res.json()) as Array<Record<string, unknown>>;
        return arr[0] ? mapPost(arr[0], a) : fallback(a, slug);
      } catch {
        return fallback(a, slug);
      }
    }),
  );
  return out;
}
