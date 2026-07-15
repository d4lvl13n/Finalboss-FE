import type { GameRecord } from '@/app/lib/game-hub/types';

// Grand Theft Auto VI — game identity. IGDB (52189) presentation art, baked so
// the hero is deterministic and the build has no live-IGDB dependency. All
// fields are Rockstar-confirmed only; the release date powers the countdown.
export const GAME: GameRecord = {
  slug: 'gta-6',
  name: 'Grand Theft Auto VI',
  aliases: ['GTA 6', 'GTA VI', 'GTA6'],
  igdbId: 52189,
  developer: 'Rockstar Games',
  publisher: 'Rockstar Games',
  genres: ['Shooter', 'Racing', 'Adventure'],
  platforms: ['PlayStation 5', 'Xbox Series X|S'],
  releaseDate: '2026-11-19',
  franchise: 'Grand Theft Auto',
  coverImageId: 'cocaa5',
  screenshots: ['scwpqj', 'scpsp7', 'scpsp6', 'scpsp8', 'scpsp9'],
  igdbRating: null,
  imageUrl: null,
  description:
    'Grand Theft Auto VI heads to the state of Leonida, home to the neon-soaked streets of Vice City and beyond. The game follows dual playable protagonists Jason and Lucia and launches November 19, 2026 on PlayStation 5 and Xbox Series X|S. A PC version has not been dated.',
  sources: [
    'https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026',
    'https://x.com/RockstarGames/status/1986540361011880167',
    'https://www.xbox.com/en-US/games/grand-theft-auto-vi',
    'https://www.igdb.com/games/grand-theft-auto-vi',
  ],
};
