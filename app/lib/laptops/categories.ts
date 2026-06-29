// Category + collection registry — one entry = one "/gaming-laptops/best/<slug>"
// landing page. Two groups:
//   - 'spec'       : GPU tier / panel / form factor (every family has these)
//   - 'collection' : facet-driven "best-for" pages (cooling, upgradeable, …)
// New landing pages are data, not code. Keeps the programmatic pages curated.

import type { GpuTier, LaptopFamily, PanelType } from './types';
import { getAllFamilies, familyGpuTiers } from './queries';
import { startingPrice } from './format';
import * as F from './facets';

export type CategoryGroup = 'spec' | 'collection';

export interface Category {
  slug: string;
  /** SEO <title> core + page H1. */
  title: string;
  /** Lead sentence (also the meta description seed). */
  description: string;
  /** Second sentence of unique on-page copy (anti-thin-content). */
  intro?: string;
  group: CategoryGroup;
  filter: (f: LaptopFamily) => boolean;
  /** Optional ranking; defaults to starting-price ascending. */
  sort?: (a: LaptopFamily, b: LaptopFamily) => number;
}

const byTier = (tier: GpuTier) => (f: LaptopFamily) => familyGpuTiers(f).includes(tier);
const byPanel = (panel: PanelType) => (f: LaptopFamily) => f.display?.panelType === panel;

const asc = (fn: (f: LaptopFamily) => number | null) => (a: LaptopFamily, b: LaptopFamily) =>
  (fn(a) ?? Infinity) - (fn(b) ?? Infinity);
const desc = (fn: (f: LaptopFamily) => number | null) => (a: LaptopFamily, b: LaptopFamily) =>
  (fn(b) ?? -Infinity) - (fn(a) ?? -Infinity);

const upgradeScore = (f: LaptopFamily): number | null => {
  const m = f.build?.upgradeabilityScore?.match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : null;
};

// --- Spec categories (GPU tier / panel / form factor) ---------------------
const SPEC_CATEGORIES: Category[] = [
  {
    slug: 'rtx-5090',
    title: 'Best RTX 5090 Gaming Laptops (2026)',
    description: 'Every 2026 laptop offered with NVIDIA’s flagship GeForce RTX 5090 — the fastest mobile GPU money can buy.',
    intro: 'The RTX 5090 ships with 24 GB of GDDR7; in these machines the real differentiators are cooling headroom and how close each gets to the full 175 W.',
    group: 'spec',
    filter: byTier('rtx-5090'),
  },
  {
    slug: 'rtx-5080',
    title: 'Best RTX 5080 Gaming Laptops (2026)',
    description: 'RTX 5080 laptops — near-flagship 4K-capable performance, usually at a saner price than the 5090.',
    intro: '16 GB of GDDR7 makes the 5080 the sweet spot for high-refresh 1440p and entry-level 4K without the 5090’s heat and cost.',
    group: 'spec',
    filter: byTier('rtx-5080'),
  },
  {
    slug: 'rtx-5070-ti',
    title: 'Best RTX 5070 Ti Gaming Laptops (2026)',
    description: 'RTX 5070 Ti laptops — the high-refresh 1440p sweet spot with 12 GB of GDDR7.',
    intro: 'The extra 4 GB over the 5070 and a higher TGP ceiling make the Ti the value pick for QHD gaming that lasts.',
    group: 'spec',
    filter: byTier('rtx-5070-ti'),
  },
  {
    slug: 'rtx-5070',
    title: 'Best RTX 5070 Gaming Laptops (2026)',
    description: 'RTX 5070 laptops — strong 1440p gaming. Watch the TGP: it ranges widely between models.',
    intro: 'Identical GPU silicon performs very differently here — an 85 W thin-and-light trails a 115 W chassis by a lot, so check each laptop’s power limit.',
    group: 'spec',
    filter: byTier('rtx-5070'),
  },
  {
    slug: 'rtx-5060',
    title: 'Best RTX 5060 Gaming Laptops (2026)',
    description: 'RTX 5060 laptops — the mainstream 1080p/1440p value tier for 2026.',
    intro: 'The volume seller of the line; 8 GB of VRAM is fine at 1080p but starts to pinch in the most demanding 1440p titles.',
    group: 'spec',
    filter: byTier('rtx-5060'),
  },
  {
    slug: 'rtx-5050',
    title: 'Best RTX 5050 Gaming Laptops (2026)',
    description: 'RTX 5050 laptops — the budget entry point. TGP limits matter a lot here, so check each model.',
    intro: 'On a starved power budget the 5050 can fall behind the previous RTX 4060 — the wattage matters more than the name.',
    group: 'spec',
    filter: byTier('rtx-5050'),
  },
  {
    slug: 'oled',
    title: 'Best OLED Gaming Laptops (2026)',
    description: 'Gaming laptops with OLED panels — perfect blacks, fast pixel response and vivid HDR.',
    intro: 'OLED gives the best contrast and motion clarity in a gaming laptop; weigh it against the brighter, burn-in-proof Mini LED alternative.',
    group: 'spec',
    filter: byPanel('oled'),
  },
  {
    slug: 'mini-led',
    title: 'Best Mini LED Gaming Laptops (2026)',
    description: 'Gaming laptops with Mini LED panels — extreme peak brightness and HDR without OLED burn-in risk.',
    intro: 'Mini LED pushes 1000+ nits for punchy HDR highlights and sunlight visibility, trading OLED’s perfect blacks for longevity.',
    group: 'spec',
    filter: byPanel('mini-led'),
  },
  {
    slug: '18-inch',
    title: 'Best 18-Inch Gaming Laptops (2026)',
    description: 'The biggest screens in gaming — 18-inch desktop-replacement laptops with the most cooling headroom.',
    intro: 'An 18-inch chassis gives the flagship GPUs room to run at full power, at the cost of any pretence of portability.',
    group: 'spec',
    filter: (f) => (f.displaySizeInches ?? 0) >= 18,
  },
  {
    slug: '16-inch',
    title: 'Best 16-Inch Gaming Laptops (2026)',
    description: 'The 16-inch class — the most popular balance of screen size, performance and portability.',
    intro: 'The default choice for most buyers: enough cooling for a 5080, a 16:10 panel, and a weight you can still travel with.',
    group: 'spec',
    filter: (f) => f.displaySizeInches === 16,
  },
  {
    slug: 'lightweight',
    title: 'Best Lightweight Gaming Laptops (2026)',
    description: 'Portable 14-inch-class gaming laptops you can actually carry every day.',
    intro: 'Sub-14-inch machines trade sustained performance for genuine portability — buy them for the screen and the carry weight, not raw frame rates.',
    group: 'spec',
    filter: (f) => (f.displaySizeInches ?? 99) <= 14,
  },
];

