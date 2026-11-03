// Sitemap for the structured game hubs (local blueprint games) that live under
// the canonical /game/[slug] surface, plus their gameplay sub-entity pages.
// Served at /game/sitemap.xml.

import { MetadataRoute } from 'next';
import siteConfig from '@/app/lib/siteConfig';
import { localGameSlugs, localEntityParams } from '@/app/lib/game-hub/provider';
import { TOTK_BUILDS, TOTK_UPDATED_AT } from '@/app/lib/totk-builds/catalogue';
import { buildPath } from '@/app/lib/totk-builds/types';
import { TOTK_COLLECTIONS, cataloguePath, paginatedCollectionParams } from '@/app/lib/totk-builds/collections';
import { TOTK_RECIPES, recipePageParams } from '@/app/lib/totk-recipes/catalogue';
import { EFFECTS, recipePath, recipesPath, simulatorPath } from '@/app/lib/totk-recipes/types';

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
  const builds: MetadataRoute.Sitemap = [
    ...TOTK_COLLECTIONS.flatMap((collection) => [
      { url: `${base}${cataloguePath(collection.id)}`, lastModified: TOTK_UPDATED_AT, changeFrequency: 'weekly' as const, priority: 0.8 },
      ...paginatedCollectionParams(TOTK_BUILDS, collection.id).map((page) => ({
        url: `${base}${cataloguePath(collection.id, Number(page))}`, lastModified: TOTK_UPDATED_AT, changeFrequency: 'weekly' as const, priority: 0.5,
      })),
    ]),
    ...TOTK_BUILDS.map((build) => ({
      url: `${base}${buildPath(build)}`,
      lastModified: TOTK_UPDATED_AT,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];
  const recipes: MetadataRoute.Sitemap = [
    ...['all', ...EFFECTS.map(e => e.slug)].flatMap(effect => [
      { url: `${base}${recipesPath(effect)}`, lastModified: '2026-11-03', changeFrequency: 'monthly' as const, priority: 0.7 },
      ...recipePageParams(effect).map(page => ({ url: `${base}${recipesPath(effect, Number(page))}`, lastModified: '2026-11-03', changeFrequency: 'monthly' as const, priority: 0.5 })),
    ]),
    { url: `${base}${simulatorPath()}`, lastModified: '2026-11-03', changeFrequency: 'monthly' as const, priority: 0.7 },
    ...TOTK_RECIPES.map(recipe => ({ url: `${base}${recipePath(recipe)}`, lastModified: '2026-11-03', changeFrequency: 'monthly' as const, priority: 0.5 })),
  ];
  return [...hubs, ...entities, ...builds, ...recipes];
}
