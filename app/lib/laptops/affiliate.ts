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

// The FinalBoss Amazon Associates tag is public (it appears in every affiliate
// URL), so it's safe to hardcode as the default; an env var can still override.
const ASSOCIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || 'finalboss517-20';

export interface AmazonLink {
  url: string;
  /** true ⇒ deep-links to the specific product; false ⇒ search/category box. */
  isDirect: boolean;
}

/** Tagged Amazon search for a product name — the fallback when we have no ASIN. */
function searchUrl(query: string): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${encodeURIComponent(ASSOCIATE_TAG)}`;
}

/**
 * Best Amazon CTA for a configuration:
 *   1. verified ASIN → tagged /dp/<asin> deep link (isDirect)
 *   2. product name  → tagged Amazon search for that model
 *   3. neither       → the generic gaming-laptops short link
 * Laptop listings are config-specific and churn fast, so the product-name
 * search is usually the more durable link than a fixed per-config ASIN.
 */
export function amazonLinkForConfig(config?: Configuration | null, productName?: string): AmazonLink {
  if (config?.asin) {
    return {
      url: `https://www.amazon.com/dp/${encodeURIComponent(config.asin)}?tag=${encodeURIComponent(ASSOCIATE_TAG)}`,
      isDirect: true,
    };
  }
  if (productName && productName.trim()) {
    return { url: searchUrl(productName.trim()), isDirect: false };
  }
  return { url: GENERIC_AMAZON_LAPTOPS_URL, isDirect: false };
}

/** Tagged Amazon search link for an arbitrary product name. */
export function amazonSearchLink(productName: string): AmazonLink {
  return { url: searchUrl(productName), isDirect: false };
}

/** Convenience for non-config CTAs (hubs, category pages, sidebars). */
export function genericAmazonLink(): AmazonLink {
  return { url: GENERIC_AMAZON_LAPTOPS_URL, isDirect: false };
}
