// Amazon affiliate links — one place owns the money path.
//
// Decision (per product owner, 2026-06): Amazon first. Until we have per-product
// ASINs, every "buy" CTA points at a single already-monetised short link that
// lands on the gaming-laptops category. When a config gains an ASIN AND an
// associate tag is configured, we deep-link to the product so attribution and
// price tracking get sharper — without touching any page.

import type { Configuration } from './types';

/**
 * Generic, already-tagged short link → Amazon gaming-laptops category.
 * Used as the fallback CTA for every page that lacks a direct product link.
 */
export const GENERIC_AMAZON_LAPTOPS_URL = 'https://amzn.to/3SwRlJr';

/** Associate tag, if configured. Without it we cannot earn on bare /dp/ links. */
const ASSOCIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || '';

export interface AmazonLink {
  url: string;
  /** true ⇒ deep-links to the specific product; false ⇒ generic category box. */
  isDirect: boolean;
}

/**
 * Resolve the Amazon CTA for a configuration.
 * Deep-links only when we have both an ASIN and a tag (so the click is
 * attributable); otherwise returns the generic monetised short link.
 */
export function amazonLinkForConfig(config?: Configuration | null): AmazonLink {
  if (config?.asin && ASSOCIATE_TAG) {
    return {
      url: `https://www.amazon.com/dp/${encodeURIComponent(config.asin)}?tag=${encodeURIComponent(ASSOCIATE_TAG)}`,
      isDirect: true,
    };
  }
  return { url: GENERIC_AMAZON_LAPTOPS_URL, isDirect: false };
}

/** Convenience for non-config CTAs (hubs, category pages, sidebars). */
export function genericAmazonLink(): AmazonLink {
  return { url: GENERIC_AMAZON_LAPTOPS_URL, isDirect: false };
}
