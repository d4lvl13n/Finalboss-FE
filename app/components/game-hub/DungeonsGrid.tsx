// Dungeons & bosses grid. Server component.

import Link from 'next/link';
import type { DungeonEntity } from '@/app/lib/game-hub/types';
import { entityPath } from './format';
import { SectionHeading } from './ui';

function kindLabel(kind?: 'dungeon' | 'world_boss'): string {
  return kind === 'world_boss' ? 'World boss' : 'Dungeon';
}

export default function DungeonsGrid({
  gameSlug,
  dungeons,
  intro,
}: {
  gameSlug: string;
  dungeons: DungeonEntity[];
  intro?: string;
}) {
  if (!dungeons.length) return null;
  return (
    <section>
      <SectionHeading>Dungeons &amp; Bosses</SectionHeading>
      {intro && <p className="mb-5 max-w-3xl text-gray-400 leading-relaxed">{intro}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {dungeons.map((d) => (
          <Link
            key={d.slug}
            href={entityPath(gameSlug, 'dungeon', d.slug)}
            className="block bg-gray-800 rounded-lg p-5 shadow-lg transition hover:ring-1 hover:ring-yellow-400/40"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-white font-semibold">{d.canonicalName}</h3>
              <span
                className={`flex-shrink-0 rounded-full text-[11px] px-2 py-0.5 font-bold ${
                  d.attributes.kind === 'world_boss'
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                {kindLabel(d.attributes.kind)}
              </span>
            </div>
            {d.attributes.summary && (
              <p className="text-gray-400 text-sm mt-1">{d.attributes.summary}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
