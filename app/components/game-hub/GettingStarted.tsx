// Beginner / reroll guide — "who to pull first". Warm FinalBoss idiom.
// Server component.

import type { BeginnerGuide } from '@/app/lib/game-hub/types';
import { SectionHeading, Panel } from './ui';
import SourceList from './SourceList';

export default function GettingStarted({
  guide,
  label = 'Getting Started',
}: {
  guide: BeginnerGuide;
  label?: string;
}) {
  if (!guide.picks.length && !guide.summary) return null;
  const sources = Array.from(new Set(guide.picks.flatMap((p) => p.sources)));
  return (
    <section>
      <SectionHeading>{label}</SectionHeading>
      <Panel>
        {guide.summary && <p className="leading-relaxed text-gray-300">{guide.summary}</p>}
        {guide.picks.length > 0 && (
          <div className="mt-5">
            <p className="mb-3 text-xs uppercase tracking-widest text-yellow-400">Who to prioritise</p>
            <ul className="space-y-3">
              {guide.picks.map((p) => (
                <li key={p.name} className="border-l-2 border-yellow-500/40 pl-4">
                  <div className="font-semibold text-white">{p.name}</div>
                  <div className="text-sm text-gray-300">{p.note}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {sources.length > 0 && (
          <div className="mt-4">
            <SourceList sources={sources} />
          </div>
        )}
      </Panel>
    </section>
  );
}
