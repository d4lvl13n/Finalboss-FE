// Amazon affiliate links for handhelds — one place owns the money path.
//
// GENERIC_AMAZON_HANDHELDS_URL is an already-tagged short link to Amazon's
// handheld gaming PC category, used as the fallback CTA on every page.
// Per-config ASIN deep-links kick in once a config has an `asin` and
// NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG is set.

import type { Configuration } from './types';

/** Generic already-tagged Amazon short link → handheld gaming PC category. */
export const GENERIC_AMAZON_HANDHELDS_URL = 'https://amzn.to/4wcs71i';

const ASSOCIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || '';

export interface AmazonLink {
  url: string;
  isDirect: boolean;
}

export function amazonLinkForConfig(config?: Configuration | null): AmazonLink {
  if (config?.asin && ASSOCIATE_TAG) {
    return {
      url: `https://www.amazon.com/dp/${encodeURIComponent(config.asin)}?tag=${encodeURIComponent(ASSOCIATE_TAG)}`,
      isDirect: true,
    };
  }
  return { url: GENERIC_AMAZON_HANDHELDS_URL, isDirect: false };
}

export function genericAmazonLink(): AmazonLink {
  return { url: GENERIC_AMAZON_HANDHELDS_URL, isDirect: false };
}
