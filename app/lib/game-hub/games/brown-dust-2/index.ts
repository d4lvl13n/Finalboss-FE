// Brown Dust 2 — assembled + validated ONCE at module load. A malformed or
// unsourced record throws here and fails the build (see validate.ts). This
// barrel is the only thing registry.ts imports.

import { validateGameData } from '@/app/lib/game-hub/validate';
import type { GameData, HubTimelineEvent } from '@/app/lib/game-hub/types';
import { GAME } from './game';
import { CHARACTERS } from './characters';
import { CODES } from './codes';
import { SYSTEMS } from './systems';
import { FAQ, BEGINNER } from './guides';

const TIMELINE: HubTimelineEvent[] = [
  {
    date: '2026-07-02',
    title: "'The Soul-Wager' — Content Pack #10 (new PvE combat mode) released",
    kind: 'update',
    sources: ['https://browndust2.miraheze.org/wiki/The_Soul-Wager'],
  },
  {
    date: '2026-03-16',
    title: 'Brown Dust 2 ~1000-day anniversary coverage',
    kind: 'event',
    sources: ['https://4gamer.net/games/665/G066579/20260310036'],
  },
  {
    date: '2026-01-12',
    title:
      'Steam-alignment censorship of outfits and cutscenes announced, then reversed after community backlash',
    kind: 'update',
    sources: [
      'https://www.escapistmagazine.com/news-brown-dust-2-fans-got-so-irate-over-gooning-censorship-the-developers-have-walked-it-back/',
      'https://dotesports.com/general/news/browndust2-censorship-backlash',
    ],
  },
  {
    date: '2023-06-22',
    title: 'Brown Dust 2 global launch (Android, iOS, PC)',
    kind: 'update',
    sources: ['https://www.igdb.com/games/brown-dust-ii'],
  },
];

export const BROWN_DUST_2: GameData = validateGameData({
  game: GAME,
  blueprint: 'gacha',
  classes: CHARACTERS,
  codes: CODES,
  systems: SYSTEMS,
  timeline: TIMELINE,
  articles: [],
  intros: {
    units:
      'Brown Dust 2 is built around costumes — each character has several pullable costumes, and each costume is its own unit with a distinct kit, which is why tier lists rank costumes rather than base characters. Here are the meta-relevant units by rarity and role.',
    tierList:
      "Where each unit lands across all four axes — Story, Boss Raid (Fiend), Mirror War (PvP) and Guild Raid. Switch tabs: a top Story carry isn't automatically a raid or PvP pick. The raid tabs cover the units a source explicitly ranks for that content.",
    codes:
      'Redeem codes for free Dia and resources. Brown Dust 2 codes are short-lived — they usually expire within about a month, and new ones drop around events via the official site and Discord.',
    systems:
      'The core systems that shape a roster: the costume-based gacha and reroll, plus the Story/PvE campaign and asynchronous Mirror War PvP.',
    updates: 'Recent launches, banners and anniversary events.',
  },
  beginner: BEGINNER,
  faq: FAQ,
});
