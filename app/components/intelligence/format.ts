// Small presentational helpers for the intelligence surface.
import type { CoveragePoint, Term } from '@/app/lib/knowledge/types';

/** MI keyword/cluster items may be plain strings or {keyword|topic, count} objects. */
export function termLabel(t: Term): string {
  if (typeof t === 'string') return t;
  return t?.keyword ?? t?.topic ?? '';
}
export const clusterLabel = termLabel; // alias — clusters share the same shape

export function latestCoverage(coverage: CoveragePoint[]): CoveragePoint | null {
  return coverage.length ? coverage[coverage.length - 1] : null;
}

export function sentimentLabel(score: number | null | undefined): { label: string; tone: string } {
  if (score === null || score === undefined) return { label: 'Unknown', tone: 'text-gray-400' };
  if (score <= -0.25) return { label: 'Negative', tone: 'text-red-400' };
  if (score >= 0.25) return { label: 'Positive', tone: 'text-emerald-400' };
  return { label: 'Neutral', tone: 'text-gray-300' };
}

export function pct(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${Math.round(value)}%`;
}

export function trendArrow(value: number | null | undefined): string {
  if (value === null || value === undefined) return '·';
  if (value > 5) return '▲';
  if (value < -5) return '▼';
  return '→';
}

export function shortDate(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

export function relativeDate(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    const d = new Date(iso).getTime();
    const diff = Date.now() - d;
    const days = Math.floor(diff / 86400000);
    if (days <= 0) return 'today';
    if (days === 1) return '1d ago';
    if (days < 30) return `${days}d ago`;
    return shortDate(iso);
  } catch {
    return '';
  }
}
