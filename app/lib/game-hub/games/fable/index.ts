// Fable — assembled + validated ONCE at module load. A malformed or unsourced
// record throws here and fails the build (see validate.ts). This barrel is the
// only thing registry.ts imports. open_world blueprint: no tiers, no codes, no
// dungeons, no teams. Fable is unreleased — confirmed facts only.

import { validateGameData } from '@/app/lib/game-hub/validate';
import type { GameData, HubTimelineEvent } from '@/app/lib/game-hub/types';
import { GAME } from './game';
import { CHARACTERS } from './units';
import { SYSTEMS } from './systems';
import { FAQ } from './guides';

// The official reveal timeline, newest-first. Every date is a full ISO date.
const TIMELINE: HubTimelineEvent[] = [
  {
    date: '2027-02-23',
    title: 'Scheduled launch of Fable on Xbox Series X|S, PC and PlayStation 5 (Xbox Game Pass day one)',
    kind: 'event',
    sources: [
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
      'https://www.gematsu.com/2026/06/fable-launches-february-23-2027',
    ],
  },
  {
    date: '2026-06-07',
    title:
      'Xbox Games Showcase release-date trailer: Fable dated February 23, 2027, PlayStation 5 version confirmed, Hayley Atwell revealed as villain Isabel',
    kind: 'event',
    sources: [
      'https://www.pushsquare.com/news/2026/06/fable-gets-ps5-release-date-and-hayley-atwell-in-latest-gameplay-trailer',
      'https://www.gematsu.com/2026/06/fable-launches-february-23-2027',
    ],
  },
  {
    date: '2026-05-29',
    title: 'Xbox’s Matt Booty announces Fable moves from 2026 to February 2027',
    kind: 'update',
    sources: [
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
    ],
  },
  {
    date: '2026-01-22',
    title:
      'Xbox Developer Direct: roughly 30-minute Fable gameplay deep dive shown, with a then-planned 2026 window',
    kind: 'event',
    sources: [
      'https://www.windowscentral.com/gaming/fable-has-received-a-30-minute-gameplay-deep-dive-and-its-finally-convinced-me-that-its-a-true-reimagining-of-the-original-fable-i-grew-up-with',
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
    ],
  },
  {
    date: '2024-06-09',
    title:
      'Xbox Games Showcase: first gameplay trailer (featuring Matt King as Humphry), with a then-planned 2025 release window',
    kind: 'event',
    sources: [
      'https://gameinformer.com/xbox-showcase/2024/06/09/playground-games-fable-gets-2025-release-window-in-first-gameplay-trailer',
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
    ],
  },
  {
    date: '2023-06-11',
    title: 'Xbox Games Showcase: first in-engine Fable trailer shown',
    kind: 'event',
    sources: [
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
      'https://www.dsogaming.com/videotrailer-news/take-a-look-at-the-first-official-gameplay-footage-for-fable/',
    ],
  },
  {
    date: '2020-07-23',
    title: 'Fable reboot announced at the Xbox Games Showcase',
    kind: 'event',
    sources: [
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
    ],
  },
];

export const FABLE: GameData = validateGameData({
  game: GAME,
  blueprint: 'open_world',
  // URL slug is `fable`; the GPBot Knowledge entity is keyed `fable-1`.
  knowledgeSlug: 'fable-1',
  units: CHARACTERS,
  codes: { lastVerified: '2026-07-15', entries: [] },
  systems: SYSTEMS,
  timeline: TIMELINE,
  articles: [],
  faq: FAQ,
  intros: {
    units:
      'The confirmed cast so far — the customizable Hero plus the supporting and antagonist roles Xbox and Playground Games have officially revealed.',
    systems:
      "The confirmed world and details from Xbox and Playground Games' trailers, the Xbox Developer Direct deep dive and official material — the Albion setting and the features shown so far. Leaks and speculation are deliberately excluded.",
    updates:
      'The official reveal timeline — announcements, trailers and Xbox’s date changes.',
  },
});
