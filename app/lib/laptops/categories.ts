// Category registry — one entry = one "/gaming-laptops/best/<slug>" landing page.
// Each category is just a filter + sort over the dataset, so new landing pages
// are data, not code. Keeps the programmatic pages curated (GPU tier, panel,
// form factor) rather than a cartesian blow-up.

import type { GpuTier, LaptopFamily, PanelType } from './types';
import { getAllFamilies, familyGpuTiers } from './queries';
import { startingPrice } from './format';

export interface Category {
  slug: string;
  /** SEO <title> core + page H1. */
  title: string;
  /** One-line intro shown under the H1 and used as meta description seed. */
  description: string;
  filter: (f: LaptopFamily) => boolean;
}

const byTier = (tier: GpuTier) => (f: LaptopFamily) => familyGpuTiers(f).includes(tier);
const byPanel = (panel: PanelType) => (f: LaptopFamily) => f.display?.panelType === panel;

export const CATEGORIES: Category[] = [
  // GPU tiers — every family has a GPU tier, so these are full-coverage.
  {
    slug: 'rtx-5090',
    title: 'Best RTX 5090 Gaming Laptops (2026)',
    description: 'Every 2026 laptop offered with NVIDIA’s flagship GeForce RTX 5090 — the fastest mobile GPU money can buy.',
    filter: byTier('rtx-5090'),
  },
  {
    slug: 'rtx-5080',
    title: 'Best RTX 5080 Gaming Laptops (2026)',
    description: 'RTX 5080 laptops — near-flagship 4K-capable performance, usually at a saner price than the 5090.',
    filter: byTier('rtx-5080'),
  },
  {
    slug: 'rtx-5070-ti',
    title: 'Best RTX 5070 Ti Gaming Laptops (2026)',
    description: 'RTX 5070 Ti laptops — the high-refresh 1440p sweet spot with 12 GB of GDDR7.',
    filter: byTier('rtx-5070-ti'),
  },
  {
    slug: 'rtx-5070',
    title: 'Best RTX 5070 Gaming Laptops (2026)',
    description: 'RTX 5070 laptops — strong 1440p gaming. Watch the TGP: it ranges widely between models.',
    filter: byTier('rtx-5070'),
  },
  {
    slug: 'rtx-5060',
    title: 'Best RTX 5060 Gaming Laptops (2026)',
    description: 'RTX 5060 laptops — the mainstream 1080p/1440p value tier for 2026.',
    filter: byTier('rtx-5060'),
  },
  {
    slug: 'rtx-5050',
    title: 'Best RTX 5050 Gaming Laptops (2026)',
    description: 'RTX 5050 laptops — the budget entry point. TGP limits matter a lot here, so check each model.',
    filter: byTier('rtx-5050'),
  },
  // Panels — only families with an enriched display match (grows with enrichment).
  {
    slug: 'oled',
    title: 'Best OLED Gaming Laptops (2026)',
    description: 'Gaming laptops with OLED panels — perfect blacks, fast response, vivid HDR.',
    filter: byPanel('oled'),
  },
  {
    slug: 'mini-led',
    title: 'Best Mini LED Gaming Laptops (2026)',
    description: 'Gaming laptops with Mini LED panels — extreme peak brightness and HDR without OLED burn-in risk.',
    filter: byPanel('mini-led'),
  },
  // Form factor — driven by displaySizeInches, present on every family.
  {
    slug: '18-inch',
    title: 'Best 18-Inch Gaming Laptops (2026)',
    description: 'The biggest screens in gaming — 18-inch desktop-replacement laptops with the most cooling headroom.',
    filter: (f) => (f.displaySizeInches ?? 0) >= 18,
  },
  {
    slug: '16-inch',
    title: 'Best 16-Inch Gaming Laptops (2026)',
    description: 'The 16-inch class — the most popular balance of screen size, performance and portability.',
    filter: (f) => f.displaySizeInches === 16,
  },
  {
    slug: 'lightweight',
    title: 'Best Lightweight Gaming Laptops (2026)',
    description: 'Portable 14-inch-class gaming laptops you can actually carry every day.',
    filter: (f) => (f.displaySizeInches ?? 99) <= 14,
  },
];

export function getCategory(slug: string): Category | null {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

/** Families in a category, sorted: priced ascending first, then unpriced, then by name. */
export function categoryFamilies(cat: Category): LaptopFamily[] {
  return getAllFamilies()
    .filter(cat.filter)
    .sort((a, b) => {
      const pa = startingPrice(a);
      const pb = startingPrice(b);
      if (pa != null && pb != null) return pa - pb;
      if (pa != null) return -1;
      if (pb != null) return 1;
      return a.name.localeCompare(b.name);
    });
}

export interface CategoryFacet {
  slug: string;
  title: string;
  count: number;
}

/** Non-empty categories (for index links + generateStaticParams). */
export function listCategories(): CategoryFacet[] {
  return CATEGORIES.map((c) => ({ slug: c.slug, title: c.title, count: categoryFamilies(c).length })).filter(
    (c) => c.count > 0,
  );
}
