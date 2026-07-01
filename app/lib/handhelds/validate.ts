// Dependency-free dataset validator — runs at module load (from data/index.ts)
// and throws on the first violation so a malformed dataset fails the build
// loudly instead of shipping broken pages.

import type { Handheld, OS, PanelType } from './types';

const OSES: ReadonlySet<OS> = new Set<OS>(['SteamOS', 'Windows', 'Linux', 'Dual boot', 'other']);
const PANELS: ReadonlySet<PanelType> = new Set<PanelType>(['oled', 'lcd', 'ips', 'other']);
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

class DatasetError extends Error {
  constructor(message: string) {
    super(`[handhelds] dataset invalid: ${message}`);
    this.name = 'DatasetError';
  }
}

export function validateDataset(items: Handheld[]): Handheld[] {
  const seenSlugs = new Set<string>();
  const seenConfigIds = new Set<string>();

  for (const h of items) {
    const where = h.slug || h.name || '(unnamed)';
    if (!h.slug || !SLUG_RE.test(h.slug)) throw new DatasetError(`invalid slug "${h.slug}" on ${where}`);
    if (seenSlugs.has(h.slug)) throw new DatasetError(`duplicate slug "${h.slug}"`);
    seenSlugs.add(h.slug);

    if (!h.manufacturer) throw new DatasetError(`missing manufacturer on ${where}`);
    if (!h.name) throw new DatasetError(`missing name on ${where}`);
    if (!OSES.has(h.os)) throw new DatasetError(`bad os "${h.os}" on ${where}`);
    if (h.completeness !== 'seed' && h.completeness !== 'full') {
      throw new DatasetError(`bad completeness "${h.completeness}" on ${where}`);
    }
    if (!ISO_DATE_RE.test(h.lastVerified)) throw new DatasetError(`bad lastVerified "${h.lastVerified}" on ${where}`);
    if (h.display && !PANELS.has(h.display.panelType)) {
      throw new DatasetError(`bad panelType "${h.display.panelType}" on ${where}`);
    }

    if (!Array.isArray(h.configurations) || h.configurations.length === 0) {
      throw new DatasetError(`${where} has no configurations`);
    }
    for (const c of h.configurations) {
      if (!c.id) throw new DatasetError(`config without id on ${where}`);
      if (seenConfigIds.has(c.id)) throw new DatasetError(`duplicate configuration id "${c.id}" (${where})`);
      seenConfigIds.add(c.id);
      if (!c.label) throw new DatasetError(`config ${c.id} missing label`);
      if (!c.apu?.model) throw new DatasetError(`config ${c.id} missing apu.model`);
      if (c.priceUsd != null && (!Number.isFinite(c.priceUsd) || c.priceUsd <= 0)) {
        throw new DatasetError(`config ${c.id} bad priceUsd ${c.priceUsd}`);
      }
    }
  }
  return items;
}
