import type { TopicSnapshot } from '@/app/lib/knowledge/types';
import { termLabel } from './format';

export default function TopicsPanel({ topic }: { topic: TopicSnapshot | null }) {
  if (!topic) return null;
  const emerging = (topic.emergingKeywords || []).map(termLabel).filter(Boolean);
  const fading = (topic.fadingKeywords || []).map(termLabel).filter(Boolean);
  const keywords = (topic.topKeywords || []).map(termLabel).filter(Boolean);
  if (!emerging.length && !fading.length && !keywords.length) return null;

  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">What people are talking about</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Column title="▲ Emerging this week" items={emerging} tone="text-emerald-400" />
        <Column title="▼ Fading" items={fading} tone="text-gray-500" />
      </div>
      {keywords.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {keywords.slice(0, 10).map((k) => (
            <span key={k} className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300">{k}</span>
          ))}
        </div>
      )}
    </section>
  );
}

function Column({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  if (!items.length) return null;
  return (
    <div>
      <div className={`mb-2 text-xs font-medium uppercase tracking-wide ${tone}`}>{title}</div>
      <ul className="space-y-1 text-sm text-gray-300">
        {items.slice(0, 6).map((k) => (
          <li key={k}>{k}</li>
        ))}
      </ul>
    </div>
  );
}
