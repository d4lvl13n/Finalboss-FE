// Starfield — assembled + validated ONCE at module load. A malformed or unsourced
// record throws here and fails the build (see validate.ts). This barrel is the
// only thing registry.ts imports. looter_shooter blueprint: Weapons are the
// tiered roster (single PvE 'Overall' axis — no PvP); Companions/Ships/Builds/
// Powers are collections; Skills/ship-building/outposts/NG+ are systems.

import { validateGameData } from '@/app/lib/game-hub/validate';
import type { GameData, HubTimelineEvent, ReadNext } from '@/app/lib/game-hub/types';
import { GAME } from './game';
import { WEAPONS } from './weapons';
import { SYSTEMS } from './systems';
import { COLLECTIONS } from './collections';
import { FAQ, BEGINNER } from './guides';

const IGDB = 'https://www.igdb.com/games/starfield';
const UESP = 'https://en.uesp.net/wiki/Starfield';

const TIMELINE: HubTimelineEvent[] = [
  {
    date: '2026-04-13',
    title: 'Starfield launches on PlayStation 5 — a rocky port that Bethesda follows with hotfixes',
    kind: 'update',
    sources: ['https://finalboss.io/starfield-best-ps5-settings-guide-graphics-hdr-controls'],
  },
  {
    date: '2026-04-12',
    title: 'Terran Armada ("Expansion 2") revealed — new endgame content, ship parts and builds',
    kind: 'event',
    sources: ['https://finalboss.io/starfield-terran-armada-dlc-complete-overview-whats-new'],
  },
  {
    date: '2026-04-11',
    title: 'Free Lanes update reshapes space travel (cruise mode) and the weapon/ship meta',
    kind: 'update',
    sources: ['https://finalboss.io/starfield-best-ships-in-2026-after-free-lanes'],
  },
  {
    date: '2024-09-30',
    title: 'Shattered Space story expansion released — the Va\'ruun homeworld of Oborum Prime',
    kind: 'update',
    sources: [UESP],
  },
  {
    date: '2023-09-06',
    title: 'Starfield launches on PC and Xbox Series X|S',
    kind: 'update',
    sources: [IGDB],
  },
];

const ARTICLES: ReadNext[] = [
  { title: 'Starfield Best Ships in 2026 (After Free Lanes)', url: 'https://finalboss.io/starfield-best-ships-in-2026-after-free-lanes', kind: 'tier_list' },
  { title: 'Starfield Best Weapons After Free Lanes (Superior & Exceptional)', url: 'https://finalboss.io/starfield-best-weapons-after-free-lanes-superior-exceptional', kind: 'tier_list' },
  { title: 'Starfield Best Builds in 2026 — 5 Meta Setups', url: 'https://finalboss.io/starfield-best-builds-in-2026-5-meta-setups', kind: 'guide' },
  { title: 'Starfield Terran Armada DLC — Complete Overview', url: 'https://finalboss.io/starfield-terran-armada-dlc-complete-overview-whats-new', kind: 'article' },
  { title: 'Starfield How to Master New Game Plus', url: 'https://finalboss.io/starfield-how-to-master-new-game-plus-in', kind: 'guide' },
  { title: 'Starfield How to Build Efficient Outposts (Free Lanes)', url: 'https://finalboss.io/starfield-how-to-build-efficient-outposts-free-lanes', kind: 'guide' },
  { title: 'Starfield X-Tech Guide — Farming Rerolls & Exotic Gear', url: 'https://finalboss.io/starfield-x-tech-guide-farming-rerolls-exotic-gear', kind: 'guide' },
  { title: 'Starfield Best PS5 Settings — Graphics, HDR & Controls', url: 'https://finalboss.io/starfield-best-ps5-settings-guide-graphics-hdr-controls', kind: 'guide' },
];

export const STARFIELD: GameData = validateGameData({
  game: GAME,
  blueprint: 'looter_shooter',
  // Starfield is PvE-only: one "Overall" weapon axis, not the looter_shooter PvP default.
  tierAxes: [{ key: 'overall', label: 'Overall', attr: 'pveTier' }],
  units: WEAPONS,
  codes: { lastVerified: '2026-07-16', entries: [] },
  systems: SYSTEMS,
  collections: COLLECTIONS,
  timeline: TIMELINE,
  articles: ARTICLES,
  faq: FAQ,
  beginner: BEGINNER,
  intros: {
    units:
      'The Starfield weapon meta, ranked Overall for the current 2026 game (after Free Lanes and X-Tech gear). Tap a weapon for its damage type, best mods and where it lands.',
    systems: 'The core progression systems — skills, ship building, outposts, crafting and New Game Plus.',
    updates: 'Launch, expansions and the major 2026 updates — newest first.',
  },
});
