// Zenless Zone Zero — assembled + validated ONCE at module load. A malformed or
// unsourced record throws here and fails the build (see validate.ts). This
// barrel is the only thing registry.ts imports.

import { validateGameData } from '@/app/lib/game-hub/validate';
import type { GameData, HubTimelineEvent } from '@/app/lib/game-hub/types';
import { GAME } from './game';
import { CHARACTERS } from './characters';
import { CODES } from './codes';
import { SYSTEMS } from './systems';
import { FAQ, BEGINNER, TEAMS } from './guides';

const TIMELINE: HubTimelineEvent[] = [
  {
    date: '2026-06-17',
    title:
      "Version 3.0 'Sleepwalker' — Season 3 launch: debuts on Steam, opens the sky city of Roscaelifer, adds the Wind attribute and S-Rank Agents Velina and Ye Shunguang",
    kind: 'update',
    sources: [
      'https://www.cbr.com/zenless-zone-zero-season-3-steam-release/',
      'https://www.gosugamers.net/news/78590-everything-announced-for-zenless-zone-zero-3-0-s-new-banners-new-region-and-free-s-rank-agent',
      'https://game8.co/games/Zenless-Zone-Zero/archives/595942',
    ],
  },
  {
    date: '2026-05-06',
    title: "Version 2.8 'New Eridan Sunset' update released",
    kind: 'update',
    sources: ['https://www.igdb.com/games/zenless-zone-zero-update-2-dot-8-new-eridan-sunset--1'],
  },
  {
    date: '2024-07-04',
    title: 'Zenless Zone Zero global launch (PC, iOS, Android, PlayStation 5)',
    kind: 'update',
    sources: [
      'https://www.igdb.com/games/zenless-zone-zero',
      'https://www.cbr.com/zenless-zone-zero-season-3-steam-release/',
    ],
  },
];

export const ZENLESS_ZONE_ZERO: GameData = validateGameData({
  game: GAME,
  blueprint: 'gacha',
  // ZZZ has no arena PvP; its meta axis is endgame (Shiyu Defense / Deadly
  // Assault) — override the gacha default (BD2's Story/Boss/Mirror War/Guild).
  tierAxes: [{ key: 'endgame', label: 'Endgame', attr: 'pveTier' }],
  units: CHARACTERS,
  codes: CODES,
  systems: SYSTEMS,
  timeline: TIMELINE,
  articles: [],
  intros: {
    units:
      'Zenless Zone Zero builds every team around three Agents — an on-field DPS, a Stunner to break enemy Daze, and a Support to buff and heal. Each Agent has an Attribute (element) and a Specialty (role). Here are the meta-relevant Agents by tier, attribute and role.',
    tierList:
      "Where each Agent lands overall, normalized from the Game8 3.0 tier list: Tier 0 shows as S+, Tier 1+ as S, Tier 1 as A. ZZZ has no arena PvP, so the tier reflects endgame combat content — Shiyu Defense and Deadly Assault — rather than a separate PvP axis.",
    codes:
      'Redeem codes for free Polychromes and upgrade materials. ZENLESSGIFT is a permanent new-player code; the rest are event/livestream codes that expire quickly, so redeem them promptly. Codes are case-sensitive.',
    systems:
      'The core systems that shape a roster: the Signal Search gacha and pity, W-Engines, Drive Discs and Bangboo, plus the endgame modes Shiyu Defense, Deadly Assault and Hollow Zero.',
    updates: 'Recent version updates and seasons.',
    teams:
      'Sourced starter cores built on the DPS + Stunner + Support structure. Tap any Agent to open its page. These are community/tier-list-backed cores — swap pieces for the Agents you actually own.',
  },
  beginner: BEGINNER,
  faq: FAQ,
  teams: TEAMS,
});
