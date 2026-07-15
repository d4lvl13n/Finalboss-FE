import type { GameRecord } from '@/app/lib/game-hub/types';

// Zenless Zone Zero — game identity. IGDB (200551) presentation art, baked so
// the hero is deterministic and the build has no live-IGDB dependency.
export const GAME: GameRecord = {
  slug: 'zenless-zone-zero',
  name: 'Zenless Zone Zero',
  aliases: ['ZZZ', 'Zenless Zone Zero'],
  igdbId: 200551,
  developer: 'miHoYo',
  publisher: 'HoYoverse',
  genres: ['Gacha RPG', 'Action RPG', "Hack and slash/Beat 'em up", 'Adventure'],
  platforms: ['PC', 'iOS', 'Android', 'PlayStation 5', 'Xbox Series X|S'],
  releaseDate: '2024-07-04',
  franchise: null,
  coverImageId: 'coc9ff',
  screenshots: ['sch7o8', 'sch7oa', 'sch7od', 'sch7oc', 'sch7ob'],
  igdbRating: 69,
  imageUrl: null,
  description:
    "Zenless Zone Zero is HoYoverse's urban-fantasy action gacha set in the post-apocalyptic city of New Eridu. Players build squads of three Agents and fight in fast, combo-driven real-time action combat, pulling new Agents and W-Engines from the Signal Search gacha and pushing endgame modes such as Shiyu Defense and Deadly Assault.",
  sources: [
    'https://www.igdb.com/games/zenless-zone-zero',
    'https://www.prydwen.gg/zenless/tier-list',
    'https://game8.co/games/Zenless-Zone-Zero/archives/435685',
  ],
};
