// Classes roster grid. Server component.

import type { ClassEntity, GameplayEntityType } from '@/app/lib/game-hub/types';
import type { TierAxis } from '@/app/lib/game-hub/blueprints';
import ClassCard from './ClassCard';
import { SectionHeading } from './ui';

export default function ClassRoster({
  gameSlug,
  classes,
  intro,
  unitType = 'class',
  label = 'Classes',
  axes,
}: {
  gameSlug: string;
  classes: ClassEntity[];
  intro?: string;
  unitType?: GameplayEntityType;
  label?: string;
  axes?: TierAxis[];
}) {
  if (!classes.length) return null;
  return (
    <section>
      <SectionHeading>{label}</SectionHeading>
      {intro && <p className="mb-5 max-w-3xl text-gray-400 leading-relaxed">{intro}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <ClassCard key={cls.slug} gameSlug={gameSlug} cls={cls} unitType={unitType} axes={axes} />
        ))}
      </div>
    </section>
  );
}
