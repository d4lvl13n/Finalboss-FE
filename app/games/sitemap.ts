// Dedicated sitemap for /games. Merges two sources behind one file:
//   • Knowledge-API intelligence pages (public_index entities)
//   • local blueprint hubs + their gameplay sub-entity pages (classes, …)
// Kept separate from the root app/sitemap.ts (WordPress content) on purpose.

import { MetadataRoute } from 'next';
import siteConfig from '@/app/lib/siteConfig';
import { getGamesSitemap } from '@/app/lib/knowledge/client';
import { localGameSlugs, localEntityParams } from '@/app/lib/game-hub/provider';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/+$/, ''); // tolerate a trailing slash in NEXT_PUBLIC_BASE_URL

  const apiEntries: MetadataRoute.Sitemap = (await getGamesSitemap()).map((e) => ({
    url: `${base}/games/${e.slug}`,
    lastModified: e.lastBuiltAt ? new Date(e.lastBuiltAt) : undefined,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  const localSet = new Set(localGameSlugs());
  const localHubs: MetadataRoute.Sitemap = localGameSlugs().map((slug) => ({
    url: `${base}/games/${slug}`,
    changeFrequency: 'daily',
    priority: 0.8,
  }));
  const localEntities: MetadataRoute.Sitemap = localEntityParams().map((p) => ({
    url: `${base}/games/${p.slug}/${p.type}/${p.entity}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // A local game is authoritative; drop any api entry that collides with a local slug.
  const apiDeduped = apiEntries.filter((e) => !localHubs.some((h) => h.url === e.url) && !collidesLocal(e.url, base, localSet));

  return [...localHubs, ...localEntities, ...apiDeduped];
}

function collidesLocal(url: string, base: string, localSet: Set<string>): boolean {
  const slug = url.replace(`${base}/games/`, '');
  return localSet.has(slug);
}
