// Classes roster grid. Server component.

import type { ClassEntity } from '@/app/lib/game-hub/types';
import ClassCard from './ClassCard';
import { SectionHeading } from './ui';

export default function ClassRoster({
  gameSlug,
  classes,
}: {
  gameSlug: string;
  classes: ClassEntity[];
}) {
  if (!classes.length) return null;
  return (
    <section>
      <SectionHeading>Classes</SectionHeading>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <ClassCard key={cls.slug} gameSlug={gameSlug} cls={cls} />
        ))}
      </div>
    </section>
  );
}
