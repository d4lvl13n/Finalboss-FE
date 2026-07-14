// Generic detail body for dungeon / system entities. Server component.

import Link from 'next/link';
import type { GameplayEntity, GameplayEntityType } from '@/app/lib/game-hub/types';
import type { EntityDetail } from './entity-detail';
import { entityPath } from './format';
import SourceList from './SourceList';

/** Best-effort map of an entity's type to a gameplay route segment. */
function typeOf(entity: GameplayEntity): GameplayEntityType {
  const t = entity.entityType;
  if (t === 'class' || t === 'code' || t === 'dungeon' || t === 'system') return t;
  return 'system';
}

export default function EntityDetailGeneric({ detail }: { detail: EntityDetail }) {
  const { gameSlug, entity, related } = detail;
  const attrs = entity.attributes as { kind?: 'dungeon' | 'world_boss'; summary?: string };

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{entity.canonicalName}</h1>
        {attrs.kind ? (
          <span
            className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
              attrs.kind === 'world_boss'
                ? 'bg-amber-400/10 text-amber-400'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            {attrs.kind === 'world_boss' ? 'World boss' : 'Dungeon'}
          </span>
        ) : null}
      </header>

      <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
        {attrs.summary ? (
          <p className="text-sm text-gray-300">{attrs.summary}</p>
        ) : (
          <p className="text-sm text-gray-500">No summary available yet.</p>
        )}
        <SourceList sources={entity.sources} />
      </section>

      {related.length > 0 && (
        <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-cyan-400">
            Related
          </h2>
          <div className="flex flex-wrap gap-2">
            {related.map(({ label, entity: rel }) => (
              <Link
                key={`${label}-${rel.slug}`}
                href={entityPath(gameSlug, typeOf(rel), rel.slug)}
                className="group flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-1.5 transition-colors hover:border-gray-700 hover:bg-gray-900"
              >
                <span className="text-[11px] uppercase tracking-wide text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                  {rel.canonicalName}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
