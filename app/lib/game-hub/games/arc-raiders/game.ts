import type { GameRecord } from '@/app/lib/game-hub/types';

// ARC Raiders — game identity. IGDB (185258) presentation art, baked so the
// hero is deterministic and the build has no live-IGDB dependency.
export const GAME: GameRecord = {
  slug: 'arc-raiders',
  name: 'ARC Raiders',
  aliases: ['Arc Raiders'],
  igdbId: 185258,
  developer: 'Embark Studios',
  publisher: 'Embark Studios',
  genres: ['Looter Shooter', 'Extraction Shooter', 'Shooter'],
  platforms: ['PC', 'PlayStation 5', 'Xbox Series X|S'],
  releaseDate: '2025-10-30',
  franchise: null,
  coverImageId: 'co9rk1',
  screenshots: ['scii62', 'sc11kk7', 'sc11kk8', 'sc11kk9', 'sc11kka'],
  igdbRating: 84,
  imageUrl: null,
  description:
    "ARC Raiders is a third-person PvPvE extraction shooter from Embark Studios (developer and publisher). Players are 'Raiders' who descend from underground settlements to the surface 'Rust Belt' to scavenge loot from caches, fight hostile robotic machines called ARC, contend with other player squads (solo, duo or trio), and escape via an Extraction Point before losing their haul. It launched October 30, 2025 to strong reception (IGDB aggregated ~89) and features dynamic weather, time-of-day and dynamic map events.",
  sources: [
    'https://www.igdb.com/games/arc-raiders',
    'https://arc-raiders.fandom.com/wiki/Maps',
  ],
};
