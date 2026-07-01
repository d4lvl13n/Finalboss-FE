// Category + collection registry — one entry = one "/handhelds/best/<slug>" page.
//   'spec'       : OS / panel / screen size (structural)
//   'collection' : facet-driven "best-for" pages (battery, weight, controls, eGPU)

import type { Handheld, OS, PanelType } from './types';
import { getAllHandhelds } from './queries';
import { startingPrice } from './format';
import * as F from './facets';

export type CategoryGroup = 'spec' | 'collection';

export interface Category {
  slug: string;
  title: string;
  description: string;
  intro?: string;
  group: CategoryGroup;
  filter: (h: Handheld) => boolean;
  sort?: (a: Handheld, b: Handheld) => number;
}

const byOs = (os: OS) => (h: Handheld) => h.os === os;
const byPanel = (panel: PanelType) => (h: Handheld) => h.display?.panelType === panel;
const asc = (fn: (h: Handheld) => number | null) => (a: Handheld, b: Handheld) =>
  (fn(a) ?? Infinity) - (fn(b) ?? Infinity);
const desc = (fn: (h: Handheld) => number | null) => (a: Handheld, b: Handheld) =>
  (fn(b) ?? -Infinity) - (fn(a) ?? -Infinity);

const SPEC_CATEGORIES: Category[] = [
  {
    slug: 'steamos',
    title: 'Best SteamOS Handhelds (2026)',
    description: 'Handhelds that run Valve’s SteamOS — the smoothest, most efficient handheld experience.',
    intro: 'SteamOS gives longer battery life and a console-like UI at the cost of Windows game-launcher access; these are the devices that ship with it (or officially support it).',
    group: 'spec',
    filter: byOs('SteamOS'),
  },
  {
    slug: 'windows',
    title: 'Best Windows Handhelds (2026)',
    description: 'Windows 11 handhelds — every storefront and anti-cheat, at the cost of some efficiency and UI friction.',
    intro: 'Windows handhelds run Game Pass, Epic, Battle.net and anything else, but you trade SteamOS’s battery efficiency and clean console UI for it.',
    group: 'spec',
    filter: byOs('Windows'),
  },
  {
    slug: 'oled',
    title: 'Best OLED Handhelds (2026)',
    description: 'Handhelds with OLED screens — perfect blacks, vivid HDR and lower power draw than LCD.',
    intro: 'OLED is the single biggest upgrade to how a handheld looks, and it draws less power at low brightness than LCD — a genuine battery win too.',
    group: 'spec',
    filter: byPanel('oled'),
  },
  {
    slug: '7-inch',
    title: 'Best 7-Inch Handhelds (2026)',
    description: 'Compact 7-inch-class handhelds — the most pocketable, travel-friendly form factor.',
    intro: 'The 7-inch class (Steam Deck, ROG Ally, Zotac Zone) is the sweet spot for portability and one-handed reach.',
    group: 'spec',
    filter: (h) => (F.screenInches(h) ?? 99) <= 7.5,
  },
  {
    slug: '8-inch',
    title: 'Best 8-Inch Handhelds (2026)',
    description: 'Bigger 8-inch-class handhelds — more screen and often more battery, still portable.',
    intro: 'The 8-inch class (Claw 8, Legion Go S/2) trades a little pocketability for a bigger screen, bigger battery and more comfortable text.',
    group: 'spec',
    filter: (h) => {
      const s = F.screenInches(h) ?? 0;
      return s > 7.5 && s <= 9;
    },
  },
  {
    slug: 'large-screen',
    title: 'Best Large-Screen Handhelds (2026)',
    description: 'Big 10-inch-plus handhelds — desktop-replacement handhelds for the couch.',
    intro: 'These push past 9 inches for a near-tablet experience; portability suffers, but they’re great docked or on a stand.',
    group: 'spec',
    filter: (h) => (F.screenInches(h) ?? 0) > 9,
  },
];

