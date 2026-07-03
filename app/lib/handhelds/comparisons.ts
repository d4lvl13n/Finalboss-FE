// Curated head-to-head comparison registry + derived spec-diff builder.
//
// A small, hand-picked set of "A vs B" pairs (not a full cross-product) —
// each with an editorial verdict and buy guidance sourced only from the
// existing per-family `summary`/`pros`/`cons`/specs in the dataset. Nothing
// here is invented; unknown specs are simply omitted from the diff table.

import { getHandheld } from './queries';
import type { Configuration, Handheld, PanelType } from './types';
import { osLabel, panelLabel, startingPrice, formatPrice } from './format';
import * as F from './facets';

export interface ComparisonPair {
  /** Family slug — canonical order: `a` sorts alphabetically before `b`. */
  a: string;
  b: string;
  /** 2–3 sentence plain-text overall take. */
  verdict: string;
  /** One-liner: "Buy the <A> if …" */
  whoA: string;
  /** One-liner: "Buy the <B> if …" */
  whoB: string;
}

export interface ResolvedComparison extends ComparisonPair {
  slug: string;
  handheldA: Handheld;
  handheldB: Handheld;
}

/**
 * The 14 curated pairs. Each `a`/`b` is in canonical alphabetical-by-slug
 * order. Verdicts/who-should-buy lines are drawn only from each family's own
 * `summary`/`pros`/`cons`/specs in `app/lib/handhelds/data/*` — see
 * `docs/handhelds-phase2-spec.md` rule 1.
 */
