// Dedicated sitemap for the handhelds section. Serves /handhelds/sitemap.xml —
// index, every product, brand hub, category/collection and the methodology page.
// Referenced from app/robots.ts.

import { MetadataRoute } from 'next';
import siteConfig from '@/app/lib/siteConfig';
import { getAllHandhelds, allBrands } from '@/app/lib/handhelds/queries';
import { listCategories } from '@/app/lib/handhelds/categories';
import { getAllComparisons } from '@/app/lib/handhelds/comparisons';
import { GLOSSARY } from '@/app/lib/handhelds/glossary';
import { getAllGuides } from '@/app/lib/handhelds/guides';

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/+$/, '');

  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/handhelds`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/handhelds/compare`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/handhelds/guides`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/handhelds/glossary`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/handhelds/methodology`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  for (const h of getAllHandhelds()) {
    entries.push({
      url: `${base}/handhelds/${h.slug}`,
      lastModified: new Date(h.lastVerified),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }
  for (const b of allBrands()) {
    entries.push({ url: `${base}/handhelds/brands/${b.slug}`, changeFrequency: 'weekly', priority: 0.6 });
  }
  for (const c of listCategories()) {
    entries.push({ url: `${base}/handhelds/best/${c.slug}`, changeFrequency: 'weekly', priority: 0.6 });
  }
  for (const cmp of getAllComparisons()) {
    entries.push({ url: `${base}/handhelds/compare/${cmp.slug}`, changeFrequency: 'weekly', priority: 0.6 });
  }
  for (const g of getAllGuides()) {
    entries.push({
      url: `${base}/handhelds/guides/${g.slug}`,
      lastModified: g.updated ? new Date(g.updated) : undefined,
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }
  for (const t of GLOSSARY) {
    entries.push({ url: `${base}/handhelds/glossary/${t.slug}`, changeFrequency: 'monthly', priority: 0.4 });
  }

  return entries;
}
