import type { ClassRecord } from '@/app/lib/game-hub/types';

// Fable confirmed cast. open_world characters carry no meta — only
// slug/name/role/overview/sources. Every entry is an officially revealed
// character with at least one source (cite-or-drop). The cast is small: Fable is
// unreleased and the protagonist is a customizable, unnamed Hero. No builds,
// tiers, skills, or gameplay assessments — none exist for an unreleased game.
export const CHARACTERS: ClassRecord[] = [
  {
    slug: 'the-hero',
    name: 'The Hero',
    role: 'Customizable player protagonist',
    overview:
      "The player-controlled protagonist, officially named the Hero of Briar Hill — an ordinary person raised in a sleepy, forest-bounded village and made extraordinary by fate. Xbox and Playground Games confirm the Hero is fully customizable and sits at the center of Albion's story.",
    coreMechanic: 'Full character customization (confirmed by Xbox Wire)',
    sources: [
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
      'https://news.xbox.com/en-us/2026/06/07/fable-cast-list-new-trailer-hayley-atwell-xbox-games-showcase-2026/',
      'https://www.windowscentral.com/gaming/fable-has-received-a-30-minute-gameplay-deep-dive-and-its-finally-convinced-me-that-its-a-true-reimagining-of-the-original-fable-i-grew-up-with',
    ],
  },
  {
    slug: 'humphry',
    name: 'Humphry',
    role: 'Former Hero of Albion (played by Matt King)',
    overview:
      "Officially described by Xbox as Albion's greatest Hero — or at least he was: arrogant, charming and equally happy with a mace or a pint in his hand. A former Hero drawn out of retirement to aid the player character, Humphry is portrayed by Matt King.",
    sources: [
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
      'https://news.xbox.com/en-us/2026/06/07/fable-cast-list-new-trailer-hayley-atwell-xbox-games-showcase-2026/',
      'https://fable.fandom.com/wiki/Playground:Humphry',
      'https://gameinformer.com/xbox-showcase/2024/06/09/playground-games-fable-gets-2025-release-window-in-first-gameplay-trailer',
    ],
  },
  {
    slug: 'dave',
    name: 'Dave',
    role: 'Giant (played by Richard Ayoade)',
    overview:
      "Dave the Giant, revealed in an official Xbox Games Showcase trailer and portrayed by Richard Ayoade. Xbox describes him as thinking of himself as a towering intellectual surrounded by idiots — even before he accidentally turns himself into a giant.",
    sources: [
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
      'https://news.xbox.com/en-us/2026/06/07/fable-cast-list-new-trailer-hayley-atwell-xbox-games-showcase-2026/',
      'https://www.gosugamers.net/entertainment/news/78572-fable-release-date-confirmed-for-23-february-2027-cast-lineup-revealed',
    ],
  },
  {
    slug: 'isabel',
    name: 'Isabel',
    role: 'Antagonist (played by Hayley Atwell)',
    overview:
      "Officially framed by Xbox as the game's villain and one of the story's central antagonists, revealed in the June 2026 Xbox Games Showcase trailer and portrayed by Hayley Atwell. Xbox describes her as a driven, powerful Hero on a quest to make right a tragic injustice, having turned her grief into determination.",
    sources: [
      'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
      'https://news.xbox.com/en-us/2026/06/07/fable-cast-list-new-trailer-hayley-atwell-xbox-games-showcase-2026/',
      'https://www.pushsquare.com/news/2026/06/fable-gets-ps5-release-date-and-hayley-atwell-in-latest-gameplay-trailer',
    ],
  },
];