export const COMPARISON_PAIRS: ComparisonPair[] = [
  {
    a: 'asus-rog-ally-x',
    b: 'valve-steam-deck-oled',
    verdict: `The ROG Ally X and Steam Deck OLED represent the two philosophies of handheld gaming: raw Windows horsepower versus SteamOS polish. The Ally X's Ryzen Z1 Extreme and 80 Wh battery give it more sustained performance and USB4/eGPU support, while the Steam Deck OLED counters with a gorgeous 90 Hz HDR OLED screen, less weight and Valve's best-in-class suspend/resume. Most buyers who don't need Windows-only software are better served by the Steam Deck OLED's smoother experience; power users lean Ally X.`,
    whoA: `Buy the ROG Ally X if you want more raw performance, USB4/eGPU support and access to every Windows storefront.`,
    whoB: `Buy the Steam Deck OLED if you want the smoothest handheld OS, a vivid 90 Hz OLED screen and a lighter, more polished suspend/resume experience.`,
  },
  {
    a: 'valve-steam-deck-lcd',
    b: 'valve-steam-deck-oled',
    verdict: `Same Zen 2 / RDNA 2 APU, same SteamOS polish — the OLED model just does everything the LCD does better: a 90 Hz HDR OLED panel versus 60 Hz LCD, a bigger 50 Wh battery versus 40 Wh, Wi-Fi 6E, and ~30 g less weight. Note that Valve discontinued new LCD sales in late 2025 — it now exists only as ~$319 Certified Refurbished stock, so in 2026 the OLED is effectively the only Steam Deck you can buy new.`,
    whoA: `Consider the LCD Steam Deck only as refurbished — it's the cheapest way into SteamOS if you can find Valve's rotating Certified Refurbished stock and don't mind the 60 Hz LCD.`,
    whoB: `Buy the Steam Deck OLED — it's the current new Steam Deck, with an HDR OLED panel, more battery and Wi-Fi 6E.`,
  },
  {
    a: 'lenovo-legion-go',
    b: 'valve-steam-deck-oled',
    verdict: `The Legion Go pairs the same Ryzen Z1 Extreme as the ROG Ally X with a much bigger, sharper 8.8-inch 144 Hz display and Switch-style detachable controllers, but it ships nearly 200 g heavier than the Steam Deck OLED with a smaller 49.2 Wh battery and a rocky launch-firmware history. The Steam Deck OLED trades screen size and detachability for a lighter body, an OLED panel and SteamOS's superior polish.`,
    whoA: `Buy the Legion Go if you want a bigger, sharper 144 Hz display and detachable controllers for FPS/tablet modes, and can tolerate the extra weight and Windows quirks.`,
    whoB: `Buy the Steam Deck OLED if you want a lighter, more efficient SteamOS handheld with a vivid OLED screen and better battery life relative to its weight.`,
  },
  {
    a: 'msi-claw-8-ai-plus',
    b: 'valve-steam-deck-oled',
    verdict: `The Claw 8 AI+ moves to Intel's efficient Lunar Lake silicon and pairs it with an 80 Wh battery and dual Thunderbolt 4 ports — more battery and connectivity than the Steam Deck OLED — while the Steam Deck OLED counters with a lighter 640 g body, a vivid OLED panel and SteamOS's smoother software layer. Notebookcheck rated the Claw 8 AI+ favorably for its efficiency, but its MSI Center M software remains rougher than SteamOS.`,
    whoA: `Buy the Claw 8 AI+ if you want a large 80 Wh battery, dual Thunderbolt 4/USB4 ports and full access to the Windows game library.`,
    whoB: `Buy the Steam Deck OLED if you want a lighter device, an OLED screen and the more mature, less fiddly SteamOS software experience.`,
  },
  {
    a: 'asus-rog-ally-2023',
    b: 'asus-rog-ally-x',
    verdict: `The Ally X is ASUS's fix-everything follow-up to the original Ally: the same Ryzen Z1 Extreme, but with a doubled 80 Wh battery, 24 GB of faster RAM, a 1 TB SSD, USB4/Thunderbolt, and a resolved SD-card-reader defect that plagued the 2023 model. The original Ally is now discontinued and worth considering only used, at a steep discount, given its documented SD-reader failures and stick drift.`,
    whoA: `Buy the original Ally only used and heavily discounted — its SD-card-reader defect and 40 Wh battery are real, widely reported drawbacks.`,
    whoB: `Buy the Ally X for a doubled battery, resolved SD-reader issue, USB4/eGPU support and better ergonomics — it's the complete ROG Ally.`,
  },
  {
    a: 'asus-rog-ally-x',
    b: 'lenovo-legion-go',
    verdict: `The Ally X is the lighter, longer-battery pick at 685 g and 80 Wh with USB4/Thunderbolt, while the Legion Go counters with a bigger, sharper 8.8-inch 144 Hz 1600p display and detachable Switch-style controllers, at the cost of nearly 160 g more weight and a smaller 49.2 Wh battery. Both run the same Ryzen Z1 Extreme, so the choice comes down to screen/controller flexibility versus portability and battery.`,
    whoA: `Buy the Ally X if you want a lighter, longer-battery handheld with USB4/eGPU support in a conventional form factor.`,
    whoB: `Buy the Legion Go if a bigger, sharper 144 Hz display and detachable/FPS-mode controllers matter more than weight and battery life.`,
  },
  {
    a: 'asus-rog-ally-x',
    b: 'msi-claw-8-ai-plus',
    verdict: `Both pack an 80 Wh battery, but the Ally X sticks with AMD's proven Ryzen Z1 Extreme (RDNA 3) in a smaller 7-inch body, while the Claw 8 AI+ moves to Intel's Lunar Lake platform with dual Thunderbolt 4 ports, Wi-Fi 7 and an 8-inch VRR display. The Claw 8 AI+ was rated favorably by Notebookcheck for efficiency, but its MSI Center M software is reportedly laggier than ASUS's Armoury Crate.`,
    whoA: `Buy the Ally X if you want proven AMD RDNA 3 performance in a smaller, cheaper 7-inch body.`,
    whoB: `Buy the Claw 8 AI+ if you want Intel Lunar Lake efficiency, dual Thunderbolt 4/Wi-Fi 7 and a bigger 8-inch VRR screen.`,
  },
  {
    a: 'lenovo-legion-go',
    b: 'lenovo-legion-go-2',
    verdict: `The Legion Go 2 is a genuine flagship upgrade over the original Legion Go: an 8.8-inch OLED 144 Hz VRR panel replaces the IPS screen, the battery grows from 49.2 Wh to 74 Wh, and Zen 5 Ryzen Z2/Z2 Extreme silicon replaces the older Z1 Extreme — but it starts at $1,099.99, versus the original's clearance pricing, and is 77 g heavier. The original Legion Go survives mainly as a discounted buy for shoppers who can't stretch to the Go 2's flagship price.`,
    whoA: `Buy the original Legion Go only as a clearance bargain if the price gap outweighs the OLED screen and bigger battery.`,
    whoB: `Buy the Legion Go 2 if you want the OLED VRR upgrade, a much bigger 74 Wh battery and Zen 5 performance, and can absorb the flagship price and extra weight.`,
  },
  {
    a: 'lenovo-legion-go-s-steamos',
    b: 'valve-steam-deck-oled',
    verdict: `The Legion Go S (SteamOS) offers a bigger 8-inch 120 Hz screen and genuine Hall-effect sticks — something the Steam Deck still lacks — on the same efficient OS. It launched cheaper than the Steam Deck, but 2026's memory-shortage price hikes have pushed it above the OLED at most retailers, so its old price advantage has eroded. The Steam Deck OLED counters with a lighter body, an OLED panel with HDR, and Valve's more mature, longer-refined SteamOS implementation.`,
    whoA: `Buy the Legion Go S (SteamOS) if you want a bigger screen and Hall-effect sticks on the same efficient OS, and can stomach its risen 2026 pricing.`,
    whoB: `Buy the Steam Deck OLED if you want the most polished SteamOS experience and a vivid HDR OLED panel, even without Hall-effect sticks.`,
  },
  {
    a: 'asus-rog-ally-x',
    b: 'asus-rog-xbox-ally',
    verdict: `The Ally X outguns the base Xbox Ally on every core spec — a faster Ryzen Z1 Extreme (12 CUs) versus the Xbox Ally's weaker Z2 A (8 CUs), a 1 TB SSD versus 512 GB, 24 GB versus 16 GB of RAM, and USB4/Thunderbolt the Xbox Ally lacks — but the Xbox Ally counters with a lower $599.99 price and the friction-reducing Xbox Full Screen Experience layered over Windows.`,
    whoA: `Buy the Ally X if raw performance, storage and RAM headroom matter more than price.`,
    whoB: `Buy the Xbox Ally if you want the Xbox Full Screen Experience at a lower price and don't need top-tier performance.`,
  },
  {
    a: 'asus-rog-ally-x',
    b: 'asus-rog-xbox-ally-x',
    verdict: `Both carry an 80 Wh battery, but the Xbox Ally X moves to a newer Zen 5 / RDNA 3.5 "Ryzen AI Z2 Extreme" APU with 16 CUs versus the Ally X's Zen 4 Z1 Extreme (12 CUs), and adds the Xbox Full Screen Experience on top of Windows — at a $999.99 price versus the Ally X's $799. The Ally X remains the better value pick if you don't need the latest silicon or Xbox integration.`,
    whoA: `Buy the Ally X if you want the same 80 Wh battery and USB4 support for about $200 less, and don't need the newest silicon.`,
    whoB: `Buy the Xbox Ally X if you want ASUS's fastest handheld to date — Zen 5 / RDNA 3.5 with 16 CUs — plus the Xbox Full Screen Experience, and can pay the flagship price.`,
  },
  {
    a: 'lenovo-legion-go-s-windows',
    b: 'valve-steam-deck-oled',
    verdict: `The Legion Go S ships in both SteamOS and Windows flavors on identical hardware, and reviewers were blunt that the Windows build wastes it — Notebookcheck called it a "Windows victim," measurably slower and less efficient than the same chassis on SteamOS. Against the Steam Deck OLED, the Windows Legion Go S offers a bigger 8-inch screen and Hall-effect sticks, but the Steam Deck OLED's mature SteamOS software and OLED panel make it the safer default unless you specifically need Windows.`,
    whoA: `Buy the Legion Go S (Windows) only if you specifically need the Windows game/launcher ecosystem — the same hardware runs faster and more efficiently on SteamOS.`,
    whoB: `Buy the Steam Deck OLED for the more polished, more efficient handheld OS and a superior OLED screen.`,
  },
  {
    a: 'asus-rog-ally-2023',
    b: 'msi-claw-a1m',
    verdict: `Both are discontinued first-generation handhelds with well-documented reliability problems: the original Ally suffered a heat-damaged SD-card reader and drift-prone potentiometer sticks, while the Claw A1M's Intel Meteor Lake chip ran hot, its 53 Wh battery gave only around two hours of gaming, and its launch firmware was rocky. The Claw A1M does ship with genuine Hall-effect sticks and Thunderbolt 4/Wi-Fi 7, which the original Ally lacks.`,
    whoA: `Buy the original Ally, used and discounted, if you want AMD RDNA 3 performance and don't mind sourcing a Hall-effect stick upgrade to fix the drift-prone sticks.`,
    whoB: `Buy the Claw A1M, used and discounted, if you want factory Hall-effect sticks and Thunderbolt 4/Wi-Fi 7, and can tolerate its worse thermal throttling and shorter battery life.`,
  },
  {
    a: 'asus-rog-ally-x',
    b: 'zotac-zone',
    verdict: `The Zotac Zone counters the Ally X with a standout 800-nit OLED panel and rare dual trackpads for mouse-driven games, but its 48.5 Wh battery gives only around 1.5–2 hours of gaming versus the Ally X's much larger 80 Wh cell. The Ally X's more mature software and significantly longer battery life make it the safer all-rounder; the Zone is the pick for OLED and trackpad enthusiasts who accept the tradeoff.`,
    whoA: `Buy the Ally X if battery life is the priority — its 80 Wh cell is far larger than the Zone's 48.5 Wh, with more mature software.`,
    whoB: `Buy the Zotac Zone if you want a vivid 800-nit OLED screen and rare dual trackpads for mouse-driven games, and can accept its short battery life.`,
  },
];

