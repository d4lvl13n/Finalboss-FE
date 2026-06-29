// Dependency-free dataset validator.
//
// Runs once at module load (from data/index.ts) and throws on the first
// violation so a malformed dataset fails the build LOUDLY instead of shipping
// broken pages. Intentionally hand-rolled to avoid adding a dependency for 53
// records — the shape is small and known. If the dataset grows or needs
// per-field coercion, this is a drop-in swap for a Zod schema.

import type { GpuTier, LaptopFamily, PanelType } from './types';

const GPU_TIERS: ReadonlySet<GpuTier> = new Set<GpuTier>([
  'rtx-5050',
  'rtx-5060',
  'rtx-5070',
  'rtx-5070-ti',
  'rtx-5080',
  'rtx-5090',
  'igpu',
  'other',
]);

const PANEL_TYPES: ReadonlySet<PanelType> = new Set<PanelType>([
  'oled',
  'mini-led',
  'ips',
  'igpu-shared',
  'other',
]);

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

class DatasetError extends Error {
  constructor(message: string) {
    super(`[laptops] dataset invalid: ${message}`);
    this.name = 'DatasetError';
  }
}

/**
 * Validates structural invariants and returns the same array (so callers can
 * `export const LAPTOPS = validateDataset([...])`). Throws DatasetError on the
 * first problem found.
 */
export function validateDataset(families: LaptopFamily[]): LaptopFamily[] {
  const seenSlugs = new Set<string>();
  const seenConfigIds = new Set<string>();

  for (const f of families) {
    const where = f.slug || f.name || '(unnamed family)';

    // Identity
    if (!f.slug || !SLUG_RE.test(f.slug)) {
      throw new DatasetError(`invalid slug "${f.slug}" on ${where}`);
    }
    if (seenSlugs.has(f.slug)) {
      throw new DatasetError(`duplicate family slug "${f.slug}"`);
    }
    seenSlugs.add(f.slug);

    if (!f.manufacturer) throw new DatasetError(`missing manufacturer on ${where}`);
    if (!f.name) throw new DatasetError(`missing name on ${where}`);
    if (f.completeness !== 'seed' && f.completeness !== 'full') {
      throw new DatasetError(`bad completeness "${f.completeness}" on ${where}`);
    }
    if (!ISO_DATE_RE.test(f.lastVerified)) {
      throw new DatasetError(`bad lastVerified "${f.lastVerified}" on ${where}`);
    }
    if (f.display && !PANEL_TYPES.has(f.display.panelType)) {
      throw new DatasetError(`bad panelType "${f.display.panelType}" on ${where}`);
    }

    // Configurations
    if (!Array.isArray(f.configurations) || f.configurations.length === 0) {
      throw new DatasetError(`${where} has no configurations`);
    }
    for (const c of f.configurations) {
      if (!c.id) throw new DatasetError(`config without id on ${where}`);
      if (seenConfigIds.has(c.id)) {
        throw new DatasetError(`duplicate configuration id "${c.id}" (${where})`);
      }
      seenConfigIds.add(c.id);

      if (!c.label) throw new DatasetError(`config ${c.id} missing label`);
      if (!c.cpu?.model) throw new DatasetError(`config ${c.id} missing cpu.model`);
      if (!c.gpu?.model) throw new DatasetError(`config ${c.id} missing gpu.model`);
      if (!GPU_TIERS.has(c.gpu.tier)) {
        throw new DatasetError(`config ${c.id} bad gpu.tier "${c.gpu.tier}"`);
      }
      if (c.priceUsd != null && (!Number.isFinite(c.priceUsd) || c.priceUsd <= 0)) {
        throw new DatasetError(`config ${c.id} bad priceUsd ${c.priceUsd}`);
      }
    }
  }

  return families;
}
