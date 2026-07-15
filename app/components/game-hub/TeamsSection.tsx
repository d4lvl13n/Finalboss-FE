// Recommended Teams — warm FinalBoss idiom. Server component. Reusable across
// blueprints; unit chips link to their unit pages when a roster slug is set.

import Link from 'next/link';
import type { TeamComp, GameplayEntityType } from '@/app/lib/game-hub/types';
import { SectionHeading, Panel } from './ui';
import { entityPath } from './format';
import SourceList from './SourceList';

export default function TeamsSection({
  gameSlug,
  teams,
  unitType = 'class',
  intro,
}: {
  gameSlug: string;
  teams: TeamComp[];
  unitType?: GameplayEntityType;
  intro?: string;
}) {
  if (!teams.length) return null;
  return (
    <section>
      <SectionHeading>Recommended Teams</SectionHeading>
      {intro && <p className="mb-5 max-w-3xl text-gray-400 leading-relaxed">{intro}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {teams.map((t, i) => (
          <Panel key={i}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-white">{t.name}</h3>
              {t.context && (
                <span className="rounded-full bg-gray-700 px-2 py-0.5 text-[11px] text-gray-200">{t.context}</span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {t.units.map((u) =>
                u.slug ? (
                  <Link
                    key={u.slug}
                    href={entityPath(gameSlug, unitType, u.slug)}
                    className="rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-100 transition hover:bg-gray-600"
                  >
                    {u.name}
                  </Link>
                ) : (
                  <span key={u.name} className="rounded-full bg-gray-700/60 px-3 py-1 text-sm text-gray-300">
                    {u.name}
                  </span>
                )
              )}
            </div>
            {t.note && <p className="mt-3 text-sm leading-relaxed text-gray-300">{t.note}</p>}
            {t.sources.length > 0 && (
              <div className="mt-3">
                <SourceList sources={t.sources} />
              </div>
            )}
          </Panel>
        ))}
      </div>
    </section>
  );
}
