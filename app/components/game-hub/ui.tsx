// Shared presentational tokens for the game hub — lifted verbatim from
// GameDetails.tsx so the hub reads as the SAME FinalBoss game page: gradient
// background, yellow-400 gradient-divider headings, bg-gray-800 shadow cards,
// rounded-full pills. Do not introduce new colors or a new card idiom here.

import React from 'react';

/** Yellow heading with the gradient divider — the GameDetails section header. */
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mr-4 whitespace-nowrap">{children}</h2>
      <div className="flex-grow h-0.5 md:h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full" />
    </div>
  );
}

/** The GameDetails content card. */
export function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-gray-800 rounded-lg p-6 shadow-xl ${className}`}>{children}</div>;
}

/** Rounded-full pill (facts/tag style). */
export function Pill({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`text-sm bg-gray-700 text-gray-200 px-3 py-1 rounded-full ${className}`}>{children}</span>;
}

/** Small uppercase label used above pill groups in the facts card. */
export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs uppercase tracking-widest text-yellow-400 mb-2">{children}</p>;
}

/** Tier badge coloring — warm palette anchored on the yellow rating pill. */
export function tierPillClass(tier?: string): string {
  switch ((tier || '').toUpperCase()) {
    case 'S':
      return 'bg-yellow-400 text-gray-900';
    case 'A':
      return 'bg-emerald-500 text-gray-900';
    case 'B':
      return 'bg-sky-500 text-white';
    case 'C':
      return 'bg-gray-600 text-gray-100';
    case 'D':
      return 'bg-gray-700 text-gray-300';
    default:
      return 'bg-gray-700 text-gray-400';
  }
}

/** A compact tier badge (e.g. "PvE S"). */
export function TierBadge({ label, tier }: { label: string; tier?: string }) {
  if (!tier) return null;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${tierPillClass(tier)}`}>
      <span className="opacity-70">{label}</span>
      {tier}
    </span>
  );
}

export const TIER_ORDER = ['S', 'A', 'B', 'C', 'D'] as const;
