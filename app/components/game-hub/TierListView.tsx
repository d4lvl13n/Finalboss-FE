'use client';

// Interactive tier list, one toggle per blueprint tier axis (PvE/PvP for RPGs;
// Story / Boss Raid / Mirror War / Guild Raid for gacha). Warm FinalBoss idiom,
// no chart libs. Client component.

import { useState } from 'react';
import Link from 'next/link';
import type { ClassAttributes, ClassEntity, GameplayEntityType } from '@/app/lib/game-hub/types';
import type { TierAxis } from '@/app/lib/game-hub/blueprints';
import { entityPath } from './format';
import { SectionHeading, Panel, tierPillClass, TIER_ORDER } from './ui';

export default function TierListView({
  gameSlug,
  classes,
  axes,
  articleUrl,
  intro,
  unitType = 'class',
  heading = 'Class Tier List',
}: {
  gameSlug: string;
  classes: ClassEntity[];
  axes: TierAxis[];
  articleUrl?: string;
  intro?: string;
  unitType?: GameplayEntityType;
  heading?: string;
}) {
  const [axisKey, setAxisKey] = useState(axes[0]?.key);
  const axis = axes.find((x) => x.key === axisKey) || axes[0];

  const tierOf = (cls: ClassEntity): string =>
    (((cls.attributes as ClassAttributes)[axis.attr] as string | undefined) || '').trim().toUpperCase();

  const rows = TIER_ORDER.map((tier) => ({
    tier,
    members: classes.filter((c) => tierOf(c) === tier),
  })).filter((r) => r.members.length > 0);

  return (
    <section>
      <SectionHeading>{heading}</SectionHeading>
      {intro && <p className="mb-5 max-w-3xl text-gray-400 leading-relaxed">{intro}</p>}
      <Panel>
        <div className="mb-6 flex flex-wrap gap-2">
          {axes.map((ax) => (
            <button
              key={ax.key}
              type="button"
              onClick={() => setAxisKey(ax.key)}
              className={`rounded-full px-4 py-1 text-sm font-semibold uppercase tracking-wide transition ${
                axis.key === ax.key ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {ax.label}
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
                    href={entityPath(gameSlug, unitType, cls.slug)}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-full px-3 py-1 text-sm transition"
                  >
                    {cls.canonicalName}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <p className="text-sm text-gray-500">No {axis.label} tiers ranked yet — check back after the next patch.</p>
          )}
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
