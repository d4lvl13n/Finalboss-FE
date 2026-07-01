// Derived facets — typed numeric/boolean signals from the handheld dataset's
// human-readable fields. Drive the collection pages. Pure functions; null/false
// when a value can't be derived.

import type { Handheld } from './types';

function firstNumber(s: string | undefined, unitRe: RegExp): number | null {
  if (!s) return null;
  const m = s.match(unitRe);
  return m ? parseFloat(m[1]) : null;
}

function text(h: Handheld): string {
  return [
    h.summary,
    h.connectivity?.ports,
    h.connectivity?.usb4Thunderbolt,
    h.connectivity?.externalGpu,
    h.controls?.triggers,
    h.controls?.trackpads,
    h.controls?.layoutNote,
    ...h.configurations.flatMap((c) => [c.apu.model, c.apu.gpuArch, c.statusNote, c.label]),
    ...(h.reliability ?? []).map((r) => `${r.area} ${r.detail}`),
  ]
    .filter(Boolean)
    .join(' • ')
    .toLowerCase();
}

/* numbers */

export function weightGrams(h: Handheld): number | null {
  if (h.ergonomics?.weightGrams != null) return h.ergonomics.weightGrams;
  return null;
}

export function batteryWh(h: Handheld): number | null {
  return h.battery?.capacityWh ?? null;
}

export function screenInches(h: Handheld): number | null {
  return h.display?.sizeInches ?? h.displaySizeInches ?? null;
}

/** Highest TDP (watts) from the APU tdpRangeW string across configs. */
export function maxTdpW(h: Handheld): number | null {
  const vals = h.configurations
    .map((c) => firstNumber(c.apu.tdpRangeW, /(\d+(?:\.\d+)?)\s*w\s*$/i) ?? firstNumber(c.apu.tdpRangeW?.split(/[–-]/).pop(), /(\d+(?:\.\d+)?)/))
    .filter((n): n is number => typeof n === 'number');
  return vals.length ? Math.max(...vals) : null;
}

/* booleans */

export function isOled(h: Handheld): boolean {
  return h.display?.panelType === 'oled';
}

export function isSteamOS(h: Handheld): boolean {
  return h.os === 'SteamOS';
}

export function isWindows(h: Handheld): boolean {
  return h.os === 'Windows';
}

export function hasHallSticks(h: Handheld): boolean {
  return h.controls?.hallSticks === true;
}

export function hasGyro(h: Handheld): boolean {
  return h.controls?.gyro === true;
}

export function hasTrackpads(h: Handheld): boolean {
  const t = h.controls?.trackpads;
  return !!t && !/^\s*(no|none)\b/i.test(t);
}

/** OCuLink or USB4 external-GPU support. */
export function hasEgpu(h: Handheld): boolean {
  const e = h.connectivity?.externalGpu;
  if (e && !/^\s*(no|none)\b/i.test(e)) return true;
  return /oculink/.test(text(h));
}

export function isConvertible(h: Handheld): boolean {
  return h.formFactor === 'convertible' || h.formFactor === 'detachable';
}
