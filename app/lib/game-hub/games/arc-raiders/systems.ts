import type { SystemRecord } from '@/app/lib/game-hub/types';

const ARC = 'https://arc-raiders.fandom.com/wiki/ARC';
const MAPS = 'https://arc-raiders.fandom.com/wiki/Maps';
const WEAPONS = 'https://arc-raiders.fandom.com/wiki/Weapons';
const SHIELDS = 'https://arc-raiders.fandom.com/wiki/Shields';
const AUGMENTS = 'https://arc-raiders.fandom.com/wiki/Augments';
const GADGETS = 'https://arc-raiders.fandom.com/wiki/Gadgets';

export const SYSTEMS: SystemRecord[] = [
  {
    slug: 'extraction-loop',
    name: 'Extraction Loop',
    summary:
      'Core PvPvE cycle: drop to the surface solo or in a squad of up to three, recover materials from caches, hunt ARC, and reach an Extraction Point before rival Raiders take your loot. Death means losing your unsecured haul.',
    sources: [MAPS],
  },
  {
    slug: 'arc-aggression-states',
    name: 'ARC Aggression States',
    summary:
      'Most ARC show 4 alert stages by scanner beam color: White = patrolling, Blue = mild curiosity, Yellow = investigating suspected Raider activity, Red = locked on (with an audible lock-on cue). Manage noise and line of sight to keep machines White/Blue.',
    sources: [ARC],
  },
  {
    slug: 'armor-penetration',
    name: 'Armored vs Unarmored ARC',
    summary:
      "ARC can be armored or unarmored; armored ARC can only be taken down efficiently with heavy ammunition. Weapon 'ARC Armor Penetration' ratings (Very Weak to Very Strong) determine effectiveness — energy weapons like the Equalizer and heavy-ammo guns like Ferro/Bettina excel vs armor.",
    sources: [ARC, WEAPONS],
  },
  {
    slug: 'shield-system',
    name: 'Shield & Damage Mitigation',
    summary:
      'Shields don\'t add extra HP — they deflect a percentage of incoming damage while they hold charge. Each blue shield box = 10 shield points. Formula: shield charge drops by the weapon\'s base damage Y, and your health takes Y reduced by the shield\'s deflection rate (e.g. 40% Light). ARC PowerCells dropped by destroyed ARC can recharge shields mid-run.',
    sources: [SHIELDS, ARC],
  },
  {
    slug: 'augments',
    name: 'Augments & Carry Capacity',
    summary:
      'Augments set backpack slots, weight limit, safe-pocket/quick-use slots and which shield tiers you can equip; they cannot be swapped mid-raid. Looting variants maximize haul, Tactical add utility/healing, Combat unlock Heavy shields and health regen.',
    sources: [AUGMENTS],
  },
  {
    slug: 'crafting',
    name: 'Crafting, Traders & Blueprints',
    summary:
      'Gear is bought from traders (Lance, Apollo, Shani) or crafted/repaired at benches (Utility Bench I-III, Gear Bench 1-3) using scavenged materials like Plastic/Metal/Rubber Parts, ARC Circuitry, Battery, Power Rod and Voltage Converter. Weapon blueprints unlock craftable guns.',
    sources: [GADGETS, SHIELDS],
  },
];