/** `${a}-vs-${b}` in canonical order. */
export function comparisonSlug(a: string, b: string): string {
  return `${a}-vs-${b}`;
}

function resolve(p: ComparisonPair): ResolvedComparison | null {
  const handheldA = getHandheld(p.a);
  const handheldB = getHandheld(p.b);
  if (!handheldA || !handheldB) return null;
  return { ...p, slug: comparisonSlug(p.a, p.b), handheldA, handheldB };
}

export function getAllComparisons(): ResolvedComparison[] {
  return COMPARISON_PAIRS.map(resolve).filter((c): c is ResolvedComparison => c != null);
}

/**
 * Resolve a comparison by its `<a>-vs-<b>` slug. Splits on the literal
 * `-vs-` — safe, since no family slug contains that substring.
 */
export function getComparison(slug: string): ResolvedComparison | null {
  const idx = slug.indexOf('-vs-');
  if (idx === -1) return null;
  const a = slug.slice(0, idx);
  const b = slug.slice(idx + '-vs-'.length);
  const pair = COMPARISON_PAIRS.find((p) => p.a === a && p.b === b);
  return pair ? resolve(pair) : null;
}

/** Pairs featuring a given family slug (either side) — for cross-links. */
export function comparisonsFor(slug: string): ResolvedComparison[] {
  return COMPARISON_PAIRS.filter((p) => p.a === slug || p.b === slug)
    .map(resolve)
    .filter((c): c is ResolvedComparison => c != null);
}

