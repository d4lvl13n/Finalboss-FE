// Amazon affiliate links for handhelds — one place owns the money path.
//
// GENERIC_AMAZON_HANDHELDS_URL is an already-tagged short link to Amazon's
// handheld gaming PC category, used as the fallback CTA on every page.
// Per-config ASIN deep-links kick in once a config has an `asin` and
// NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG is set.

import type { Configuration } from './types';

/** Generic already-tagged Amazon short link → handheld gaming PC category. */
export const GENERIC_AMAZON_HANDHELDS_URL = 'https://amzn.to/4wcs71i';

// The FinalBoss Amazon Associates tag is public (it appears in every affiliate
// URL), so it's safe to hardcode as the default; an env var can still override.
const ASSOCIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || 'finalboss517-20';

export interface AmazonLink {
  url: string;
  isDirect: boolean;
}

/** Tagged Amazon search for a product name — the fallback when we have no ASIN. */
function searchUrl(query: string): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${encodeURIComponent(ASSOCIATE_TAG)}`;
}

/**
 * Best affiliate link for a config:
 *   1. verified ASIN  → tagged /dp/<asin> deep link (isDirect)
 *   2. product name   → tagged Amazon search for that product
 *   3. neither        → the generic handheld-category short link
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
  return { url: GENERIC_AMAZON_HANDHELDS_URL, isDirect: false };
}

/** Tagged Amazon search link for an arbitrary product name. */
export function amazonSearchLink(productName: string): AmazonLink {
  return { url: searchUrl(productName), isDirect: false };
}

export function genericAmazonLink(): AmazonLink {
  return { url: GENERIC_AMAZON_HANDHELDS_URL, isDirect: false };
}
