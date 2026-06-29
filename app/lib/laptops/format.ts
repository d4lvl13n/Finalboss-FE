// Presentation helpers: prices ("as of" date), GPU/panel labels, Unknown handling.
// Pure functions, no React — safe to import anywhere.

import type { Configuration, GpuTier, LaptopFamily, PanelType } from './types';

/** Dataset compilation date — the canonical "as of" for prices and specs. */
export const DATASET_DATE = '2026-06-29';

const GPU_TIER_LABELS: Record<GpuTier, string> = {
  'rtx-5050': 'RTX 5050',
  'rtx-5060': 'RTX 5060',
  'rtx-5070': 'RTX 5070',
  'rtx-5070-ti': 'RTX 5070 Ti',
  'rtx-5080': 'RTX 5080',
  'rtx-5090': 'RTX 5090',
  igpu: 'Integrated GPU',
  other: 'Other GPU',
};

const PANEL_LABELS: Record<PanelType, string> = {
  oled: 'OLED',
  'mini-led': 'Mini LED',
  ips: 'IPS',
  'igpu-shared': 'Shared',
  other: 'Other',
};

export function gpuTierLabel(tier: GpuTier): string {
  return GPU_TIER_LABELS[tier] ?? 'GPU';
}

export function panelLabel(panel: PanelType): string {
  return PANEL_LABELS[panel] ?? 'Display';
}

/** "$2,499" — no decimals (laptop prices). */
export function formatPrice(usd: number): string {
  return `$${Math.round(usd).toLocaleString('en-US')}`;
}

/** "29 Jun 2026" from an ISO date. */
export function formatVerifiedDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[m - 1]} ${y}`;
}

/**
 * The price string shown next to a buy CTA, with the freshness qualifier.
 * Returns null when no price is known (caller renders "Check price on Amazon").
 */
export function priceAsOf(config: Configuration, asOf: string = DATASET_DATE): string | null {
  if (config.priceUsd == null) return null;
  const prefix = config.priceNote ? `${config.priceNote} ` : '';
  return `${prefix}${formatPrice(config.priceUsd)} (as of ${formatVerifiedDate(asOf)})`;
}

/** Lowest known config price in a family, or null if none are priced yet. */
export function startingPrice(family: LaptopFamily): number | null {
  const prices = family.configurations
    .map((c) => c.priceUsd)
    .filter((p): p is number => typeof p === 'number');
  return prices.length ? Math.min(...prices) : null;
}

/** "from $1,999" / "Price unavailable" — for cards and listings. */
export function startingPriceLabel(family: LaptopFamily): string {
  const p = startingPrice(family);
  return p == null ? 'Price unavailable' : `from ${formatPrice(p)}`;
}
