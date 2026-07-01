// Accessor for the collected handheld product images. Centralises the
// "missing → null" fallback so components render gracefully before images land.

import { HANDHELD_IMAGES, type HandheldImage } from './data/images.generated';

export type { HandheldImage };

export function getHandheldImage(slug: string): HandheldImage | null {
  return HANDHELD_IMAGES[slug] ?? null;
}
