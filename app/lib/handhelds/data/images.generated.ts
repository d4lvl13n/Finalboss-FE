// Product images for handhelds — SELF-HOSTED under /public/handhelds (populated
// later by the image-collection step, same approach as laptops). Empty for now;
// pages fall back to the manufacturer label until images land.

export interface HandheldImage {
  url: string;
  alt: string;
  source: string;
}

export const HANDHELD_IMAGES: Record<string, HandheldImage> = {};
