import type { SystemRecord } from '@/app/lib/game-hub/types';

export const SYSTEMS: SystemRecord[] = [
  {
    slug: 'gacha-banners',
    name: 'Gacha & Banners',
    summary:
      'Costumes are the gacha unit; each character has multiple pullable costumes, each a distinct playable unit with its own kit. A beginner banner guarantees a five-star on reroll pulls, with concurrent limited banners running alongside.',
    sources: [
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://www.pockettactics.com/brown-dust-2/tier-list',
    ],
  },
  {
    slug: 'reroll',
    name: 'Reroll',
    summary:
      'Rerolling is done via the beginner/infinite-draw banner: complete the tutorial, use the draw tab, and keep pulling until you land a wanted unit; a guest-account reroll method is also available. Common reroll targets include Justia and B-rank Helena.',
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
    ],
  },
  {
    slug: 'mirror-war',
    name: 'Mirror War (PvP)',
    summary:
      'Asynchronous PvP where players set attack and defense teams; the meta rewards evasion/tank defenders (e.g. Apostle Olivier, Dark Knight Lathel, Pool Party Justia) and burst/amp cores, with pairings like Justia + Empress Rubia common in high-rank play.',
    sources: ['https://dotgg.gg/brown-dust-2/pvp-tier-list/'],
  },
  {
    slug: 'story-pve',
    name: 'Story / PvE',
    summary:
      'Narrative-driven turn-based PvE campaign delivered as episodic Story Packs, emphasizing a heavy story and high strategic depth in battles.',
    sources: [
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://4gamer.net/games/665/G066579/20260310036',
    ],
  },
  {
    slug: 'costume-system',
    name: 'Costume System',
    summary:
      'Characters are collected and played through costumes; a single character can have many costumes, each functioning as a separate unit with its own rarity, element, and skill kit, which is why tier lists rank costumes rather than base characters.',
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
    ],
  },
];
