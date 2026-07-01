import type { CoveragePoint } from '@/app/lib/knowledge/types';
import { shortDate } from './format';

// Lightweight inline-SVG bar chart (server-rendered, no client JS / chart lib).
export default function CoverageTrend({ coverage }: { coverage: CoveragePoint[] }) {
  if (!coverage.length) return null;
  const W = 600;
  const H = 120;
  const gap = 2;
  const n = coverage.length;
  const barW = (W - gap * (n - 1)) / n;
  const max = Math.max(1, ...coverage.map((c) => c.rawMentionsCount || c.articleCount || 0));

  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Coverage trend</h2>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-full" preserveAspectRatio="none" role="img" aria-label="Coverage over time">
        {coverage.map((c, i) => {
          const v = c.rawMentionsCount || c.articleCount || 0;
          const h = Math.max(2, (v / max) * (H - 4));
          const neg = (c.weightedSentimentScore ?? 0) < -0.1;
          return (
            <rect
              key={c.date}
              x={i * (barW + gap)}
              y={H - h}
              width={barW}
              height={h}
              rx={1}
              className={neg ? 'fill-red-500/70' : 'fill-cyan-500/70'}
            />
          );
        })}
      </svg>
      <div className="mt-1 flex justify-between text-xs text-gray-600">
        <span>{shortDate(coverage[0].date)}</span>
        <span>{shortDate(coverage[coverage.length - 1].date)}</span>
      </div>
    </section>
  );
}