/* ------------------------------------------------------------- spec diff */

export interface SpecRow {
  label: string;
  a: string;
  b: string;
  winner: 'a' | 'b' | null;
}

/** Cheapest priced configuration in a family, falling back to the first. */
function headlineConfig(h: Handheld): Configuration | undefined {
  const priced = h.configurations
    .filter((c) => c.priceUsd != null)
    .sort((x, y) => (x.priceUsd ?? 0) - (y.priceUsd ?? 0));
  return priced[0] ?? h.configurations[0];
}

function priceRow(a: Handheld, b: Handheld): SpecRow | null {
  const pa = startingPrice(a);
  const pb = startingPrice(b);
  if (pa == null && pb == null) return null;
  let winner: 'a' | 'b' | null = null;
  if (pa != null && pb != null && pa !== pb) winner = pa < pb ? 'a' : 'b';
  return {
    label: 'Starting price',
    a: pa != null ? formatPrice(pa) : '—',
    b: pb != null ? formatPrice(pb) : '—',
    winner,
  };
}

function osRow(a: Handheld, b: Handheld): SpecRow {
  return { label: 'OS', a: osLabel(a.os), b: osLabel(b.os), winner: null };
}

function screenRow(a: Handheld, b: Handheld): SpecRow | null {
  const sa = F.screenInches(a);
  const sb = F.screenInches(b);
  if (sa == null && sb == null) return null;
  return {
    label: 'Screen size',
    a: sa != null ? `${sa}"` : '—',
    b: sb != null ? `${sb}"` : '—',
    winner: null,
  };
}

const PANEL_RANK: Record<PanelType, number> = { oled: 1, lcd: 0, ips: 0, other: 0 };
function panelRow(a: Handheld, b: Handheld): SpecRow | null {
  const ap = a.display?.panelType;
  const bp = b.display?.panelType;
  if (!ap && !bp) return null;
  let winner: 'a' | 'b' | null = null;
  if (ap && bp) {
    const ra = PANEL_RANK[ap];
    const rb = PANEL_RANK[bp];
    if (ra !== rb) winner = ra > rb ? 'a' : 'b';
  }
  return {
    label: 'Panel',
    a: ap ? panelLabel(ap) : '—',
    b: bp ? panelLabel(bp) : '—',
    winner,
  };
}

function refreshRow(a: Handheld, b: Handheld): SpecRow | null {
  const ra = a.display?.refreshRateHz;
  const rb = b.display?.refreshRateHz;
  if (ra == null && rb == null) return null;
  return {
    label: 'Refresh rate',
    a: ra != null ? `${ra} Hz` : '—',
    b: rb != null ? `${rb} Hz` : '—',
    winner: null,
  };
}

