// Game systems grid. Server component.

import Link from 'next/link';
import type { SystemEntity } from '@/app/lib/game-hub/types';
import { entityPath } from './format';
import { SectionHeading } from './ui';

export default function SystemsGrid({
  gameSlug,
  systems,
}: {
  gameSlug: string;
  systems: SystemEntity[];
}) {
  if (!systems.length) return null;
  return (
    <section>
      <SectionHeading>Systems</SectionHeading>
      <div className="grid gap-4 md:grid-cols-2">
        {systems.map((s) => (
          <Link
            key={s.slug}
            href={entityPath(gameSlug, 'system', s.slug)}
            className="block bg-gray-800 rounded-lg p-5 shadow-lg transition hover:ring-1 hover:ring-yellow-400/40"
          >
            <h3 className="text-white font-semibold">{s.canonicalName}</h3>
            {s.attributes.summary && (
              <p className="text-gray-400 text-sm mt-1">{s.attributes.summary}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
