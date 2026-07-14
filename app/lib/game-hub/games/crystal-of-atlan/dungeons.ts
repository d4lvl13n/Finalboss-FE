import type { DungeonRecord } from '@/app/lib/game-hub/types';

const FB_TIER = 'https://finalboss.io/crystal-of-atlan-tier-list-2025-best-classes';
const FB_REVIEW = 'https://finalboss.io/crystal-of-atlan-surprised-me-flashy-air-combat';

// Named instances aren't given in sources; captured generically rather than
// fabricating boss/dungeon names.
export const DUNGEONS: DungeonRecord[] = [
  {
    slug: 'new-dungeon-may-2026',
    name: 'May 2026 Anniversary Dungeon',
    kind: 'dungeon',
    summary:
      'A new dungeon opened in the May 2026 update that also added events and hyped the first anniversary and next class (not named in the source).',
    sources: [
      'https://massivelyop.com/2026/05/11/crystal-of-atlan-adds-new-events-opens-a-new-dungeon-and-hypes-its-next-class-and-first-anniversary',
    ],
  },
  {
    slug: 'world-bosses',
    name: 'World Bosses & World Events',
    kind: 'world_boss',
    summary:
      'Open-world bosses and world events are part of the PvE farming loop; top classes like Scytheguard can solo them (specific bosses not named in sources).',
    sources: [FB_TIER, FB_REVIEW],
  },
  {
    slug: 'coop-dungeons-raids',
    name: 'Co-op Dungeons & Raids',
    kind: 'dungeon',
    summary:
      'Team-based dungeons and raids mix traditional boss mechanics (AoE zones, adds, stagger checks) with the game’s aerial combat; the core group PvE content.',
    sources: [FB_REVIEW],
  },
];
