// Sitemap for the structured game hubs (local blueprint games) that live under
// the canonical /game/[slug] surface, plus their gameplay sub-entity pages.
// Served at /game/sitemap.xml.

import { MetadataRoute } from 'next';
import siteConfig from '@/app/lib/siteConfig';
import { localGameSlugs, localEntityParams } from '@/app/lib/game-hub/provider';

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/+$/, '');
  const hubs: MetadataRoute.Sitemap = localGameSlugs().map((slug) => ({
    url: `${base}/game/${slug}`,
    changeFrequency: 'daily',
    priority: 0.8,
  }));
  const entities: MetadataRoute.Sitemap = localEntityParams().map((p) => ({
    url: `${base}/game/${p.slug}/${p.type}/${p.entity}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));
  return [...hubs, ...entities];
}
