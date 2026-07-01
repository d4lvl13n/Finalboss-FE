// Data-access layer — the only seam pages read through.

import { HANDHELDS } from './data';
import type { Handheld, OS, PanelType } from './types';
import { startingPrice } from './format';

export function brandSlug(manufacturer: string): string {
  return manufacturer
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getAllHandhelds(): Handheld[] {
  return HANDHELDS;
}

export function getHandheld(slug: string): Handheld | null {
  return HANDHELDS.find((h) => h.slug === slug) ?? null;
}

export function getByBrand(slug: string): Handheld[] {
  return HANDHELDS.filter((h) => brandSlug(h.manufacturer) === slug);
}

export function getByOs(os: OS): Handheld[] {
  return HANDHELDS.filter((h) => h.os === os);
}

export function getByPanel(panel: PanelType): Handheld[] {
  return HANDHELDS.filter((h) => h.display?.panelType === panel);
}

export interface BrandFacet {
  slug: string;
  name: string;
  count: number;
}

export function allBrands(): BrandFacet[] {
  const map = new Map<string, BrandFacet>();
  for (const h of HANDHELDS) {
    const slug = brandSlug(h.manufacturer);
    const existing = map.get(slug);
    if (existing) existing.count += 1;
    else map.set(slug, { slug, name: h.manufacturer, count: 1 });
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/**
 * Handhelds worth cross-shopping against `h`: same OS first, then nearest by
 * starting price. Drives the product-page "Alternatives" block.
 */
export function comparableHandhelds(h: Handheld, limit = 4): Handheld[] {
  const basePrice = startingPrice(h);
  const others = HANDHELDS.filter((x) => x.slug !== h.slug);
  return others
    .map((x) => {
      const sameOs = x.os === h.os;
      const price = startingPrice(x);
      const gap = basePrice != null && price != null ? Math.abs(price - basePrice) : Number.MAX_SAFE_INTEGER;
      return { x, score: (sameOs ? 0 : 1_000_000) + gap };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((s) => s.x);
}
