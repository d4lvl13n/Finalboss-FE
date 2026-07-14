// Classes roster grid. Server component.

import type { ClassEntity } from '@/app/lib/game-hub/types';
import ClassCard from './ClassCard';
import { SectionHeading } from './ui';

export default function ClassRoster({
  gameSlug,
  classes,
  intro,
}: {
  gameSlug: string;
  classes: ClassEntity[];
  intro?: string;
}) {
  if (!classes.length) return null;
  return (
    <section>
      <SectionHeading>Classes</SectionHeading>
      {intro && <p className="mb-5 max-w-3xl text-gray-400 leading-relaxed">{intro}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <ClassCard key={cls.slug} gameSlug={gameSlug} cls={cls} />
        ))}
      </div>
    </section>
  );
}
