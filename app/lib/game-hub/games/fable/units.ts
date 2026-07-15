import type { ClassRecord } from '@/app/lib/game-hub/types';

// Fable confirmed cast. open_world characters carry no meta — only
// slug/name/role/sources. Every entry is an officially revealed character with
// at least one source (cite-or-drop). The cast is small: Fable is unreleased and
// the protagonist is a customizable, unnamed Hero.
export const CHARACTERS: ClassRecord[] = [
  {
    slug: 'the-hero',
    name: 'The Hero',
    role: 'Customizable player protagonist',
    sources: [
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
      'https://www.windowscentral.com/gaming/fable-has-received-a-30-minute-gameplay-deep-dive-and-its-finally-convinced-me-that-its-a-true-reimagining-of-the-original-fable-i-grew-up-with',
    ],
  },
  {
    slug: 'humphry',
    name: 'Humphry',
    role: 'Former Hero of Albion (played by Matt King)',
    sources: [
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
      'https://fable.fandom.com/wiki/Playground:Humphry',
      'https://gameinformer.com/xbox-showcase/2024/06/09/playground-games-fable-gets-2025-release-window-in-first-gameplay-trailer',
    ],
  },
  {
    slug: 'dave',
    name: 'Dave',
    role: 'Giant (played by Richard Ayoade)',
    sources: [
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
      'https://www.gosugamers.net/entertainment/news/78572-fable-release-date-confirmed-for-23-february-2027-cast-lineup-revealed',
    ],
  },
  {
    slug: 'isabel',
    name: 'Isabel',
    role: 'Antagonist (played by Hayley Atwell)',
    sources: [
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
      'https://www.pushsquare.com/news/2026/06/fable-gets-ps5-release-date-and-hayley-atwell-in-latest-gameplay-trailer',
    ],
  },
];
