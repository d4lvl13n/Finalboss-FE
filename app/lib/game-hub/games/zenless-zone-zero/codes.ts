import type { CodeRecord } from '@/app/lib/game-hub/types';

const PT = 'https://www.pockettactics.com/zenless-zone-zero/codes';
const G8 = 'https://game8.co/games/Zenless-Zone-Zero/archives/435683';
const PCG = 'https://www.pcgamer.com/games/action/zenless-zone-zero/codes/';

// ZZZ codes are redeemed in-game (Mailbox) or on HoYoverse's web redemption
// page. Codes are case-sensitive. ZENLESSGIFT is the permanent new-player code;
// the others are event/livestream codes that expire. Verified mid-July 2026.
export const CODES: { lastVerified: string; entries: CodeRecord[] } = {
  lastVerified: '2026-07-15',
  entries: [
    {
      code: 'ZENLESSGIFT',
      reward: '50 Polychromes + upgrade materials (permanent new-player code)',
      status: 'active',
      sources: [PT, G8],
    },
    {
      code: 'ZZZSTEAM',
      reward: '60 Polychromes, W-Engine Energy Modules, Investigator Logs, 6,666 Dennies',
      status: 'active',
      sources: [PT, G8],
    },
    {
      code: 'ZZZSEASON3',
      reward: '50 Polychromes',
      status: 'active',
      sources: [PT, PCG],
    },
    {
      code: 'ROSCAELIFER0617',
      reward: '30 Polychromes',
      status: 'active',
      sources: [PT, PCG],
    },
    {
      code: 'ZZZ30BANGBOO',
      reward: '60 Polychromes',
      status: 'active',
      sources: [PT, G8],
    },
  ],
};
