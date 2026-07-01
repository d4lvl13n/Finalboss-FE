// Amazon affiliate links for handhelds — one place owns the money path.
//
// TODO(owner): swap GENERIC_AMAZON_HANDHELDS_URL for a handheld-specific
// already-tagged short link (the current value points at the gaming-laptops
// category as a placeholder). Per-config ASIN deep-links kick in once a config
// has an `asin` and NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG is set.

import type { Configuration } from './types';

/** Generic already-tagged Amazon short link (placeholder — see TODO above). */
export const GENERIC_AMAZON_HANDHELDS_URL = 'https://amzn.to/3SwRlJr';

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
