import type { GameRecord } from '@/app/lib/game-hub/types';

// Crystal of Atlan — game identity. Dev/publisher intentionally null (not
// stated in any source we hold). releaseDate null: IGDB lists 2023-07-14 but
// that is likely a regional/early date; the global + Steam launch was Oct 2025
// and no clean sourced global-launch day exists, so we publish no date rather
// than a misleading one.
export const GAME: GameRecord = {
  slug: 'crystal-of-atlan',
  name: 'Crystal of Atlan',
  aliases: ['CoA', 'クリスタル・オブ・アトラン'],
  igdbId: 174674,
  developer: null,
  publisher: null,
  genres: ['MMO Action RPG', 'Role-playing (RPG)', 'Hack and slash', 'Adventure'],
  platforms: ['PC', 'PlayStation 5', 'iOS', 'Android'],
  releaseDate: null,
  franchise: null,
  coverImageId: null,
  imageUrl: null,
  description:
    'Crystal of Atlan is a free-to-play magicpunk MMO action-RPG built on Unreal Engine, defined by 3D aerial combo combat and cross-play with shared progression across PC, PS5, iOS and Android.',
  sources: [
    'https://backend.finalboss.io/wp-json/igdb/v1/game/174674',
    'https://finalboss.io/crystal-of-atlan-surprised-me-flashy-air-combat',
  ],
};
