// Generic detail body for dungeon / system entities. Warm FinalBoss idiom. Server component.
// No outer <main>: the route supplies the gradient bg + container.

import Link from 'next/link';
import type { GameplayEntity, GameplayEntityType } from '@/app/lib/game-hub/types';
import type { EntityDetail } from './entity-detail';
import { entityPath } from './format';
import SourceList from './SourceList';
import { Panel } from './ui';

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
    <div className="space-y-8">
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl md:text-4xl font-bold text-white">{entity.canonicalName}</h1>
        {attrs.kind ? (
          <span
            className={`rounded-full text-[11px] px-2 py-0.5 font-bold ${
              attrs.kind === 'world_boss'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-700 text-gray-200'
            }`}
          >
            {attrs.kind === 'world_boss' ? 'World boss' : 'Dungeon'}
          </span>
        ) : null}
      </header>

      <Panel>
        {attrs.summary ? (
          <p className="text-gray-300 leading-relaxed">{attrs.summary}</p>
        ) : (
          <p className="text-gray-400">No summary available yet.</p>
        )}
      </Panel>

      {related.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-yellow-400 mb-4">Related</h3>
          <div className="flex flex-wrap gap-2">
            {related.map(({ label, entity: rel }) => (
              <Link
                key={`${label}-${rel.slug}`}
                href={entityPath(gameSlug, typeOf(rel), rel.slug)}
                className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 rounded-full px-3 py-1 text-sm transition"
              >
                <span className="text-[11px] uppercase tracking-wide text-yellow-400">{label}</span>
                <span className="text-gray-100">{rel.canonicalName}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <SourceList sources={entity.sources} />
    </div>
  );
}
