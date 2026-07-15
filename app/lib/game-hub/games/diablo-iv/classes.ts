import type { ClassRecord } from '@/app/lib/game-hub/types';

// Class roster — the full live roster as of Season 14 (Season of Death
// Awakening, June 2026): the five base classes, plus Spiritborn (Vessel of
// Hatred, 2024) and Paladin + Warlock (Lord of Hatred, April 2026).
//
// pveTier follows Icy Veins' Season 14 endgame-push class tier list (last
// updated 4 July 2026): S = Barbarian / Rogue / Druid; A = Spiritborn /
// Sorcerer / Necromancer / Paladin / Warlock. Tiers shift with balance
// patches, so they track the live Season 14 meta rather than being permanent.
// pvpTier is omitted: Diablo IV has no maintained class-vs-class PvP tier list.
const IV_TIER = 'https://www.icy-veins.com/d4/guides/class-tier-list/';
const MAXROLL_ENDGAME = 'https://maxroll.gg/d4/tierlists/endgame-tier-list';
const WOWHEAD_SPIRITBORN = 'https://www.wowhead.com/diablo-4/guide/classes/spiritborn/overview';
const XBOX_PALADIN = 'https://news.xbox.com/en-us/2025/12/16/diablo-iv-paladin-class-lord-of-hatred/';
const KITGURU_WARLOCK =
  'https://www.kitguru.net/gaming/matthew-wilson/diablo-4-to-get-warlock-class-with-lord-of-hatred-expansion/';

export const CLASSES: ClassRecord[] = [
  {
    slug: 'barbarian',
    name: 'Barbarian',
    role: 'Melee weapon-master bruiser',
    playstyle:
      'A durable frontline brute who juggles up to four equipped weapons through the Arsenal system, layering shouts and stacking damage buffs. One of the strongest endgame-push classes in Season 14 thanks to high survivability and raw damage.',
    pveTier: 'S',
    sources: [IV_TIER, MAXROLL_ENDGAME],
  },
  {
    slug: 'rogue',
    name: 'Rogue',
    role: 'Agile hybrid DPS (ranged & melee)',
    playstyle:
      'A flexible skirmisher that swaps between bows and blades, weaves imbuements (poison, cold, shadow) and combo/core points, and leans on high mobility. Consistently top-tier across leveling and endgame in the Season 14 lists.',
    pveTier: 'S',
    sources: [IV_TIER, MAXROLL_ENDGAME],
  },
  {
    slug: 'druid',
    name: 'Druid',
    role: 'Shapeshifting elemental/summoner bruiser',
    playstyle:
      'Shapeshifts between Werewolf and Werebear forms while wielding earth and storm magic and companion spirit animals; a tanky, versatile class that rates S-tier for both leveling and endgame in Season 14.',
    pveTier: 'S',
    sources: [IV_TIER, MAXROLL_ENDGAME],
  },
  {
    slug: 'spiritborn',
    name: 'Spiritborn',
    role: 'Jungle martial-arts DPS',
    playstyle:
      'The Vessel of Hatred (2024) class: a Nahantu warrior who channels four Spirit Guardians — Jaguar (fire multi-hit), Eagle (lightning mobility), Gorilla (physical defense) and Centipede (poison drain) — using glaives and quarterstaves. Rates A-tier for endgame in Season 14.',
    pveTier: 'A',
    sources: [IV_TIER, WOWHEAD_SPIRITBORN],
  },
  {
    slug: 'sorcerer',
    name: 'Sorcerer',
    aliases: ['Sorceress'],
    role: 'Ranged elemental caster',
    playstyle:
      'A classic glass-cannon spellcaster slinging fire, cold and lightning with an Enchantment system that turns skills into passive effects. Strong for speed-farming and a solid A-tier endgame pick in Season 14, but fragile up close.',
    pveTier: 'A',
    sources: [IV_TIER, MAXROLL_ENDGAME],
  },
  {
    slug: 'necromancer',
    name: 'Necromancer',
    role: 'Minion-summoning caster',
    playstyle:
      'Commands skeletons and golems while spending Essence on bone, blood and darkness magic; the Book of the Dead lets you tune the army. A steady A-tier endgame class in Season 14 that can also go minion-light for pure spellcasting.',
    pveTier: 'A',
    sources: [IV_TIER, MAXROLL_ENDGAME],
  },
  {
    slug: 'paladin',
    name: 'Paladin',
    role: 'Holy melee frontline / support',
    playstyle:
      'A Lord of Hatred (April 2026) class: a holy-warrior frontliner that mixes melee strikes with light-based buffs and team support. Rates A-tier for endgame push in Season 14.',
    pveTier: 'A',
    isNew: true,
    sources: [IV_TIER, XBOX_PALADIN],
  },
  {
    slug: 'warlock',
    name: 'Warlock',
    role: 'Willpower-based control caster',
    playstyle:
      'A Lord of Hatred (April 2026) class and one of the most complex in the game, juggling two resources — Wrath and Dominance — to control the battlefield and ramp up damage over a fight. Rates A-tier for endgame in Season 14.',
    pveTier: 'A',
    isNew: true,
    sources: [IV_TIER, KITGURU_WARLOCK],
  },
];
