// Helpers for seed-level families (identity + configurations only).
// Detailed spec sub-objects are added later, per-segment, during enrichment.

import type { Gpu, GpuTier } from '../types';

export const SEED_DATE = '2026-06-29';

const VRAM_GB: Partial<Record<GpuTier, number>> = {
  'rtx-5050': 8,
  'rtx-5060': 8,
  'rtx-5070': 8,
  'rtx-5070-ti': 12,
  'rtx-5080': 16,
  'rtx-5090': 24,
};

/** Build an NVIDIA GPU spec, deriving VRAM from the tier (all RTX 50 are GDDR7). */
export function nvidia(model: string, tier: GpuTier): Gpu {
  const vramGb = VRAM_GB[tier];
  return { vendor: 'NVIDIA', model, tier, ...(vramGb ? { vramGb, vramType: 'GDDR7' } : {}) };
}
