// Dedicated sitemap for the gaming-laptops section. Serves
// /gaming-laptops/sitemap.xml — the index, every product (family) page, every
// brand hub and every category landing page. Driven entirely by the dataset,
// so new families/brands/categories appear automatically. Referenced from
// app/robots.ts. Kept separate from the root and /games sitemaps on purpose.

import { MetadataRoute } from 'next';
import siteConfig from '@/app/lib/siteConfig';
import { getAllFamilies, allBrands } from '@/app/lib/laptops/queries';
import { listCategories } from '@/app/lib/laptops/categories';

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/+$/, ''); // tolerate a trailing slash

  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/gaming-laptops`, changeFrequency: 'daily', priority: 0.8 },
  ];

  for (const f of getAllFamilies()) {
    entries.push({
      url: `${base}/gaming-laptops/${f.slug}`,
      lastModified: new Date(f.lastVerified),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  for (const b of allBrands()) {
    entries.push({
      url: `${base}/gaming-laptops/brands/${b.slug}`,
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  for (const c of listCategories()) {
    entries.push({
      url: `${base}/gaming-laptops/best/${c.slug}`,
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  return entries;
}
