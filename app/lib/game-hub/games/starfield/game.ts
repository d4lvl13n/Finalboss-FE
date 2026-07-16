import type { GameRecord } from '@/app/lib/game-hub/types';

// Starfield — game identity. IGDB (96437) presentation art, baked so the hero is
// deterministic and the build has no live-IGDB dependency. Modelled with the
// looter_shooter blueprint: Weapons are the tiered roster; Companions, Ships,
// Builds and Powers live as collections; Skills/ship-building/outposts/NG+ as systems.
export const GAME: GameRecord = {
  slug: 'starfield',
  name: 'Starfield',
  aliases: [],
  igdbId: 96437,
  developer: 'Bethesda Game Studios',
  publisher: 'Bethesda Softworks',
  genres: ['Action RPG', 'Open World', 'Space RPG'],
  platforms: ['PC', 'Xbox Series X|S', 'PlayStation 5'],
  releaseDate: '2023-09-06',
  franchise: null,
  coverImageId: 'co39vv',
  screenshots: ['ygiajg3ypevvmhoo0cea', 'tg9zupved8b6aroc0fob', 'schdmh', 'schdmi', 'schdmj'],
  igdbRating: 70,
  imageUrl: null,
  description:
    "Starfield is Bethesda Game Studios' single-player action-RPG set in the Settled Systems in the year 2330. You create a customizable character, join the explorer group Constellation, and range across 1,000+ planets — building ships, establishing outposts, joining factions and unlocking Powers via New Game Plus. Launched September 6, 2023 (PC/Xbox), it later reached PlayStation 5 and has been expanded through the Shattered Space story DLC and ongoing content updates (including the Free Lanes cruise-mode update and Terran Armada content) that reshaped the 2026 weapon, ship and build meta.",
  sources: [
    'https://www.igdb.com/games/starfield',
    'https://backend.finalboss.io/starfield-best-builds-in-2026-5-meta-setups/',
  ],
};