// --- Collections (facet-driven "best-for" pages) --------------------------
const COLLECTIONS: Category[] = [
  {
    slug: 'best-cooling',
    title: 'Gaming Laptops With the Best Cooling (2026)',
    description: 'Laptops with premium cooling — vapor chambers and liquid metal that keep clocks high under sustained load.',
    intro: 'Ranked with the quietest-measured machines first; all use a vapor chamber and/or liquid metal rather than basic heat-pipe cooling.',
    group: 'collection',
    filter: F.hasStrongCooling,
    sort: asc(F.noiseGamingDb),
  },
  {
    slug: 'quietest',
    title: 'Quietest Gaming Laptops (2026)',
    description: 'Gaming laptops with the lowest measured fan noise under gaming load.',
    intro: 'Ranked by measured dB(A) at gaming load (lower is better); only models with an independently measured figure are listed.',
    group: 'collection',
    filter: (f) => F.noiseGamingDb(f) != null,
    sort: asc(F.noiseGamingDb),
  },
  {
    slug: 'most-upgradeable',
    title: 'Most Upgradeable Gaming Laptops (2026)',
    description: 'Laptops with user-replaceable RAM and two M.2 SSD slots — the most future-proof picks.',
    intro: 'Every laptop here ships with socketed (non-soldered) RAM and at least two M.2 slots, ranked by overall upgradeability.',
    group: 'collection',
    filter: (f) => F.ramUpgradeable(f) && F.hasTwoSsdSlots(f),
    sort: desc(upgradeScore),
  },
  {
    slug: 'best-battery',
    title: 'Gaming Laptops With the Biggest Batteries (2026)',
    description: 'Ranked by battery capacity (Wh) — the most you can fit in a gaming laptop.',
    intro: 'Sorted by cell capacity; note that every gaming laptop drains fast under load, so even the biggest battery is for productivity away from the wall, not unplugged gaming.',
    group: 'collection',
    filter: (f) => F.batteryWh(f) != null,
    sort: desc(F.batteryWh),
  },
  {
    slug: 'ram-upgradeable',
    title: 'Gaming Laptops With Upgradeable RAM (2026)',
    description: 'Laptops with socketed SO-DIMM memory you can add to later — no soldered RAM.',
    intro: 'Buy the base memory and add more yourself; these all use replaceable SO-DIMMs rather than RAM soldered to the board.',
    group: 'collection',
    filter: F.ramUpgradeable,
  },
  {
    slug: 'two-ssd-slots',
    title: 'Gaming Laptops With Two SSD Slots (2026)',
    description: 'Laptops with two M.2 slots — add a second drive without replacing the first.',
    intro: 'A second M.2 slot lets you expand storage cheaply later; every model here ships with at least two.',
    group: 'collection',
    filter: F.hasTwoSsdSlots,
  },
  {
    slug: 'thunderbolt',
    title: 'Gaming Laptops With Thunderbolt (2026)',
    description: 'Laptops with Thunderbolt 4/5 — for eGPUs, fast docks and 40 Gbps external storage.',
    intro: 'Thunderbolt adds high-bandwidth single-cable docking and display output; these all include a TB4 or TB5 port.',
    group: 'collection',
    filter: F.hasThunderbolt,
  },
  {
    slug: 'mux-switch',
    title: 'Gaming Laptops With a MUX Switch (2026)',
    description: 'Laptops with a MUX switch / Advanced Optimus — route the GPU directly to the display for more FPS.',
    intro: 'A MUX switch bypasses the iGPU to cut latency and add frames; every laptop here supports one (or Advanced Optimus).',
    group: 'collection',
    filter: F.hasMux,
  },
  {
    slug: 'for-creators',
    title: 'Best Gaming Laptops for Blender & Unreal Engine (2026)',
    description: 'Creator-grade picks — RTX 5080/5090 with 16 GB+ VRAM for 3D, rendering and Unreal Engine.',
    intro: 'Ranked by GPU VRAM then power; 16 GB or more is the threshold where heavy 3D scenes and large textures stop spilling to system memory.',
    group: 'collection',
    filter: (f) => (F.maxVramGb(f) ?? 0) >= 16,
    sort: desc(F.maxVramGb),
  },
];

