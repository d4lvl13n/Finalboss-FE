// Live "News & Buzz" module powered by the GPBot Knowledge API (coverage +
// trending topics + latest headlines). Server component. Reusable: renders for
// any local hub whose slug resolves to a Knowledge-API entity. `keywords`
// (game name + aliases) filters out the KG's cross-language / off-topic noise.

import type { CoveragePoint, TopicSnapshot, ContentItem } from '@/app/lib/game-hub/types';
import { SectionHeading, Panel } from './ui';
import { latestCoverage, sentimentLabel, termLabel, relativeDate } from '@/app/components/intelligence/format';

export default function KGNews({
  coverage,
  topic,
  content,
  keywords = [],
  intro,
}: {
  coverage: CoveragePoint[];
  topic: TopicSnapshot | null;
  content: ContentItem[];
  keywords?: string[];
  intro?: string;
}) {
  const latest = latestCoverage(coverage);
  const topics = (topic?.topKeywords || []).map(termLabel).filter(Boolean).slice(0, 8);

  const kw = keywords.map((k) => k.toLowerCase()).filter(Boolean);
  const relevant = kw.length
    ? content.filter((c) => kw.some((k) => c.title?.toLowerCase().includes(k)))
    : content;
  const items = (relevant.length ? relevant : content).slice(0, 6);

  if (!latest && topics.length === 0 && items.length === 0) return null;

  const sentiment = sentimentLabel(latest?.weightedSentimentScore);

  return (
    <section>
      <SectionHeading>Latest News &amp; Buzz</SectionHeading>
      {intro && <p className="mb-5 max-w-3xl text-gray-400 leading-relaxed">{intro}</p>}
      <Panel>
        {latest && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Metric label="Articles" value={String(latest.articleCount ?? '—')} sub="latest day" />
            <Metric label="Sources" value={String(latest.uniqueSourcesCount ?? '—')} sub="distinct outlets" />
            <Metric label="Mentions" value={String(latest.rawMentionsCount ?? '—')} sub="that day" />
            <Metric label="Sentiment" value={sentiment.label} valueClass={sentiment.tone} />
          </div>
        )}

        {topics.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-xs uppercase tracking-widest text-yellow-400">Trending</p>
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => (
                <span key={t} className="rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-200">{t}</span>
              ))}
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-xs uppercase tracking-widest text-yellow-400">Latest headlines</p>
            <ul className="space-y-2">
              {items.map((it) => (
                <li key={it.id} className="text-sm">
                  <a href={it.url} target="_blank" rel="nofollow noopener" className="text-gray-200 hover:text-yellow-300">
                    {it.title}
                  </a>
                  <span className="ml-2 text-gray-500">
                    {it.source}
                    {it.publishedAt ? ` · ${relativeDate(it.publishedAt)}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Panel>
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
