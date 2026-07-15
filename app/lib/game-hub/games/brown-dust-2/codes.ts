import type { CodeRecord } from '@/app/lib/game-hub/types';

const PG = 'https://www.pocketgamer.com/brown-dust-2/codes/';

// As of the verified date below, tracked sources list no currently-active
// redemption codes. BD2 codes are short-lived (usually expire within ~30 days).
// The two recently-expired examples below are kept for context.
export const CODES: { lastVerified: string; entries: CodeRecord[] } = {
  lastVerified: '2026-07-11',
  entries: [
    { code: 'THANKSTGS2026BD2', status: 'expired', sources: [PG] },
    { code: '50THANKSC107', reward: '1,000 Dia', status: 'expired', sources: [PG] },
  ],
};