const COLLECTIONS: Category[] = [
  {
    slug: 'best-battery',
    title: 'Handhelds With the Best Battery (2026)',
    description: 'Ranked by battery capacity (Wh) — the handhelds that last longest away from the wall.',
    intro: 'Sorted by cell capacity; pair a big battery with a low-TDP mode or SteamOS for the real endurance wins.',
    group: 'collection',
    filter: (h) => F.batteryWh(h) != null,
    sort: desc(F.batteryWh),
  },
  {
    slug: 'lightest',
    title: 'Lightest Handhelds (2026)',
    description: 'The lightest handheld gaming PCs — ranked by weight for long, comfortable sessions.',
    intro: 'Weight is what you feel after an hour in bed or on a plane; these are the lightest, lowest-fatigue picks.',
    group: 'collection',
    filter: (h) => F.weightGrams(h) != null,
    sort: asc(F.weightGrams),
  },
  {
    slug: 'hall-effect-sticks',
    title: 'Handhelds With Hall-Effect Sticks (2026)',
    description: 'Handhelds with Hall-effect analog sticks — magnetic sticks that never develop drift.',
    intro: 'Hall-effect sticks use magnets instead of contact potentiometers, so they don’t drift over time — a real longevity upgrade.',
    group: 'collection',
    filter: F.hasHallSticks,
  },
  {
    slug: 'with-trackpads',
    title: 'Handhelds With Trackpads (2026)',
    description: 'Handhelds with built-in trackpads — for mouse-driven games, desktop use and precision aiming.',
    intro: 'Trackpads (Steam Deck, Zotac Zone) unlock strategy games, older PC titles and desktop navigation that sticks alone can’t.',
    group: 'collection',
    filter: F.hasTrackpads,
  },
  {
    slug: 'egpu',
    title: 'Handhelds With eGPU Support (OCuLink / USB4)',
    description: 'Handhelds that can drive an external GPU over OCuLink or USB4 — a desktop upgrade path.',
    intro: 'An OCuLink or USB4 port lets you plug into an external graphics card at your desk, turning a handheld into a full desktop rig.',
    group: 'collection',
    filter: F.hasEgpu,
  },
  {
    slug: 'convertible',
    title: 'Convertible & Detachable-Controller Handhelds (2026)',
    description: 'Handhelds with detachable controllers or a kickstand — tablet mode, FPS mode and desk play.',
    intro: 'Detachable controllers and a kickstand (Legion Go, Nitro Blaze) let you prop the screen and play tabletop, or use a controller half as a mouse.',
    group: 'collection',
    filter: F.isConvertible,
  },
];

export const CATEGORIES: Category[] = [...SPEC_CATEGORIES, ...COLLECTIONS];

export function getCategory(slug: string): Category | null {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function categoryHandhelds(cat: Category): Handheld[] {
  const items = getAllHandhelds().filter(cat.filter);
  if (cat.sort) return items.slice().sort(cat.sort);
  return items.slice().sort((a, b) => {
    const pa = startingPrice(a);
    const pb = startingPrice(b);
    if (pa != null && pb != null) return pa - pb;
    if (pa != null) return -1;
    if (pb != null) return 1;
    return a.name.localeCompare(b.name);
  });
}

export interface CategoryFacet {
  slug: string;
  title: string;
  group: CategoryGroup;
  count: number;
}

function facetsFor(list: Category[]): CategoryFacet[] {
  return list
    .map((c) => ({ slug: c.slug, title: c.title, group: c.group, count: categoryHandhelds(c).length }))
    .filter((c) => c.count > 0);
}

export function listCategories(): CategoryFacet[] {
  return facetsFor(CATEGORIES);
}
export function listSpecCategories(): CategoryFacet[] {
  return facetsFor(SPEC_CATEGORIES);
}
export function listCollections(): CategoryFacet[] {
  return facetsFor(COLLECTIONS);
}

export function categoryChipLabel(title: string): string {
  return title
    .replace(/\s*\(2026\)\s*$/, '')
    .replace(/\s*\(OCuLink[^)]*\)\s*/i, '')
    .replace(/^Best\s+/, '')
    .replace(/^Handhelds With (the )?/i, '')
    .replace(/\s+Handhelds$/, '')
    .replace(/Handhelds\s+/i, '')
    .trim();
}

export interface FamilyCategoryLink {
  slug: string;
  label: string;
  group: CategoryGroup;
}

export function categoriesForHandheld(h: Handheld): FamilyCategoryLink[] {
  return CATEGORIES.filter((c) => c.filter(h)).map((c) => ({
    slug: c.slug,
    label: categoryChipLabel(c.title),
    group: c.group,
  }));
}