export const CATEGORIES: Category[] = [...SPEC_CATEGORIES, ...COLLECTIONS];

export function getCategory(slug: string): Category | null {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

/** Families in a category, applying the category's sort (default: price asc, nulls last). */
export function categoryFamilies(cat: Category): LaptopFamily[] {
  const families = getAllFamilies().filter(cat.filter);
  if (cat.sort) return families.slice().sort(cat.sort);
  return families.slice().sort((a, b) => {
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
    .map((c) => ({ slug: c.slug, title: c.title, group: c.group, count: categoryFamilies(c).length }))
    .filter((c) => c.count > 0);
}

/** All non-empty categories + collections (for generateStaticParams + sitemap). */
export function listCategories(): CategoryFacet[] {
  return facetsFor(CATEGORIES);
}

/** Non-empty spec categories only (index "Browse by category"). */
export function listSpecCategories(): CategoryFacet[] {
  return facetsFor(SPEC_CATEGORIES);
}

/** Non-empty collections only (index "Browse by need"). */
export function listCollections(): CategoryFacet[] {
  return facetsFor(COLLECTIONS);
}

/** Short chip label derived from a category title (for chips + "Also in" links). */
export function categoryChipLabel(title: string): string {
  return title
    .replace(/\s*\(2026\)\s*$/, '')
    .replace(/^Best\s+/, '')
    .replace(/^Gaming Laptops With (the )?/i, '')
    .replace(/\s+Gaming Laptops$/, '')
    .replace(/Gaming Laptops\s+/i, '')
    .replace(/^a\s+/i, '')
    .trim();
}

export interface FamilyCategoryLink {
  slug: string;
  label: string;
  group: CategoryGroup;
}

/** The categories/collections a family belongs to — drives product-page "Also in". */
export function categoriesForFamily(f: LaptopFamily): FamilyCategoryLink[] {
  return CATEGORIES.filter((c) => c.filter(f)).map((c) => ({
    slug: c.slug,
    label: categoryChipLabel(c.title),
    group: c.group,
  }));
}
