// Class detail body. Warm FinalBoss game-page idiom. Server component.
// No outer <main>: the route supplies the gradient bg + container.

import Link from 'next/link';
import type {
  ClassAttributes,
  GameplayEntity,
  GameplayEntityType,
} from '@/app/lib/game-hub/types';
import type { EntityDetail } from './entity-detail';
import { entityPath } from './format';
import SourceList from './SourceList';
import { Panel, Pill, FieldLabel, TierBadge } from './ui';

/** Best-effort map of an entity's type to a gameplay route segment. */
function typeOf(entity: GameplayEntity): GameplayEntityType {
  const t = entity.entityType;
  if (t === 'class' || t === 'code' || t === 'dungeon' || t === 'system') return t;
  return 'class';
}

export default function ClassDetail({ detail }: { detail: EntityDetail }) {
  const { gameSlug, entity, related } = detail;
  const a = entity.attributes as ClassAttributes;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl md:text-4xl font-bold text-white">{entity.canonicalName}</h1>
        {a.isNew ? (
          <span className="bg-yellow-400 text-gray-900 text-[11px] font-bold px-2 py-0.5 rounded-full">
            NEW
          </span>
        ) : null}
      </header>

      <Panel>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <FieldLabel>Role</FieldLabel>
            <p className="text-gray-200">{a.role || '—'}</p>
          </div>
          <div>
            <FieldLabel>Weapon</FieldLabel>
            <p className="text-gray-200">{a.weapon || '—'}</p>
          </div>
          <div>
            <FieldLabel>PvE Tier</FieldLabel>
            {a.pveTier ? <TierBadge label="PvE" tier={a.pveTier} /> : <p className="text-gray-400">—</p>}
          </div>
          <div>
            <FieldLabel>PvP Tier</FieldLabel>
            {a.pvpTier ? <TierBadge label="PvP" tier={a.pvpTier} /> : <p className="text-gray-400">—</p>}
          </div>
        </div>
      </Panel>

      {a.playstyle && (
        <Panel>
          <FieldLabel>Playstyle</FieldLabel>
          <p className="text-gray-300 leading-relaxed">{a.playstyle}</p>
        </Panel>
      )}

      {((a.skills && a.skills.length > 0) ||
        (a.advancedClasses && a.advancedClasses.length > 0)) && (
        <Panel>
          <div className="space-y-6">
            {a.skills && a.skills.length > 0 && (
              <div>
                <FieldLabel>Skills</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {a.skills.map((s) => (
                    <Pill key={s}>{s}</Pill>
                  ))}
                </div>
              </div>
            )}

            {a.advancedClasses && a.advancedClasses.length > 0 && (
              <div>
                <FieldLabel>Advanced Classes</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {a.advancedClasses.map((s) => (
                    <Pill key={s}>{s}</Pill>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Panel>
      )}

      {related.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-yellow-400 mb-4">Synergies &amp; Counters</h3>
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
