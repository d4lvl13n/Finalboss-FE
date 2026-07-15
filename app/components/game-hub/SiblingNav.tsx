// Always-on roster interlinking. Renders the rest of an entity's roster (same
// type) as tappable chips with a tier badge, so every detail page links to its
// siblings — smooth navigation + internal-link equity. Server component.

import Link from 'next/link';
import type { GameplayEntityType } from '@/app/lib/game-hub/types';
import { entityPath } from './format';
import { SectionHeading, tierPillClass } from './ui';

export type SiblingLink = {
  slug: string;
  name: string;
  type: GameplayEntityType;
  tier?: string;
  isNew?: boolean;
};

export default function SiblingNav({
  gameSlug,
  heading,
  siblings,
}: {
  gameSlug: string;
  heading: string;
  siblings: SiblingLink[];
}) {
  if (!siblings.length) return null;
  return (
    <section>
      <SectionHeading>{heading}</SectionHeading>
      <div className="flex flex-wrap gap-2">
        {siblings.map((s) => (
          <Link
            key={`${s.type}-${s.slug}`}
            href={entityPath(gameSlug, s.type, s.slug)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 transition hover:border-gray-600 hover:bg-gray-700"
          >
            <span className="font-medium text-gray-100">{s.name}</span>
            {s.tier && (
              <span className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${tierPillClass(s.tier)}`}>
                {s.tier}
              </span>
            )}
            {s.isNew && <span className="text-[10px] font-bold uppercase tracking-wide text-yellow-400">New</span>}
          </Link>
        ))}
      </div>
    </section>
  );
}
