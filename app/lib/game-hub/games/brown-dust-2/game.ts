import type { GameRecord } from '@/app/lib/game-hub/types';

// Brown Dust 2 — game identity. IGDB (196549) presentation art, baked so the
// hero is deterministic and the build has no live-IGDB dependency.
export const GAME: GameRecord = {
  slug: 'browndust2',
  name: 'Brown Dust 2',
  aliases: ['BrownDust2', 'BD2', 'Brown Dust II'],
  igdbId: 196549,
  developer: 'GAMFS N',
  publisher: 'Neowiz',
  genres: ['Gacha RPG', 'Role-playing (RPG)', 'Adventure'],
  platforms: ['PC', 'iOS', 'Android'],
  releaseDate: '2023-06-22',
  franchise: null,
  coverImageId: 'co9d3q',
  screenshots: ['scgicw', 'scgicv', 'scgicu', 'scgict'],
  igdbRating: 84,
  imageUrl: null,
  description:
    'Brown Dust 2 is a 2D turn-based RPG gacha where players collect characters and their costumes, each a distinct playable unit with its own kit, and deploy them across Story/PvE campaigns, asynchronous Mirror War PvP, and boss battles.',
  sources: [
    'https://www.igdb.com/games/brown-dust-ii',
    'https://www.pocketgamer.com/brown-dust-2/tier-list/',
    'https://www.pockettactics.com/brown-dust-2/tier-list',
  ],
};
