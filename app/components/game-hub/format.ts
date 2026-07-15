// Small presentational helpers for the game-hub (gameplay) surface.
import type { GameplayEntityType } from '@/app/lib/game-hub/types';

/** Tailwind text color for a tier letter. S→amber, A→emerald, B→cyan, C/D→gray, unknown→muted. */
export function tierTone(tier?: string): string {
  const t = (tier || '').trim().toUpperCase();
  if (t === 'S' || t === 'SS' || t === 'S+') return 'text-amber-400';
  if (t === 'A') return 'text-emerald-400';
  if (t === 'B') return 'text-cyan-300';
  if (t === 'C' || t === 'D') return 'text-gray-400';
  return 'text-gray-500';
}

/** Canonical path for a gameplay entity detail page. */
export function entityPath(gameSlug: string, type: GameplayEntityType, slug: string): string {
  return `/game/${gameSlug}/${type}/${slug}`;
}
