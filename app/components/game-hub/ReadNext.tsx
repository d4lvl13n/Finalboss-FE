// "Read next on FinalBoss" — internal article links (absolute urls). Server component.

import type { ReadNext as ReadNextItem } from '@/app/lib/game-hub/types';

const KIND_LABEL: Record<NonNullable<ReadNextItem['kind']>, string> = {
  review: 'Review',
  guide: 'Guide',
  tier_list: 'Tier list',
  article: 'Article',
};

export default function ReadNext({ articles }: { articles: ReadNextItem[] }) {
  if (!articles.length) return null;
  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-cyan-400">
        Read next on FinalBoss
      </h2>
      <ul className="space-y-2">
        {articles.map((a) => (
          <li key={a.url}>
            <a
              href={a.url}
              className="group flex items-center justify-between gap-3 rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-2 transition-colors hover:border-gray-700 hover:bg-gray-900"
            >
              <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                {a.title}
              </span>
              {a.kind && (
                <span className="flex-shrink-0 rounded bg-gray-800 px-1.5 py-0.5 text-[11px] font-medium text-gray-300">
                  {KIND_LABEL[a.kind]}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
