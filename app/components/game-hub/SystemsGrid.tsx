// Game systems grid. Server component.

import Link from 'next/link';
import type { SystemEntity } from '@/app/lib/game-hub/types';
import { entityPath } from './format';

export default function SystemsGrid({
  gameSlug,
  systems,
}: {
  gameSlug: string;
  systems: SystemEntity[];
}) {
  if (!systems.length) return null;
  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-cyan-400">Systems</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {systems.map((s) => (
          <Link
            key={s.slug}
            href={entityPath(gameSlug, 'system', s.slug)}
            className="group flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition-colors hover:border-gray-700 hover:bg-gray-900"
          >
            <h3 className="text-sm font-semibold leading-snug text-gray-100 group-hover:text-white">
              {s.canonicalName}
            </h3>
            {s.attributes.summary && (
              <p className="mt-2 text-sm text-gray-400">{s.attributes.summary}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
