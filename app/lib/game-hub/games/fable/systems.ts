import type { SystemRecord } from '@/app/lib/game-hub/types';

// Fable "What We Know" — the confirmed setting and the confirmed features/details
// Xbox and Playground Games have shown across trailers, the Xbox Developer Direct
// deep dive and official material. Every entry carries at least one source
// (cite-or-drop). Leaks and speculation are deliberately excluded.
export const SYSTEMS: SystemRecord[] = [
  {
    slug: 'albion',
    name: 'Setting: Albion',
    summary:
      'Fable returns to Albion, the fairy-tale world of the series. The reboot presents a fresh take on the land while keeping the storybook tone the franchise is known for.',
    sources: [
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
      'https://www.xbox.com/en-US/games/fable',
    ],
  },
  {
    slug: 'open-world-action-rpg',
    name: 'Open-world action RPG',
    summary:
      'Fable is a third-person, open-world action RPG. Combat blends melee, ranged and magic, and the game is described as a full reimagining of the original rather than a direct sequel.',
    sources: [
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
      'https://www.windowscentral.com/gaming/fable-has-received-a-30-minute-gameplay-deep-dive-and-its-finally-convinced-me-that-its-a-true-reimagining-of-the-original-fable-i-grew-up-with',
    ],
  },
  {
    slug: 'reputation-and-choice',
    name: 'Reputation and choice',
    summary:
      "Choices shape the journey and reputation is central to how the world reacts to you. Xbox's official description: 'each choice shapes your journey, reputation is everything, and fairytale endings are never guaranteed.'",
    sources: [
      'https://www.xbox.com/en-US/games/fable',
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
    ],
  },
  {
    slug: 'customizable-hero',
    name: 'Customizable Hero',
    summary:
      'The player creates a fully customizable Hero (appearance and gender). The story begins in the settlement of Briar Hill before a time jump into adulthood.',
    sources: [
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
      'https://www.windowscentral.com/gaming/fable-has-received-a-30-minute-gameplay-deep-dive-and-its-finally-convinced-me-that-its-a-true-reimagining-of-the-original-fable-i-grew-up-with',
    ],
  },
  {
    slug: 'forzatech-engine',
    name: 'Built on ForzaTech',
    summary:
      "Playground Games builds Fable on ForzaTech, the studio's in-house engine used for the Forza Horizon series, adapted here for an open-world fantasy RPG.",
    sources: [
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
    ],
  },
  {
    slug: 'game-pass-day-one',
    name: 'Game Pass day one',
    summary:
      'Fable is confirmed for Xbox Game Pass on day one, so subscribers can play it at launch on February 23, 2027 without a separate purchase.',
    sources: [
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
      'https://www.vgchartz.com/article/468102/fable-launches-february-23-2027-for-ps5-xbox-series-pc-and-game-pass/',
    ],
  },
  {
    slug: 'multiplatform-launch',
    name: 'Launch on PS5, Xbox and PC',
    summary:
      'Fable launches simultaneously on Xbox Series X|S, PC (Windows) and PlayStation 5. The PS5 version was confirmed at the June 7, 2026 Xbox Games Showcase alongside the February 23, 2027 date.',
    sources: [
      'https://www.pushsquare.com/news/2026/06/fable-gets-ps5-release-date-and-hayley-atwell-in-latest-gameplay-trailer',
      'https://www.gematsu.com/2026/06/fable-launches-february-23-2027',
    ],
  },
  {
    slug: 'development-team',
    name: 'Playground Games with Eidos-Montréal support',
    summary:
      'Fable is developed by Playground Games (the Forza Horizon studio) and published by Xbox Game Studios, with development support from Eidos-Montréal.',
    sources: [
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
      'https://www.igdb.com/games/fable--1',
    ],
  },
];