function resolutionRow(a: Handheld, b: Handheld): SpecRow | null {
  const ra = a.display?.resolution;
  const rb = b.display?.resolution;
  if (!ra && !rb) return null;
  return { label: 'Resolution', a: ra ?? '—', b: rb ?? '—', winner: null };
}

function weightRow(a: Handheld, b: Handheld): SpecRow | null {
  const wa = F.weightGrams(a);
  const wb = F.weightGrams(b);
  if (wa == null && wb == null) return null;
  let winner: 'a' | 'b' | null = null;
  if (wa != null && wb != null && wa !== wb) winner = wa < wb ? 'a' : 'b';
  return {
    label: 'Weight',
    a: wa != null ? `${wa} g` : '—',
    b: wb != null ? `${wb} g` : '—',
    winner,
  };
}

function batteryRow(a: Handheld, b: Handheld): SpecRow | null {
  const ba = F.batteryWh(a);
  const bb = F.batteryWh(b);
  if (ba == null && bb == null) return null;
  let winner: 'a' | 'b' | null = null;
  if (ba != null && bb != null && ba !== bb) winner = ba > bb ? 'a' : 'b';
  return {
    label: 'Battery',
    a: ba != null ? `${ba} Wh` : '—',
    b: bb != null ? `${bb} Wh` : '—',
    winner,
  };
}

function apuRow(a: Handheld, b: Handheld): SpecRow | null {
  const aa = headlineConfig(a)?.apu?.model;
  const ab = headlineConfig(b)?.apu?.model;
  if (!aa && !ab) return null;
  return { label: 'APU', a: aa ?? '—', b: ab ?? '—', winner: null };
}

function tdpRow(a: Handheld, b: Handheld): SpecRow | null {
  const ta = F.maxTdpW(a);
  const tb = F.maxTdpW(b);
  if (ta == null && tb == null) return null;
  return {
    label: 'Max TDP',
    a: ta != null ? `${ta} W` : '—',
    b: tb != null ? `${tb} W` : '—',
    winner: null,
  };
}

function hallStickRow(a: Handheld, b: Handheld): SpecRow | null {
  const av = a.controls?.hallSticks;
  const bv = b.controls?.hallSticks;
  if (av === undefined && bv === undefined) return null;
  const fmt = (v: typeof av) => (v === true ? 'Yes' : v === false ? 'No' : v === 'unknown' ? 'Unknown' : '—');
  const aBool = F.hasHallSticks(a);
  const bBool = F.hasHallSticks(b);
  let winner: 'a' | 'b' | null = null;
  if (aBool !== bBool) winner = aBool ? 'a' : 'b';
  return { label: 'Hall-effect sticks', a: fmt(av), b: fmt(bv), winner };
}

function trackpadRow(a: Handheld, b: Handheld): SpecRow | null {
  const av = a.controls?.trackpads;
  const bv = b.controls?.trackpads;
  if (!av && !bv) return null;
  const aBool = F.hasTrackpads(a);
  const bBool = F.hasTrackpads(b);
  let winner: 'a' | 'b' | null = null;
  if (aBool !== bBool) winner = aBool ? 'a' : 'b';
  return {
    label: 'Trackpads',
    a: av ?? (aBool ? 'Yes' : 'No'),
    b: bv ?? (bBool ? 'Yes' : 'No'),
    winner,
  };
}

function gyroRow(a: Handheld, b: Handheld): SpecRow | null {
  const av = a.controls?.gyro;
  const bv = b.controls?.gyro;
  if (av === undefined && bv === undefined) return null;
  const fmt = (v: typeof av) => (v === true ? 'Yes' : v === false ? 'No' : v === 'unknown' ? 'Unknown' : '—');
  return { label: 'Gyro', a: fmt(av), b: fmt(bv), winner: null };
}

/**
 * Row-by-row spec diff for the comparison table. Only includes a row if at
 * least one side has the value; `winner` is `null` when there's no
 * objective direction, or the values are equal/unknown.
 */
export function buildSpecRows(a: Handheld, b: Handheld): SpecRow[] {
  const rows: Array<SpecRow | null> = [
    priceRow(a, b),
    osRow(a, b),
    screenRow(a, b),
    panelRow(a, b),
    refreshRow(a, b),
    resolutionRow(a, b),
    weightRow(a, b),
    batteryRow(a, b),
    apuRow(a, b),
    tdpRow(a, b),
    hallStickRow(a, b),
    trackpadRow(a, b),
    gyroRow(a, b),
  ];
  return rows.filter((r): r is SpecRow => r != null);
}
