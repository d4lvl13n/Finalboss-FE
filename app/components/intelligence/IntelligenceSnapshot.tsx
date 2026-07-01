import type { CoveragePoint, TopicSnapshot } from '@/app/lib/knowledge/types';
import { latestCoverage, sentimentLabel, pct, trendArrow, termLabel } from './format';

export default function IntelligenceSnapshot({
  coverage,
  topic,
  lastBuiltAt,
}: {
  coverage: CoveragePoint[];
  topic: TopicSnapshot | null;
  lastBuiltAt?: string | null;
}) {
  const latest = latestCoverage(coverage);
  const sentiment = sentimentLabel(latest?.weightedSentimentScore);
  const rawTopics = topic?.topicClusters?.length ? topic.topicClusters : topic?.topKeywords || [];
  const topics = rawTopics.map(termLabel).filter(Boolean).slice(0, 4);
  const narrative = topic?.narrativeSummary?.short;

  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-400">FinalBoss Intelligence</h2>
        {lastBuiltAt && (
          <span className="text-xs text-gray-500">
            updated {new Date(lastBuiltAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Metric label="Coverage" value={`${trendArrow(latest?.coverageVs7dAvgPct)} ${pct(latest?.coverageVs7dAvgPct)}`} sub="vs 7-day avg" />
        <Metric label="Sentiment" value={sentiment.label} valueClass={sentiment.tone} sub={latest?.weightedSentimentScore != null ? latest.weightedSentimentScore.toFixed(2) : '—'} />
        <Metric label="Sources" value={String(latest?.uniqueSourcesCount ?? '—')} sub="distinct outlets" />
        <Metric label="Articles" value={String(latest?.articleCount ?? '—')} sub="latest day" />
      </div>

      {topics.length > 0 && (
        <p className="mt-4 text-sm text-gray-300">
          <span className="text-gray-500">Top topics: </span>
          {topics.join(' · ')}
        </p>
      )}
      {narrative && <p className="mt-3 border-l-2 border-cyan-700 pl-3 text-sm italic text-gray-300">{narrative}</p>}
    </section>
  );
}

function Metric({ label, value, sub, valueClass = 'text-white' }: { label: string; value: string; sub?: string; valueClass?: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`text-xl font-semibold ${valueClass}`}>{value}</div>
      {sub && <div className="text-xs text-gray-500">{sub}</div>}
    </div>
  );
}
