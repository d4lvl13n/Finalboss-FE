// Class card — warm FinalBoss game-page idiom (bg-gray-800 content card). Server component.

import Link from 'next/link';
import type { ClassEntity, GameplayEntityType } from '@/app/lib/game-hub/types';
import type { TierAxis } from '@/app/lib/game-hub/blueprints';
import { entityPath } from './format';
import { TierBadge } from './ui';

const DEFAULT_AXES: TierAxis[] = [
  { key: 'pve', label: 'PvE', attr: 'pveTier' },
  { key: 'pvp', label: 'PvP', attr: 'pvpTier' },
];

export default function ClassCard({
  gameSlug,
  cls,
  unitType = 'class',
  axes = DEFAULT_AXES,
}: {
  gameSlug: string;
  cls: ClassEntity;
  unitType?: GameplayEntityType;
  axes?: TierAxis[];
}) {
  const a = cls.attributes;
  return (
    <Link
      href={entityPath(gameSlug, unitType, cls.slug)}
      className="block bg-gray-800 rounded-lg p-4 shadow-lg transition hover:ring-1 hover:ring-yellow-400/40"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-white">{cls.canonicalName}</h3>
          {a.role ? <p className="text-sm text-gray-400 mt-1">{a.role}</p> : null}
        </div>
        {a.isNew ? (
          <span className="bg-yellow-400 text-gray-900 text-[11px] font-bold px-2 py-0.5 rounded-full">
            NEW
          </span>
        ) : null}
      </div>

      {(a.rarity || a.element) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
          {a.rarity ? (
            <span className="rounded-full bg-gray-700 px-2 py-0.5 font-semibold text-amber-300">{a.rarity}</span>
          ) : null}
          {a.element ? <span className="rounded-full bg-gray-700 px-2 py-0.5 text-gray-300">{a.element}</span> : null}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {axes.map((ax) => (
          <TierBadge key={ax.key} label={ax.short || ax.label} tier={a[ax.attr]} />
        ))}
      </div>
    </Link>
  );
}
