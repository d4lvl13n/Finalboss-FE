// Derived facets — typed numeric/boolean signals computed from the dataset's
// human-readable fields. Lets the collection pages (Scope 4) and any future
// finder filter/sort on real values without re-authoring the data. Pure
// functions; return null/false when a value can't be derived (callers sort
// nulls last / filter falses out).

import type { LaptopFamily } from './types';

function firstNumber(s: string | undefined, unitRe: RegExp): number | null {
  if (!s) return null;
  const m = s.match(unitRe);
  return m ? parseFloat(m[1]) : null;
}

/** Lowercased blob of the prose fields — used for keyword facets (MUX etc.). */
function familyText(f: LaptopFamily): string {
  const parts: Array<string | undefined> = [
    f.summary,
    f.thermals?.throttlingNote,
    f.thermals?.cpuTempNote,
    f.thermals?.gpuTempNote,
    f.thermals?.noiseGamingDb,
    f.display?.gsyncVrr,
    f.display?.hdr,
    f.display?.options,
    f.connectivity?.thunderbolt,
    f.connectivity?.usbC,
    f.connectivity?.usb4,
    f.build?.keyboard,
    ...f.configurations.flatMap((c) => [c.gpu.tgpNote, c.statusNote, c.label]),
    ...(f.reliability ?? []).map((r) => `${r.area} ${r.detail}`),
  ];
  return parts.filter(Boolean).join(' • ').toLowerCase();
}

/* ---------------------------------------------------------------- numbers */

/** Lightest weight in kg (first kg figure in build.weightKg). */
export function weightKg(f: LaptopFamily): number | null {
  return firstNumber(f.build?.weightKg, /(\d+(?:\.\d+)?)\s*kg/i);
}

/** Gaming-load fan noise in dB (first dB figure). */
export function noiseGamingDb(f: LaptopFamily): number | null {
  return firstNumber(f.thermals?.noiseGamingDb, /(\d+(?:\.\d+)?)\s*db/i);
}

/** Battery capacity in Wh (number, or first Wh figure in a string). */
export function batteryWh(f: LaptopFamily): number | null {
  const v = f.battery?.capacityWh;
  if (typeof v === 'number') return v;
  return firstNumber(v, /(\d+(?:\.\d+)?)\s*wh/i);
}

/** Highest GPU TGP (watts) across the family's configurations. */
export function maxTgpW(f: LaptopFamily): number | null {
  const tgps = f.configurations
    .map((c) => c.gpu.tgpWatts)
    .filter((n): n is number => typeof n === 'number');
  return tgps.length ? Math.max(...tgps) : null;
}

/** Highest installed/declared GPU VRAM (GB) across configurations. */
export function maxVramGb(f: LaptopFamily): number | null {
  const v = f.configurations
    .map((c) => c.gpu.vramGb)
    .filter((n): n is number => typeof n === 'number');
  return v.length ? Math.max(...v) : null;
}

/* --------------------------------------------------------------- booleans */

export function isOled(f: LaptopFamily): boolean {
  return f.display?.panelType === 'oled';
}

export function isMiniLed(f: LaptopFamily): boolean {
  return f.display?.panelType === 'mini-led';
}

export function ramUpgradeable(f: LaptopFamily): boolean {
  return f.memory?.upgradeable === true && f.memory?.soldered !== true;
}

export function hasTwoSsdSlots(f: LaptopFamily): boolean {
  return (f.memory?.ssdSlots ?? 0) >= 2;
}

export function hasThunderbolt(f: LaptopFamily): boolean {
  const t = f.connectivity?.thunderbolt;
  return !!t && !/^\s*(no|none)\b/i.test(t);
}

export function hasVaporChamber(f: LaptopFamily): boolean {
  return f.thermals?.vaporChamber === true;
}

/** Premium cooling signal: a vapor chamber or liquid metal (verified or noted). */
export function hasStrongCooling(f: LaptopFamily): boolean {
  if (f.thermals?.vaporChamber === true || f.thermals?.liquidMetal === true) return true;
  return /vapor chamber|liquid metal/i.test(f.thermals?.throttlingNote ?? '');
}

export function hasMux(f: LaptopFamily): boolean {
  return /\b(mux|advanced optimus)\b/.test(familyText(f));
}

export function hasReportedCoilWhine(f: LaptopFamily): boolean {
  return (f.reliability ?? []).some((r) => /coil whine/i.test(`${r.area} ${r.detail}`));
}

/** "No coil whine" = the family has been reviewed (has reliability notes) and
 *  none of them report coil whine. Avoids claiming clean on unreviewed models. */
export function noCoilWhine(f: LaptopFamily): boolean {
  return (f.reliability?.length ?? 0) > 0 && !hasReportedCoilWhine(f);
}
