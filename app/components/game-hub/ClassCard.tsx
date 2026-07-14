// Compact class card — mirrors HandheldCard idiom. Server component.

import Link from 'next/link';
import type { ClassEntity } from '@/app/lib/game-hub/types';
import { entityPath, tierTone } from './format';

export default function ClassCard({ gameSlug, cls }: { gameSlug: string; cls: ClassEntity }) {
  const a = cls.attributes;
  return (
    <Link
      href={entityPath(gameSlug, 'class', cls.slug)}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 transition-colors hover:border-gray-700 hover:bg-gray-900"
    >
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-gray-100 group-hover:text-white">
            {cls.canonicalName}
          </h3>
          {a.isNew ? (
            <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[11px] font-medium text-amber-400">
              NEW
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {a.role ? (
            <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[11px] font-medium text-gray-300">
              {a.role}
            </span>
          ) : null}
          {a.weapon ? (
            <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[11px] font-medium text-gray-300">
              {a.weapon}
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex items-center gap-4 pt-4 text-[11px]">
          <span className="text-gray-500">
            PvE <span className={`font-semibold ${tierTone(a.pveTier)}`}>{a.pveTier || '—'}</span>
          </span>
          <span className="text-gray-500">
            PvP <span className={`font-semibold ${tierTone(a.pvpTier)}`}>{a.pvpTier || '—'}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
