// Class detail body. Server component.

import Link from 'next/link';
import type {
  ClassAttributes,
  GameplayEntity,
  GameplayEntityType,
} from '@/app/lib/game-hub/types';
import type { EntityDetail } from './entity-detail';
import { entityPath, tierTone } from './format';
import SourceList from './SourceList';

function FactRow({
  label,
  value,
  valueClass = 'text-gray-100',
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`text-sm font-medium ${valueClass}`}>{value}</div>
    </div>
  );
}

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
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{entity.canonicalName}</h1>
        {a.isNew ? (
          <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[11px] font-medium text-amber-400">
            NEW
          </span>
        ) : null}
      </header>

      <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-cyan-400">Spec</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <FactRow label="Role" value={a.role || '—'} />
          <FactRow label="Weapon" value={a.weapon || '—'} />
          <FactRow label="PvE tier" value={a.pveTier || '—'} valueClass={tierTone(a.pveTier)} />
          <FactRow label="PvP tier" value={a.pvpTier || '—'} valueClass={tierTone(a.pvpTier)} />
        </div>

        {a.playstyle && (
          <div className="mt-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Playstyle</div>
            <p className="mt-1 text-sm text-gray-300">{a.playstyle}</p>
          </div>
        )}

        {a.skills && a.skills.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {a.skills.map((s) => (
                <span
                  key={s}
                  className="rounded bg-gray-800 px-1.5 py-0.5 text-[11px] font-medium text-gray-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {a.advancedClasses && a.advancedClasses.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">Advanced classes</div>
            <div className="flex flex-wrap gap-1.5">
              {a.advancedClasses.map((s) => (
                <span
                  key={s}
                  className="rounded bg-gray-800 px-1.5 py-0.5 text-[11px] font-medium text-gray-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <SourceList sources={entity.sources} />
      </section>

      {related.length > 0 && (
        <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-cyan-400">
            Synergies &amp; counters
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
