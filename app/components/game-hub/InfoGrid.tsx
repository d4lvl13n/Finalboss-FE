// Generic named-collection grid (maps, gear, enemies, vehicles…). Info cards,
// no detail routing. Server component. Warm FinalBoss idiom.

import type { NamedCollection } from '@/app/lib/game-hub/types';
import { SectionHeading } from './ui';

export default function InfoGrid({ collection, intro }: { collection: NamedCollection; intro?: string }) {
  if (!collection.entries.length) return null;
  return (
    <section>
      <SectionHeading>{collection.label}</SectionHeading>
      {intro && <p className="mb-5 max-w-3xl text-gray-400 leading-relaxed">{intro}</p>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {collection.entries.map((e) => (
          <div key={e.name} className="rounded-lg bg-gray-800 p-5 shadow-lg">
            <h3 className="font-semibold text-white">{e.name}</h3>
            {e.summary && <p className="mt-1 text-sm text-gray-400">{e.summary}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
