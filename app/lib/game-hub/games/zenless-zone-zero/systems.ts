import type { SystemRecord } from '@/app/lib/game-hub/types';

const PRYDWEN = 'https://www.prydwen.gg/zenless/';
const G8_TIER = 'https://game8.co/games/Zenless-Zone-Zero/archives/435685';
const G8_30 = 'https://game8.co/games/Zenless-Zone-Zero/archives/595942';
const PCG = 'https://www.pcgamer.com/games/action/zenless-zone-zero/codes/';

export const SYSTEMS: SystemRecord[] = [
  {
    slug: 'signal-search-gacha',
    name: 'Signal Search (Gacha) & Pity',
    summary:
      "Agents and W-Engines are pulled from the Signal Search gacha using Polychromes/Master Tapes. The limited Agent banner has a soft pity that guarantees an S-Rank within 90 pulls, with a 50/50 chance it is the featured Agent (losing the 50/50 guarantees the featured one on the next S-Rank). W-Engine banners use a shorter pity of about 80 pulls at a higher featured rate.",
    sources: [PRYDWEN, G8_TIER],
  },
  {
    slug: 'w-engines-drive-discs',
    name: 'W-Engines & Drive Discs',
    summary:
      "Each Agent equips one W-Engine (the game's weapon system) plus six Drive Discs (artifact-style gear split across set bonuses and main/sub stats). W-Engines and Drive Discs are the core power-scaling layer that turns a pulled Agent into an endgame-ready build.",
    sources: [PRYDWEN, G8_TIER],
  },
  {
    slug: 'bangboo',
    name: 'Bangboo',
    summary:
      "Bangboo are the small robotic companions slotted alongside your three Agents. They add off-field damage, apply buffs or debuffs, and trigger chain interactions during combos, functioning as a fourth support 'unit' with their own gacha channel.",
    sources: [PRYDWEN, G8_TIER],
  },
  {
    slug: 'shiyu-defense',
    name: 'Shiyu Defense',
    summary:
      'Shiyu Defense is the recurring twin-tower endgame mode: you clear timed combat floors with two separate teams against rotating enemy line-ups, earning Polychromes and rewards for full clears. It is the primary benchmark most tier lists rank Agents against.',
    sources: [G8_TIER, PRYDWEN],
  },
  {
    slug: 'deadly-assault',
    name: 'Deadly Assault',
    summary:
      'Deadly Assault is a rotating boss-rush endgame mode where multiple teams fight elite bosses and are scored on damage and mechanics within a limit, awarding tiered rewards. It sits alongside Shiyu Defense as the second endgame pillar and rewards heavy single-target and burst compositions.',
    sources: [G8_TIER, PRYDWEN],
  },
  {
    slug: 'hollow-zero',
    name: 'Hollow Zero',
    summary:
      "Hollow Zero is ZZZ's roguelike mode: you run procedurally-arranged Hollow grids with stacking Resonium buffs and escalating corruption, farming currency for permanent stat upgrades. It doubles as the main progression sink for a new account building its first teams.",
    sources: [PRYDWEN, G8_30, PCG],
  },
];
