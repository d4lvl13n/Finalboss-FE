// Class card — warm FinalBoss game-page idiom (bg-gray-800 content card). Server component.

import Link from 'next/link';
import type { ClassEntity } from '@/app/lib/game-hub/types';
import { entityPath } from './format';
import { TierBadge } from './ui';

export default function ClassCard({ gameSlug, cls }: { gameSlug: string; cls: ClassEntity }) {
  const a = cls.attributes;
  return (
    <Link
      href={entityPath(gameSlug, 'class', cls.slug)}
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

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <TierBadge label="PvE" tier={a.pveTier} />
        <TierBadge label="PvP" tier={a.pvpTier} />
      </div>
    </Link>
  );
}
