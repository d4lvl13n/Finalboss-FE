// Per-game source registry. This is the ONLY place a game's data source is
// declared. A local blueprint game maps its slug → a lazy loader of its
// validated GameData. Games NOT listed here fall through to the Knowledge API
// (source:'api') automatically — so existing api games (GTA VI) need no entry.
//
// To flip a curated game onto the automated GPBot store later, delete its line
// here (and back its entity in k_*). Templates never change.
//
// ⚠️ SLUG POLICY (see CLAUDE.md "Game Hub Slug Policy"): one game = ONE /game/*
// URL. Before adding a line, check Search Console for an EXISTING indexed slug
// for this game (IGDB auto-creates slugs on search). Use the equity slug as the
// key + game.slug; if the KG entity is keyed differently set GameData.knowledgeSlug;
// and 301 any old slug in next.config.js. Do NOT mint a new slug that duplicates
// a ranked page — that splits SEO equity (the gta-6 / diablo-4 fix, commit 21421f7).

import type { GameData } from './types';
import { CRYSTAL_OF_ATLAN } from './games/crystal-of-atlan';
import { BROWN_DUST_2 } from './games/brown-dust-2';
import { GRAND_THEFT_AUTO_VI } from './games/grand-theft-auto-vi';
import { ZENLESS_ZONE_ZERO } from './games/zenless-zone-zero';
import { DIABLO_IV } from './games/diablo-iv';
import { FABLE } from './games/fable';
import { ARC_RAIDERS } from './games/arc-raiders';

export const LOCAL_GAMES: Record<string, () => GameData> = {
  'crystal-of-atlan': () => CRYSTAL_OF_ATLAN,
  'browndust2': () => BROWN_DUST_2,
  'gta-6': () => GRAND_THEFT_AUTO_VI,
  'zenless-zone-zero': () => ZENLESS_ZONE_ZERO,
  'diablo-4': () => DIABLO_IV,
  'fable': () => FABLE,
  'arc-raiders': () => ARC_RAIDERS,
};
