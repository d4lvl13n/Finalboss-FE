// Accessor for the auto-collected product images. Centralises the
// "missing → null" fallback so components can render gracefully when a family
// has no image yet. Images are external URLs rendered via plain <img> (so the
// many manufacturer/retailer domains don't each need next.config whitelisting).

import { LAPTOP_IMAGES, type LaptopImage } from './data/images.generated';

export type { LaptopImage };

export function getLaptopImage(slug: string): LaptopImage | null {
  return LAPTOP_IMAGES[slug] ?? null;
}
