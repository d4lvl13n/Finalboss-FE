// Dedicated sitemap for the Knowledge-powered game intelligence pages.
// Serves /games/sitemap.xml — only `public_index` entities come back from the API.
// Kept separate from the root app/sitemap.ts (WordPress content) on purpose.

import { MetadataRoute } from 'next';
import siteConfig from '@/app/lib/siteConfig';
import { getGamesSitemap } from '@/app/lib/knowledge/client';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/+$/, ''); // tolerate a trailing slash in NEXT_PUBLIC_BASE_URL
  const entries = await getGamesSitemap();
  return entries.map((e) => ({
    url: `${base}/games/${e.slug}`,
    lastModified: e.lastBuiltAt ? new Date(e.lastBuiltAt) : undefined,
    changeFrequency: 'daily',
    priority: 0.7,
  }));
}
