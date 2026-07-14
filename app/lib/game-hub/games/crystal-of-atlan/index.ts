// Crystal of Atlan — assembled + validated ONCE at module load. A malformed or
// unsourced record throws here and fails the build (see validate.ts). This
// barrel is the only thing registry.ts imports.

import { validateGameData } from '@/app/lib/game-hub/validate';
import type { GameData } from '@/app/lib/game-hub/types';
import { GAME } from './game';
import { CLASSES } from './classes';
import { CODES } from './codes';
import { SYSTEMS } from './systems';
import { DUNGEONS } from './dungeons';

export const CRYSTAL_OF_ATLAN: GameData = validateGameData({
  game: GAME,
  blueprint: 'action_rpg',
  classes: CLASSES,
  codes: CODES,
  dungeons: DUNGEONS,
  systems: SYSTEMS,
  timeline: [
    {
      date: '2025-10-10',
      title: 'Homestead housing system + B.Duck collaboration',
      kind: 'update',
      sources: ['https://gamespress.com/Crystal-of-Atlan-Launches-Homestead-System-with-BDuck-Collaboration'],
    },
    {
      date: '2026-03-12',
      title: 'New magitech Inventor (発明家) class released in the 2026 roadmap',
      kind: 'class_release',
      sources: [
        'https://massivelyop.com/2026/03/13/crystal-of-atlan-releases-its-new-magitech-inventor-class-as-part-of-its-2026-roadmap',
        'https://pocketgamer.com/crystal-of-atlan/inventor-class-update',
      ],
    },
    {
      date: '2026-05-11',
      title: 'New events, a new dungeon, and first-anniversary hype',
      kind: 'update',
      sources: [
        'https://massivelyop.com/2026/05/11/crystal-of-atlan-adds-new-events-opens-a-new-dungeon-and-hypes-its-next-class-and-first-anniversary',
      ],
    },
    {
      date: '2026-05-21',
      title: 'NieR:Automata collaboration + new Oni-blade (鬼刃) class',
      kind: 'collab',
      sources: [
        'https://noisypixel.net/nier-automata-crystal-atlan-yorha-collaboration',
        'https://4gamer.net/games/727/G072787/20260521034',
      ],
    },
  ],
  articles: [
    {
      title: 'Crystal of Atlan Review: flashy air combat, fair F2P, but a grindy heart',
      url: 'https://finalboss.io/crystal-of-atlan-surprised-me-flashy-air-combat',
      kind: 'review',
    },
    {
      title: 'You’re Picking the Wrong Crystal of Atlan Class — Here’s What Actually Works',
      url: 'https://finalboss.io/youre-picking-the-wrong-crystal-of-atlan-class',
      kind: 'guide',
    },
    {
      title: 'Crystal of Atlan Tier List (2025): Best Classes for PvE & PvP',
      url: 'https://finalboss.io/crystal-of-atlan-tier-list-2025-best-classes',
      kind: 'tier_list',
    },
  ],
});
