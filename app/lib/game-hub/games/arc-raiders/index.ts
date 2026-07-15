// ARC Raiders — assembled + validated ONCE at module load. A malformed or
// unsourced record throws here and fails the build (see validate.ts). This
// barrel is the only thing registry.ts imports.

import { validateGameData } from '@/app/lib/game-hub/validate';
import type { GameData, HubTimelineEvent } from '@/app/lib/game-hub/types';
import { GAME } from './game';
import { WEAPONS } from './weapons';
import { SYSTEMS } from './systems';
import { COLLECTIONS } from './collections';
import { FAQ, BEGINNER } from './guides';

// Newest-first. Source timeline is GPBot-pool (FinalBoss) + IGDB derived;
// provenance is expressed as valid URLs (the pool's item titles/IGDB references
// aren't citable links, so they resolve to the IGDB game page or FinalBoss host).
const IGDB = 'https://www.igdb.com/games/arc-raiders';
const FB = 'https://backend.finalboss.io/';

const TIMELINE: HubTimelineEvent[] = [
  {
    date: '2026-07-07',
    title:
      "Update 1.36.0 adds separate Solo/Duo/Trio playstyle tracking ('one of the most requested matchmaking features')",
    kind: 'update',
    sources: [FB],
  },
  {
    date: '2026-06-24',
    title: 'Embark patches out dupe glitches and adds anti-cheat (Denuvo) hardening',
    kind: 'update',
    sources: [FB],
  },
  {
    date: '2026-06-16',
    title: 'Forgotten Relics limited-time event (Converging Paths project / merit farm)',
    kind: 'event',
    sources: ['https://backend.finalboss.io/arc-raiders-how-to-complete-the-forgotten-relics/'],
  },
  {
    date: '2025-11-11',
    title:
      'Early reception: outpaces Helldivers 2 on Steam and reviews well (~20-hour tense, fair experience)',
    kind: 'update',
    sources: [FB],
  },
  {
    date: '2025-10-30',
    title: 'ARC Raiders launches on PC, PlayStation 5 and Xbox Series X|S',
    kind: 'update',
    sources: [IGDB],
  },
];

export const ARC_RAIDERS: GameData = validateGameData({
  game: GAME,
  blueprint: 'looter_shooter',
  units: WEAPONS,
  codes: { lastVerified: '2025-11-01', entries: [] },
  systems: SYSTEMS,
  collections: COLLECTIONS,
  timeline: TIMELINE,
  articles: [],
  faq: FAQ,
  beginner: BEGINNER,
  intros: {
    units:
      'The weapon meta — ranked Overall and for PvP. Rarities run Common→Legendary; tap a weapon for its type and role.',
    systems: 'The core extraction loop and progression systems.',
    updates: 'Recent updates and seasons.',
  },
});
