import type { ContentItem } from '@/app/lib/knowledge/types';
import { relativeDate } from './format';

// Rights-aware rendering: external items show title + source + link only.
// (V1 content is all `external`; owned/cluster handling lives in summaryPolicy.)
export default function LatestNews({ content }: { content: ContentItem[] }) {
  if (!content.length) return null;
  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Latest coverage</h2>
      <ul className="divide-y divide-gray-800">
        {content.map((c) => (
          <li key={c.id} className="py-3">
            <a
              href={c.canonicalUrl || c.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="group flex items-start justify-between gap-4"
            >
              <div>
                <div className="text-sm font-medium text-gray-200 group-hover:text-cyan-400">{c.title}</div>
                <div className="mt-0.5 text-xs text-gray-500">
                  {c.source}
                  {c.publishedAt ? ` · ${relativeDate(c.publishedAt)}` : ''}
                  {c.origin === 'owned' ? ' · FinalBoss' : ''}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
