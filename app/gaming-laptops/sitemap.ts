// Dedicated sitemap for the gaming-laptops section. Serves
// /gaming-laptops/sitemap.xml — the index, every product (family) page, every
// brand hub, every category/collection, every glossary term, the buying guides
// and the methodology page. Driven entirely by the dataset + registries, so new
// entries appear automatically. Referenced from app/robots.ts.

import { MetadataRoute } from 'next';
import siteConfig from '@/app/lib/siteConfig';
import { getAllFamilies, allBrands } from '@/app/lib/laptops/queries';
import { listCategories } from '@/app/lib/laptops/categories';
import { GLOSSARY } from '@/app/lib/laptops/glossary';
import { getAllGuides } from '@/app/lib/laptops/guides';

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/+$/, ''); // tolerate a trailing slash

  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/gaming-laptops`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/gaming-laptops/guides`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/gaming-laptops/glossary`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/gaming-laptops/methodology`, changeFrequency: 'yearly', priority: 0.3 },
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

  for (const g of getAllGuides()) {
    entries.push({
      url: `${base}/gaming-laptops/guides/${g.slug}`,
      lastModified: g.updated ? new Date(g.updated) : undefined,
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  for (const t of GLOSSARY) {
    entries.push({
      url: `${base}/gaming-laptops/glossary/${t.slug}`,
      changeFrequency: 'monthly',
      priority: 0.4,
    });
  }

  return entries;
}
