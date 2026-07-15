// Per-game source registry. This is the ONLY place a game's data source is
// declared. A local blueprint game maps its slug → a lazy loader of its
// validated GameData. Games NOT listed here fall through to the Knowledge API
// (source:'api') automatically — so existing api games (GTA VI) need no entry.
//
// To flip a curated game onto the automated GPBot store later, delete its line
// here (and back its entity in k_*). Templates never change.

import type { GameData } from './types';
import { CRYSTAL_OF_ATLAN } from './games/crystal-of-atlan';
import { BROWN_DUST_2 } from './games/brown-dust-2';
import { GRAND_THEFT_AUTO_VI } from './games/grand-theft-auto-vi';

export const LOCAL_GAMES: Record<string, () => GameData> = {
  'crystal-of-atlan': () => CRYSTAL_OF_ATLAN,
  'browndust2': () => BROWN_DUST_2,
  'grand-theft-auto-vi': () => GRAND_THEFT_AUTO_VI,
};
