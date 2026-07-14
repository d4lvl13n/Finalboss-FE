import type { ClassRecord } from '@/app/lib/game-hub/types';

// Class roster. Tiers (PvE/PvP) come from FinalBoss's own tier-list + class
// guide; basic classes that only funnel into advanced ones carry no tier.
// counteredBy/pairsWith are omitted: no class-vs-class relationships are
// stated in sources (mechanic counters like "stuns"/"kiting" live in playstyle).
const FB_TIER = 'https://finalboss.io/crystal-of-atlan-tier-list-2025-best-classes';
const FB_GUIDE = 'https://finalboss.io/youre-picking-the-wrong-crystal-of-atlan-class';
const FB_REVIEW = 'https://finalboss.io/crystal-of-atlan-surprised-me-flashy-air-combat';

export const CLASSES: ClassRecord[] = [
  {
    slug: 'warlock',
    name: 'Warlock',
    role: 'Ranged magic DPS with crowd control',
    playstyle:
      'Mid-to-long range caster with huge AoE burst on short cooldowns and reliable CC; considered the top ranged DPS after the 2025 balance patch.',
    pveTier: 'S',
    pvpTier: 'S',
    sources: [FB_TIER, FB_GUIDE],
  },
  {
    slug: 'scytheguard',
    name: 'Scytheguard',
    role: 'Support / off-tank with AoE',
    playstyle:
      'The only dedicated support class; uses the Marionette as a battlefield zone for shields, healing, damage buffs and enemy debuffs while adding AoE damage-over-time. Near-mandatory for high-end raids; vulnerable to stuns and silence.',
    pveTier: 'S',
    pvpTier: 'S',
    sources: [FB_TIER, FB_GUIDE],
  },
  {
    slug: 'berserker',
    name: 'Berserker',
    role: 'Melee frontline DPS (cleave)',
    playstyle:
      'Forgiving melee juggernaut with high cleave damage, strong gap-closers and enough self-survivability to dive; manages a rage resource for boss enrages.',
    pveTier: 'S',
    pvpTier: 'S',
    sources: [FB_TIER, FB_GUIDE],
  },
  {
    slug: 'mystrix',
    name: 'Mystrix',
    role: 'Ranged burst DPS (glass cannon)',
    playstyle:
      'High-mobility hit-and-run ranged burst with strong sustained damage but very low survivability up close; rewards precise kiting.',
    pveTier: 'S',
    pvpTier: 'S',
    isNew: true,
    sources: [FB_TIER],
  },
  {
    slug: 'magiblade',
    name: 'Magiblade',
    role: 'Hybrid melee-magic AoE DPS',
    weapon: 'Hybrid melee/magic',
    playstyle:
      'Fast, flashy melee-magic combos excelling at circular AoE for mob farming and skill-based 1v1 duels; rewards dodge timing but gets kited by ranged comps in high-end PvP.',
    pveTier: 'A',
    pvpTier: 'A',
    sources: [FB_TIER, FB_GUIDE],
  },
  {
    slug: 'blademaiden',
    name: 'Blademaiden',
    role: 'High-skill melee / PvP duelist',
    playstyle:
      'Uses a Marionette that mirrors your actions for high combo potential (and doubled misplays); strong in raids and a high-skill PvP pick.',
    pveTier: 'A',
    pvpTier: 'B',
    sources: [FB_TIER, FB_GUIDE],
  },
  {
    slug: 'cloudstrider',
    name: 'Cloudstrider',
    role: 'Stance-swapping melee',
    playstyle:
      'Swaps between mobility and damage stances; flexible in mixed content and rewarded in climbing PvP thanks to strong mobility, but harder to master.',
    pveTier: 'A',
    pvpTier: 'A',
    sources: [FB_TIER, FB_GUIDE],
  },
  {
    slug: 'starbreaker',
    name: 'Starbreaker',
    role: 'Control-oriented melee',
    playstyle:
      'Aerial juggles and knock-ups make it a strong arena CC-chainer with teammates; can be overshadowed by Berserker’s raw cleave in raids.',
    pveTier: 'A',
    pvpTier: 'A',
    sources: [FB_GUIDE],
  },
  {
    slug: 'bounty-hunter',
    name: 'Bounty Hunter',
    role: 'Ranged burst / hit-and-run',
    playstyle:
      'Ranged burst with strong hit-and-run tools; in PvP the job is to delete one target and disengage rather than brawl. Less reliable in real matches than its PvE damage suggests.',
    pveTier: 'A',
    pvpTier: 'B',
    sources: [FB_TIER, FB_GUIDE],
  },
  {
    slug: 'elementalist',
    name: 'Elementalist',
    role: 'Pure AoE magic DPS',
    playstyle:
      'Elemental AoE nuker best in static farming spots and dungeon trash; chains elements for burst windows but has less CC and defense than Warlock. Its rating rose over 2025 (C in the earlier tier list, A in the later class guide).',
    pveTier: 'A',
    pvpTier: 'C',
    sources: [FB_TIER, FB_GUIDE],
  },
  {
    slug: 'magician',
    name: 'Magician',
    role: 'Illusion / deception caster',
    playstyle:
      'Fun illusion and deception toolkit but damage and reliability lag behind Warlock in serious content; mainly a PvP-flavored B-tier pick.',
    pveTier: 'B',
    pvpTier: 'B',
    sources: [FB_TIER, FB_GUIDE],
  },
  {
    slug: 'mirage',
    name: 'Mirage',
    role: 'High-mobility burst assassin',
    playstyle:
      'Part of the Assassin line: amazing when ahead, miserable when behind; a snowbally, outplay-focused pick for dedicated PvP mains.',
    pveTier: 'B',
    pvpTier: 'B',
    sources: [FB_GUIDE],
  },
  {
    slug: 'gunner',
    name: 'Gunner',
    role: 'Ranged cannon DPS',
    weapon: 'Cannon',
    playstyle:
      'Big satisfying cannon hits but a stationary playstyle that is punishing in 2025’s fast fights; sluggish until late gear. Advances into Mystrix.',
    advancedClasses: ['Mystrix'],
    pveTier: 'B',
    pvpTier: 'C',
    sources: [FB_TIER, FB_GUIDE],
  },
  {
    slug: 'specter',
    name: 'Specter',
    role: 'High-mobility burst assassin',
    playstyle:
      'Part of the Assassin line; a starter/C-tier outplay pick that shines when ahead and struggles when behind.',
    pveTier: 'C',
    pvpTier: 'C',
    sources: [FB_GUIDE],
  },
  {
    slug: 'swordsman',
    name: 'Swordsman',
    role: 'Starter melee',
    playstyle:
      'Basic starter melee treated as a tutorial mode before its advanced form; don’t sink rare resources here long term. Advances into Berserker.',
    advancedClasses: ['Berserker'],
    pveTier: 'C',
    pvpTier: 'C',
    sources: [FB_GUIDE],
  },
  {
    slug: 'musketeer',
    name: 'Musketeer',
    role: 'Starter ranged (firearms)',
    playstyle: 'Basic starter ranged class treated as a tutorial mode before its advanced form. Advances into Bounty Hunter.',
    advancedClasses: ['Bounty Hunter'],
    pveTier: 'C',
    pvpTier: 'C',
    sources: [FB_GUIDE],
  },
  {
    slug: 'puppeteer',
    name: 'Puppeteer',
    role: 'Marionette summoner (basic)',
    playstyle: 'Basic class built around micromanaging a Marionette; advances into the support powerhouse Scytheguard.',
    advancedClasses: ['Scytheguard'],
    sources: [FB_TIER, FB_GUIDE],
  },
  {
    slug: 'magister',
    name: 'Magister',
    role: 'Caster (basic)',
    playstyle:
      'Basic caster class and the exception to the two-branch rule — it unlocks three advanced classes instead of two (only Warlock is named in sources).',
    advancedClasses: ['Warlock'],
    sources: [FB_TIER],
  },
  {
    slug: 'fighter',
    name: 'Fighter',
    role: 'Melee (basic)',
    playstyle: 'Basic melee class that branches into the control-oriented Starbreaker and the stance-swapping Cloudstrider.',
    advancedClasses: ['Starbreaker', 'Cloudstrider'],
    sources: [FB_GUIDE],
  },
  {
    slug: 'assassin',
    name: 'Assassin',
    role: 'High-mobility burst (basic)',
    playstyle:
      'Post-launch class added in 2025 bringing fast, hyper-mobile burst damage with subclass paths (Mirage / Specter) that adjust risk; a high-skill-ceiling PvP topic.',
    advancedClasses: ['Mirage', 'Specter'],
    sources: [FB_REVIEW, FB_GUIDE],
  },
  {
    slug: 'inventor',
    name: 'Inventor',
    aliases: ['発明家', 'Artificer'],
    role: 'Magitech ranged summoner',
    weapon: 'Summoned magitech machines',
    playstyle:
      'Magitech/Artificer-style class released 12 March 2026 in the 2026 roadmap; summons magic machines to annihilate enemies from a safe range. Launched with two branch classes.',
    isNew: true,
    sources: [
      'https://massivelyop.com/2026/03/13/crystal-of-atlan-releases-its-new-magitech-inventor-class-as-part-of-its-2026-roadmap',
      'https://pocketgamer.com/crystal-of-atlan/inventor-class-update',
      'https://gamespress.com/Crystal-of-Atlan-Launches-New-Inventor-Class-Plus-Two-Powerful-Branch-',
    ],
  },
  {
    slug: 'oni-blade',
    name: 'Oni-blade',
    aliases: ['鬼刃'],
    playstyle:
      'New class introduced alongside the NieR:Automata collaboration update that launched 21 May 2026 (further details not yet covered in sources).',
    isNew: true,
    sources: ['https://4gamer.net/games/727/G072787/20260521034'],
  },
];
