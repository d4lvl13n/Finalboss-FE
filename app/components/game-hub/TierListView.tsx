'use client';

// Interactive PvE ⇄ PvP tier list. Plain divs, no chart libs. Client component.

import { useState } from 'react';
import Link from 'next/link';
import type { ClassEntity } from '@/app/lib/game-hub/types';
import { entityPath, tierTone } from './format';

type Mode = 'pve' | 'pvp';

const TIER_ORDER = ['S', 'A', 'B', 'C', 'D'] as const;

export default function TierListView({
  gameSlug,
  classes,
  articleUrl,
}: {
  gameSlug: string;
  classes: ClassEntity[];
  articleUrl?: string;
}) {
  const [mode, setMode] = useState<Mode>('pve');

  const tierOf = (cls: ClassEntity): string =>
    ((mode === 'pve' ? cls.attributes.pveTier : cls.attributes.pvpTier) || '').trim().toUpperCase();

  const rows = TIER_ORDER.map((tier) => ({
    tier,
    members: classes.filter((c) => tierOf(c) === tier),
  })).filter((r) => r.members.length > 0);

  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-400">Tier list</h2>
        <div className="flex gap-1.5">
          {(['pve', 'pvp'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide transition-colors ${
                mode === m
                  ? 'bg-cyan-400/10 text-cyan-400'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {rows.map(({ tier, members }) => (
          <div key={tier} className="flex items-stretch gap-3">
            <div
              className={`flex w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-800 bg-gray-950/40 text-lg font-bold ${tierTone(tier)}`}
            >
              {tier}
            </div>
            <div className="flex flex-1 flex-wrap gap-1.5">
              {members.map((cls) => (
                <Link
                  key={cls.slug}
                  href={entityPath(gameSlug, 'class', cls.slug)}
                  className="rounded bg-gray-800 px-1.5 py-0.5 text-[11px] font-medium text-gray-300 transition-colors hover:text-white"
                >
                  {cls.canonicalName}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {articleUrl && (
        <p className="mt-4 text-sm text-gray-500">
          <a href={articleUrl} className="transition-colors hover:text-cyan-400">
            See the full breakdown →
          </a>
        </p>
      )}
    </section>
  );
}
