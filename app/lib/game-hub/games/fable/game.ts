import type { GameRecord } from '@/app/lib/game-hub/types';

// Fable — game identity for the upcoming Playground Games reboot. IGDB (92550)
// presentation art, baked so the hero is deterministic and the build has no
// live-IGDB dependency. All fields are Xbox/Playground-confirmed only; the
// release date (Feb 23, 2027) powers the countdown. The IGDB canonical slug is
// 'fable--1' (double-dash fails our slug rule) so the local slug is 'fable',
// which also matches the GPBot Knowledge entity's normalized name.
export const GAME: GameRecord = {
  slug: 'fable',
  name: 'Fable',
  aliases: ['Fable 4', 'Fable reboot', 'Fable 2027'],
  igdbId: 92550,
  developer: 'Playground Games',
  publisher: 'Xbox Game Studios',
  genres: ['Role-playing (RPG)', 'Adventure'],
  platforms: ['Xbox Series X|S', 'PC (Microsoft Windows)', 'PlayStation 5'],
  releaseDate: '2027-02-23',
  franchise: 'Fable',
  coverImageId: 'cobc6d',
  screenshots: ['scsoet', 'scsoex', 'scsoeu', 'scsoez', 'scsoey'],
  igdbRating: null,
  imageUrl: null,
  description:
    'Fable is an open-world action RPG from Playground Games and Xbox Game Studios, a reboot of the fantasy series set in the fairy-tale world of Albion. Players create a customizable Hero in a world where reputation and choices shape the journey. It launches February 23, 2027 on Xbox Series X|S, PC and PlayStation 5, and is on Xbox Game Pass day one.',
  sources: [
    'https://en.wikipedia.org/wiki/Fable_(2027_video_game)',
    'https://www.xbox.com/en-US/games/fable',
    'https://www.pushsquare.com/news/2026/06/fable-gets-ps5-release-date-and-hayley-atwell-in-latest-gameplay-trailer',
    'https://www.igdb.com/games/fable--1',
  ],
};
