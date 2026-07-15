// Grand Theft Auto VI — assembled + validated ONCE at module load. A malformed
// or unsourced record throws here and fails the build (see validate.ts). This
// barrel is the only thing registry.ts imports. open_world blueprint: no tiers,
// no codes, no dungeons, no teams.

import { validateGameData } from '@/app/lib/game-hub/validate';
import type { GameData, HubTimelineEvent } from '@/app/lib/game-hub/types';
import { GAME } from './game';
import { CHARACTERS } from './units';
import { SYSTEMS } from './systems';
import { FAQ } from './guides';

// The official reveal timeline, newest-first. Every date is a full ISO date.
const TIMELINE: HubTimelineEvent[] = [
  {
    date: '2026-11-19',
    title: 'Scheduled launch of Grand Theft Auto VI on PlayStation 5 and Xbox Series X|S',
    kind: 'event',
    sources: [
      'https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026',
      'https://www.xbox.com/en-US/games/grand-theft-auto-vi',
    ],
  },
  {
    date: '2026-06-25',
    title: 'Pre-orders open; Standard ($79.99) and Ultimate ($99.99) editions confirmed',
    kind: 'event',
    sources: [
      'https://www.rockstargames.com/newswire/article/5171972o3ak5oa/pre-order-grand-theft-auto-vi-on-june-25',
      'https://www.gtaboom.com/gta-6-price-standard-ultimate-edition-f1bc',
    ],
  },
  {
    date: '2025-11-06',
    title: 'Rockstar delays GTA VI from May 26, 2026 to November 19, 2026',
    kind: 'update',
    sources: [
      'https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026',
      'https://x.com/RockstarGames/status/1986540361011880167',
    ],
  },
  {
    date: '2025-05-06',
    title:
      'GTA VI Trailer 2 released, focusing on protagonists Jason and Lucia; release window set to May 26, 2026',
    kind: 'event',
    sources: [
      'https://www.gamingbible.com/news/gta-6-trailer-2-release-921500-20250506',
      'https://www.rockstargames.com/newswire/article/258aa538o412ok/grand-theft-auto-vi-is-now-coming-may-26-2026',
    ],
  },
  {
    date: '2023-12-04',
    title:
      'GTA VI Trailer 1 released (a day early after a leak; officially planned for Dec 5), confirming the return to Vice City',
    kind: 'event',
    sources: [
      'https://www.rockstargames.com/newswire/article/259813k455k581/trailer-1-tuesday-december-5-9am-et',
      'https://www.forbes.com/sites/paultassi/2023/12/01/rockstar-reveals-gta-6-trailer-release-date-and-time-in-december/',
    ],
  },
];

export const GRAND_THEFT_AUTO_VI: GameData = validateGameData({
  game: GAME,
  blueprint: 'open_world',
  // URL slug is `gta-6` (SEO equity); the KG entity is keyed on the IGDB name.
  knowledgeSlug: 'grand-theft-auto-vi',
  units: CHARACTERS,
  codes: { lastVerified: '2026-07-15', entries: [] },
  systems: SYSTEMS,
  timeline: TIMELINE,
  articles: [],
  faq: FAQ,
  intros: {
    units:
      'The confirmed cast so far — dual protagonists Lucia and Jason, plus the supporting characters Rockstar has officially named.',
    systems:
      "The confirmed world and details from Rockstar's trailers and official material — the state of Leonida, Vice City and the features shown so far. Leaks and speculation are deliberately excluded.",
    updates:
      "The official reveal timeline — trailers and Rockstar's date announcements.",
  },
});
