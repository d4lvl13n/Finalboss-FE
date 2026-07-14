import type { SystemRecord } from '@/app/lib/game-hub/types';

const FB_TIER = 'https://finalboss.io/crystal-of-atlan-tier-list-2025-best-classes';
const FB_GUIDE = 'https://finalboss.io/youre-picking-the-wrong-crystal-of-atlan-class';
const FB_REVIEW = 'https://finalboss.io/crystal-of-atlan-surprised-me-flashy-air-combat';

export const SYSTEMS: SystemRecord[] = [
  {
    slug: 'advanced-class-system',
    name: 'Advanced Class System',
    summary:
      'Each basic class unlocks its advanced class(es) at around level 15. The choice is permanent — you cannot switch advanced classes later and must reroll a new character to try another. Most basic classes have two branches; Magister is the exception with three.',
    sources: [FB_TIER, FB_GUIDE],
  },
  {
    slug: 'homestead',
    name: 'Homestead',
    summary:
      'Player homestead/housing system launched around 10 October 2025, ahead of the Steam launch and introduced alongside the B.Duck collaboration.',
    sources: [
      'https://gamespress.com/Crystal-of-Atlan-Launches-Homestead-System-with-BDuck-Collaboration',
      'https://massivelyop.com/2026/05/11/crystal-of-atlan-adds-new-events-opens-a-new-dungeon-and-hypes-its-next-class-and-first-anniversary',
    ],
  },
  {
    slug: 'cross-play-cross-progression',
    name: 'Cross-play & Cross-progression',
    summary:
      'Full cross-play and shared progression across PS5, PC and mobile (iOS/Android); level on one platform and continue on another without losing progress.',
    sources: [FB_REVIEW],
  },
  {
    slug: 'monetization-passes',
    name: 'Free-to-play Monetization',
    summary:
      'Free-to-play with no character gacha; core classes and combat are free. Spending revolves around progression passes, cosmetics and currency bundles such as the Phantasium Pass and Arcanite of Brocade.',
    sources: [FB_REVIEW],
  },
  {
    slug: 'redemption-codes',
    name: 'Redemption Codes',
    summary:
      "In-game redemption/gift codes grant items like Hunting Permits, Maltz's Special Injections, Arcanite of Adore and Bound Gold; codes are region-specific (separate NA/EU, JP/SEA/Asia and PS5 lists).",
    sources: ['https://pocketgamer.com/crystal-of-atlan/codes'],
  },
];
