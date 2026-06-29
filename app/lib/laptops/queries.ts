// Data-access layer — the ONLY seam pages read through.
//
// Every page (product, brand hub, category, finder, comparison) queries these
// functions, never the raw dataset. That indirection is the whole point: today
// it reads a committed file; tomorrow it can read the GPBot Knowledge API with
// zero page changes.

import { LAPTOPS } from './data';
import type { GpuTier, LaptopFamily, PanelType } from './types';
import { startingPrice } from './format';

/** Stable slug from a manufacturer name ("XMG / Schenker" → "xmg-schenker"). */
export function brandSlug(manufacturer: string): string {
  return manufacturer
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getAllFamilies(): LaptopFamily[] {
  return LAPTOPS;
}

export function getFamily(slug: string): LaptopFamily | null {
  return LAPTOPS.find((f) => f.slug === slug) ?? null;
}

/** Distinct GPU tiers present in a family (a family may span 5080 + 5090). */
export function familyGpuTiers(family: LaptopFamily): GpuTier[] {
  return Array.from(new Set(family.configurations.map((c) => c.gpu.tier)));
}

export function getFamiliesByGpuTier(tier: GpuTier): LaptopFamily[] {
  return LAPTOPS.filter((f) => f.configurations.some((c) => c.gpu.tier === tier));
}

export function getFamiliesByBrand(slug: string): LaptopFamily[] {
  return LAPTOPS.filter((f) => brandSlug(f.manufacturer) === slug);
}

export function getFamiliesByPanel(panel: PanelType): LaptopFamily[] {
  return LAPTOPS.filter((f) => f.display?.panelType === panel);
}

export interface BrandFacet {
  slug: string;
  name: string;
  count: number;
}

/** Brands with ≥1 model, sorted by model count desc — drives brand hubs. */
export function allBrands(): BrandFacet[] {
  const map = new Map<string, BrandFacet>();
  for (const f of LAPTOPS) {
    const slug = brandSlug(f.manufacturer);
    const existing = map.get(slug);
    if (existing) existing.count += 1;
    else map.set(slug, { slug, name: f.manufacturer, count: 1 });
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export interface GpuTierFacet {
  tier: GpuTier;
  count: number;
}

const GPU_TIER_ORDER: GpuTier[] = [
  'rtx-5090',
  'rtx-5080',
  'rtx-5070-ti',
  'rtx-5070',
  'rtx-5060',
  'rtx-5050',
  'igpu',
  'other',
];

/** GPU tiers with model counts, high→low — drives "best RTX 50xx" pages. */
export function gpuTiersWithCounts(): GpuTierFacet[] {
  const counts = new Map<GpuTier, number>();
  for (const f of LAPTOPS) {
    for (const tier of familyGpuTiers(f)) {
      counts.set(tier, (counts.get(tier) ?? 0) + 1);
    }
  }
  return GPU_TIER_ORDER.filter((t) => counts.has(t)).map((tier) => ({
    tier,
    count: counts.get(tier) ?? 0,
  }));
}

/**
 * Families worth cross-shopping against `family`: same GPU tier first, then
 * nearest by starting price. Used for the "Alternatives" block. Curated by
 * relevance, not the full catalog (avoids thin doorway-style cross-linking).
 */
export function comparableFamilies(family: LaptopFamily, limit = 4): LaptopFamily[] {
  const tiers = new Set(familyGpuTiers(family));
  const basePrice = startingPrice(family);

  const others = LAPTOPS.filter((f) => f.slug !== family.slug);
  const scored = others.map((f) => {
    const sharesTier = familyGpuTiers(f).some((t) => tiers.has(t));
    const price = startingPrice(f);
    const priceGap =
      basePrice != null && price != null ? Math.abs(price - basePrice) : Number.MAX_SAFE_INTEGER;
    // Same-tier matches rank ahead of everything else; ties broken by price gap.
    return { f, score: (sharesTier ? 0 : 1_000_000) + priceGap };
  });

  return scored
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((s) => s.f);
}
