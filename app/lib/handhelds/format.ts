// Presentation helpers for handhelds: OS/panel labels, price "as of" date,
// Unknown handling. Pure functions, no React.

import type { Configuration, Handheld, OS, PanelType } from './types';

/** Dataset compilation date — the canonical "as of" for prices and specs. */
export const DATASET_DATE = '2026-06-29';

/**
 * Standing disclaimer shown near any price. A global memory-chip shortage made
 * handheld pricing unusually volatile through 2026 (multiple hikes across
 * Valve, Lenovo and MSI), so a static figure can drift within weeks.
 */
export const PRICE_VOLATILITY_NOTE =
  'Handheld prices are unusually volatile in 2026 due to a global memory-chip shortage — we show the best figure at our last check, but always confirm the live price at the retailer.';

const OS_LABELS: Record<OS, string> = {
  SteamOS: 'SteamOS',
  Windows: 'Windows 11',
  Linux: 'Linux',
  'Dual boot': 'Dual boot',
  other: 'Other OS',
};

const PANEL_LABELS: Record<PanelType, string> = {
  oled: 'OLED',
  lcd: 'LCD',
  ips: 'IPS',
  other: 'Display',
};

export function osLabel(os: OS): string {
  return OS_LABELS[os] ?? os;
}

export function panelLabel(panel: PanelType): string {
  return PANEL_LABELS[panel] ?? 'Display';
}

export function formatPrice(usd: number): string {
  return `$${Math.round(usd).toLocaleString('en-US')}`;
}

export function formatVerifiedDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[m - 1]} ${y}`;
}

/** Price string next to a buy CTA, with the freshness qualifier. */
export function priceAsOf(config: Configuration, asOf: string = DATASET_DATE): string | null {
  if (config.priceUsd == null) return null;
  const prefix = config.priceNote ? `${config.priceNote} ` : '';
  return `${prefix}${formatPrice(config.priceUsd)} (as of ${formatVerifiedDate(asOf)})`;
}

/** Lowest known config price in a family, or null if none priced. */
export function startingPrice(h: Handheld): number | null {
  const prices = h.configurations
    .map((c) => c.priceUsd)
    .filter((p): p is number => typeof p === 'number');
  return prices.length ? Math.min(...prices) : null;
}

export function startingPriceLabel(h: Handheld): string {
  const p = startingPrice(h);
  return p == null ? 'Price unavailable' : `from ${formatPrice(p)}`;
}
