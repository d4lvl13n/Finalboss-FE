// Classes roster grid. Server component.

import type { ClassEntity } from '@/app/lib/game-hub/types';
import ClassCard from './ClassCard';

export default function ClassRoster({
  gameSlug,
  classes,
}: {
  gameSlug: string;
  classes: ClassEntity[];
}) {
  if (!classes.length) return null;
  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-cyan-400">Classes</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {classes.map((cls) => (
          <ClassCard key={cls.slug} gameSlug={gameSlug} cls={cls} />
        ))}
      </div>
    </section>
  );
}
