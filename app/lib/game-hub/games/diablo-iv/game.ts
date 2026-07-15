import type { GameRecord } from '@/app/lib/game-hub/types';

// Diablo IV — game identity. Developer and publisher are both Blizzard
// Entertainment (IGDB involved_companies). Genres/platforms/cover/screenshots
// baked from IGDB (125165) so the hero is deterministic with no live-IGDB
// dependency. igdbRating is the floored IGDB aggregated (critic) rating (89.67).
export const GAME: GameRecord = {
  slug: 'diablo-iv',
  name: 'Diablo IV',
  aliases: ['Diablo 4', 'D4'],
  igdbId: 125165,
  developer: 'Blizzard Entertainment',
  publisher: 'Blizzard Entertainment',
  genres: ['Action RPG', 'Role-playing (RPG)', "Hack and slash/Beat 'em up"],
  platforms: ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X|S', 'Xbox One'],
  releaseDate: '2023-06-06',
  franchise: 'Diablo',
  coverImageId: 'co69sm',
  screenshots: ['sc78f4', 'sc78f5', 'sc78f6', 'sc78f7', 'sc78f9'],
  igdbRating: 89,
  imageUrl: null,
  description:
    'Diablo IV is Blizzard’s dark-fantasy action-RPG set in the shared open world of Sanctuary, defined by fast isometric hack-and-slash combat, deep itemization and Paragon builds, and a live-service season model. The base game shipped with five classes; the Vessel of Hatred (2024) and Lord of Hatred (2026) expansions added the Spiritborn, Paladin and Warlock.',
  sources: [
    'https://backend.finalboss.io/wp-json/igdb/v1/game/125165',
    'https://diablo4.blizzard.com/en-us/',
    'https://en.wikipedia.org/wiki/Diablo_IV:_Lord_of_Hatred',
  ],
};
