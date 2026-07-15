import type { CodeRecord } from '@/app/lib/game-hub/types';

// Diablo IV has no promotional / redemption code system — unlike the mobile
// Diablo Immortal, the PC/console game does not ship any in-game code-entry
// screen or public reward codes. Published honestly empty rather than
// fabricating codes; lastVerified tracks when we last checked.
export const CODES: { lastVerified: string; entries: CodeRecord[] } = {
  lastVerified: '2026-07-15',
  entries: [],
};
