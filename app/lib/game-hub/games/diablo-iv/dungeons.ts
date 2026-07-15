import type { DungeonRecord } from '@/app/lib/game-hub/types';

// The repeatable endgame activity loop. DungeonRecord only distinguishes
// 'dungeon' vs 'world_boss', so zone events (Helltide) and roguelite modes
// (Infernal Hordes, The Pit) are filed generically as 'dungeon'.
const WOWHEAD_ENDGAME = 'https://www.wowhead.com/diablo-4/guide/end-game-overview-endgame';
const MAXROLL_ENDGAME = 'https://maxroll.gg/d4/meta/endgame-progression';
const MAXROLL_HORDES = 'https://maxroll.gg/d4/resources/infernal-hordes';
const FEXTRA_ENDGAME = 'https://diablo4.wiki.fextralife.com/Endgame+Guide';

export const DUNGEONS: DungeonRecord[] = [
  {
    slug: 'nightmare-dungeons',
    name: 'Nightmare Dungeons',
    kind: 'dungeon',
    summary:
      'Endgame dungeons unlocked with Nightmare Sigils that raise difficulty and layer on affixes/challenge conditions. The main route for leveling Glyphs on the Paragon Board and farming targeted loot.',
    sources: [WOWHEAD_ENDGAME, MAXROLL_ENDGAME],
  },
  {
    slug: 'helltide',
    name: 'Helltide',
    kind: 'dungeon',
    summary:
      'A rotating open-world event where zones become demon-corrupted; players farm Aberrant Cinders and Threat levels for reward chests, materials and Hellborne/Hellwyrm spawns. A core Paragon and gear farm.',
    sources: [WOWHEAD_ENDGAME, MAXROLL_ENDGAME],
  },
  {
    slug: 'the-pit',
    name: 'The Pit of Artificers',
    kind: 'dungeon',
    summary:
      'A timed, tiered dungeon opened with Runeshards. It is the primary source of Masterworking materials and the main gear-check ladder — clearing higher Pit tiers proves your build against escalating monster power.',
    sources: [WOWHEAD_ENDGAME, MAXROLL_ENDGAME],
  },
  {
    slug: 'infernal-hordes',
    name: 'Infernal Hordes',
    kind: 'dungeon',
    summary:
      'A wave-survival roguelite entered with an Infernal Compass: fight escalating waves, pick Boons and Banes between them, then face a final boss (e.g. Bartuc) to open Spoils of Hell reward chests. A top source of gold and gear.',
    sources: [MAXROLL_HORDES, WOWHEAD_ENDGAME],
  },
  {
    slug: 'world-bosses',
    name: 'World Bosses',
    kind: 'world_boss',
    summary:
      'Large open-world bosses (Ashava, Avarice, Wandering Death and others) that spawn on a timer in shared zones. Groups converge to burn them down within a limit for guaranteed high-tier loot; a staple cross-play group activity.',
    sources: [WOWHEAD_ENDGAME, FEXTRA_ENDGAME],
  },
];
