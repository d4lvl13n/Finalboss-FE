// Dungeons & bosses grid. Server component.

import Link from 'next/link';
import type { DungeonEntity } from '@/app/lib/game-hub/types';
import { entityPath } from './format';

function kindLabel(kind?: 'dungeon' | 'world_boss'): string {
  return kind === 'world_boss' ? 'World boss' : 'Dungeon';
}

export default function DungeonsGrid({
  gameSlug,
  dungeons,
}: {
  gameSlug: string;
  dungeons: DungeonEntity[];
}) {
  if (!dungeons.length) return null;
  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-cyan-400">
        Dungeons &amp; Bosses
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dungeons.map((d) => (
          <Link
            key={d.slug}
            href={entityPath(gameSlug, 'dungeon', d.slug)}
            className="group flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition-colors hover:border-gray-700 hover:bg-gray-900"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold leading-snug text-gray-100 group-hover:text-white">
                {d.canonicalName}
              </h3>
              <span
                className={`flex-shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium ${
                  d.attributes.kind === 'world_boss'
                    ? 'bg-amber-400/10 text-amber-400'
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                {kindLabel(d.attributes.kind)}
              </span>
            </div>
            {d.attributes.summary && (
              <p className="mt-2 text-sm text-gray-400">{d.attributes.summary}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
