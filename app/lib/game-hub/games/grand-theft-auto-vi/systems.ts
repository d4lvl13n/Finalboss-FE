import type { SystemRecord } from '@/app/lib/game-hub/types';

// Grand Theft Auto VI "What We Know" — the confirmed locations (regions of
// Leonida) and the confirmed features/details Rockstar has shown, combined into
// one array. Every entry carries at least one source (cite-or-drop).
export const SYSTEMS: SystemRecord[] = [
  {
    slug: 'leonida',
    name: 'State of Leonida',
    summary:
      "The fictional US state that GTA VI is set in, Rockstar's take on Florida. Rockstar: 'Grand Theft Auto VI heads to the state of Leonida, home to the neon-soaked streets of Vice City and beyond.'",
    sources: [
      'https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026',
      'https://gamerant.com/gta-6-setting-map-vice-city-leonida/',
    ],
  },
  {
    slug: 'vice-city',
    name: 'Vice City',
    summary:
      "The neon-soaked metropolis at the heart of Leonida, a modern take on Miami and the series' return to Vice City. Officially shown areas include Ocean Beach's art-deco hotels, Little Cuba, and the VC Port.",
    sources: [
      'https://www.gtabase.com/gta-6/map/',
      'https://gamerant.com/gta-6-setting-map-vice-city-leonida/',
    ],
  },
  {
    slug: 'leonida-keys',
    name: 'Leonida Keys',
    summary:
      'A Keys-inspired island chain of small islands linked by highway bridges over turquoise water; a laid-back resort-and-reef region.',
    sources: [
      'https://www.gosugamers.net/entertainment/news/74895-gta-vi-major-locations-revealed-vice-city-leonida-keys-grassrivers-and-more',
      'https://www.gtabase.com/gta-6/map/',
    ],
  },
  {
    slug: 'grassrivers',
    name: 'Grassrivers',
    summary:
      "Rockstar's Everglades: a vast subtropical wetland of swamps, marshes, cypress forests and slow rivers.",
    sources: [
      'https://www.gosugamers.net/entertainment/news/74895-gta-vi-major-locations-revealed-vice-city-leonida-keys-grassrivers-and-more',
      'https://www.gtabase.com/gta-6/map/',
    ],
  },
  {
    slug: 'mount-kalaga',
    name: 'Mount Kalaga',
    summary:
      "A national landmark near the state's northern border offering hunting, fishing, and off-road trails.",
    sources: [
      'https://www.gtabase.com/gta-6/map/',
      'https://www.gosugamers.net/entertainment/news/74895-gta-vi-major-locations-revealed-vice-city-leonida-keys-grassrivers-and-more',
    ],
  },
  {
    slug: 'port-gellhorn',
    name: 'Port Gellhorn',
    summary:
      'One of the six regions of Leonida named by Rockstar; an industrial port area in the state.',
    sources: [
      'https://www.gtabase.com/gta-6/map/',
      'https://www.gosugamers.net/entertainment/news/74895-gta-vi-major-locations-revealed-vice-city-leonida-keys-grassrivers-and-more',
    ],
  },
  {
    slug: 'ambrosia',
    name: 'Ambrosia',
    summary:
      "One of the six regions of Leonida named by Rockstar in the game's official map material.",
    sources: [
      'https://www.gtabase.com/gta-6/map/',
      'https://www.gosugamers.net/entertainment/news/74895-gta-vi-major-locations-revealed-vice-city-leonida-keys-grassrivers-and-more',
    ],
  },
  {
    slug: 'dual-protagonists',
    name: 'Dual playable protagonists',
    summary:
      'GTA VI is built around two playable protagonists, Jason and Lucia, with Lucia the first female lead in a mainline GTA. Their partnership and criminal exploits drive the story.',
    sources: [
      'https://www.cbsnews.com/news/gta-6-trailer-2-release-grand-theft-auto-rockstar-vice-city/',
      'https://www.gamesradar.com/gta-6-guide/',
    ],
  },
  {
    slug: 'vice-city-leonida-setting',
    name: 'Return to Vice City / state of Leonida',
    summary:
      'The series returns to a modern-day Vice City set within the wider fictional state of Leonida, described by Rockstar as its biggest, most immersive world yet.',
    sources: [
      'https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026',
      'https://gamerant.com/gta-6-setting-map-vice-city-leonida/',
    ],
  },
  {
    slug: 'single-player-experience',
    name: 'Single-player experience at launch',
    summary:
      'Rockstar/Take-Two have described the $79.99 launch product as a single-player experience; no separate online mode pricing has been detailed at launch.',
    sources: [
      'https://variety.com/2026/gaming/news/gta-6-price-single-player-pre-orders-1236789407/',
      'https://www.purexbox.com/news/2026/06/gta-6-costs-usd80-described-as-a-single-player-experience',
    ],
  },
  {
    slug: 'editions',
    name: 'Editions: Standard and Ultimate',
    summary:
      'Two digital editions are confirmed: Standard ($79.99) and Ultimate ($99.99). The Ultimate Edition adds bonus vehicles, weapons, cosmetics and two exclusive side missions. Pre-orders opened June 25, 2026, with a Vintage City pack for pre-orders.',
    sources: [
      'https://www.rockstargames.com/newswire/article/5171972o3ak5oa/pre-order-grand-theft-auto-vi-on-june-25',
      'https://www.gtaboom.com/gta-6-price-standard-ultimate-edition-f1bc',
      'https://www.videogameschronicle.com/news/rockstar-confirms-grand-theft-auto-6-ultimate-edition-and-pre-order-bonuses-but-still-no-price/',
    ],
  },
];
