// Diablo IV — assembled + validated ONCE at module load. A malformed or
// unsourced record throws here and fails the build (see validate.ts). This
// barrel is the only thing registry.ts imports.

import { validateGameData } from '@/app/lib/game-hub/validate';
import type { GameData } from '@/app/lib/game-hub/types';
import { GAME } from './game';
import { CLASSES } from './classes';
import { CODES } from './codes';
import { SYSTEMS } from './systems';
import { DUNGEONS } from './dungeons';
import { FAQ, BEGINNER } from './guides';

export const DIABLO_IV: GameData = validateGameData({
  game: GAME,
  blueprint: 'action_rpg',
  // URL slug is `diablo-4` (SEO equity); the KG entity is keyed on the IGDB name.
  knowledgeSlug: 'diablo-iv',
  units: CLASSES,
  codes: CODES,
  dungeons: DUNGEONS,
  systems: SYSTEMS,
  timeline: [
    {
      date: '2026-06-30',
      title: 'Season 14 — Season of Death Awakening launches (Pandemonium Ruptures, Solo Self-Found, Overwatch crossover)',
      kind: 'event',
      sources: [
        'https://mobalytics.gg/diablo-4/guides/diablo-4-season-14-death-awakening',
        'https://gamerant.com/diablo-4-season-14-release-time-global-when-come-out/',
      ],
    },
    {
      date: '2026-04-28',
      title: 'Lord of Hatred expansion released — adds Paladin & Warlock classes, the Skovos region, Horadric Cube crafting and 12 Torment tiers',
      kind: 'class_release',
      sources: [
        'https://en.wikipedia.org/wiki/Diablo_IV:_Lord_of_Hatred',
        'https://diablo4.blizzard.com/en-us/lord-of-hatred',
        'https://news.xbox.com/en-us/2025/12/16/diablo-iv-paladin-class-lord-of-hatred/',
      ],
    },
    {
      date: '2025-12-11',
      title: 'Lord of Hatred expansion announced at The Game Awards 2025',
      kind: 'update',
      sources: ['https://en.wikipedia.org/wiki/Diablo_IV:_Lord_of_Hatred'],
    },
    {
      date: '2025-09-23',
      title: 'Season 10 — Season of Infernal Chaos launches (Chaos Powers, Infernal Hordes revamp)',
      kind: 'event',
      sources: [
        'https://www.icy-veins.com/d4/news/diablo-4-season-10-season-of-infernal-chaos-release-times/',
        'https://gamerant.com/diablo-4-season-10-update-patch-notes-september-23/',
      ],
    },
    {
      date: '2024-10-08',
      title: 'Vessel of Hatred expansion released — adds the Spiritborn class, the Nahantu region and Mercenaries',
      kind: 'class_release',
      sources: [
        'https://en.wikipedia.org/wiki/Diablo_IV:_Vessel_of_Hatred',
        'https://www.rpgsite.net/news/15942-diablo-iv-vessel-hatred-expansion-starts-journey-into-new-nahantu-region-on-october-8',
      ],
    },
    {
      date: '2023-06-06',
      title: 'Diablo IV launches worldwide on PC, PlayStation and Xbox',
      kind: 'update',
      sources: [
        'https://backend.finalboss.io/wp-json/igdb/v1/game/125165',
        'https://diablo4.blizzard.com/en-us/',
      ],
    },
  ],
  articles: [],
  faq: FAQ,
  beginner: BEGINNER,
  intros: {
    tierList:
      'Where each class currently sits for Season 14 (Season of Death Awakening) endgame. These ratings track the live meta and shift with balance patches, so treat them as a starting point, not gospel.',
    units:
      'Diablo IV has eight classes: the five base-game classes plus the Spiritborn (Vessel of Hatred) and the Paladin and Warlock (Lord of Hatred). Open any class for its role, playstyle and current tier.',
    codes:
      'Diablo IV has no promotional code system — unlike Diablo Immortal, the PC/console game ships no in-game code redemption. This section is honestly empty rather than padded with fake codes.',
    dungeons: 'The repeatable endgame loop — Nightmare Dungeons, Helltide, The Pit, Infernal Hordes and open-world World Bosses.',
    systems:
      'The progression and live-service systems that shape a build, from the Paragon Board and Aspect itemization to Torment difficulty, seasons and Renown.',
    updates: 'Recent seasons and expansions — newest first.',
  },
});
