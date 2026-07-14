'use client';

// Interactive PvE ⇄ PvP tier list. Warm FinalBoss idiom, no chart libs. Client component.

import { useState } from 'react';
import Link from 'next/link';
import type { ClassEntity } from '@/app/lib/game-hub/types';
import { entityPath } from './format';
import { SectionHeading, Panel, tierPillClass, TIER_ORDER } from './ui';

type Mode = 'pve' | 'pvp';

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
    <section>
      <SectionHeading>Class Tier List</SectionHeading>
      <Panel>
        <div className="flex gap-2 mb-6">
          {(['pve', 'pvp'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-1 text-sm font-semibold uppercase tracking-wide transition ${
                mode === m ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {rows.map(({ tier, members }) => (
            <div key={tier} className="flex items-start gap-4">
              <div
                className={`flex w-10 h-10 flex-shrink-0 items-center justify-center rounded-lg text-lg font-bold ${tierPillClass(
                  tier
                )}`}
              >
                {tier}
              </div>
              <div className="flex flex-1 flex-wrap gap-2 pt-0.5">
                {members.map((cls) => (
                  <Link
                    key={cls.slug}
                    href={entityPath(gameSlug, 'class', cls.slug)}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-full px-3 py-1 text-sm transition"
                  >
                    {cls.canonicalName}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {articleUrl && (
          <p className="mt-6">
            <a href={articleUrl} className="text-yellow-300 hover:text-yellow-200">
              See the full breakdown →
            </a>
          </p>
        )}
      </Panel>
    </section>
  );
}
