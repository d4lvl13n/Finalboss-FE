// "What's New" timeline — warm FinalBoss idiom. Server component.

import type { HubTimelineEvent } from '@/app/lib/game-hub/types';
import { SectionHeading, Panel, Pill } from './ui';

const KIND_LABEL: Record<HubTimelineEvent['kind'], string> = {
  collab: 'Collab',
  update: 'Update',
  class_release: 'New class',
  event: 'Event',
};

function eventDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function HubTimeline({ events }: { events: HubTimelineEvent[] }) {
  if (!events.length) return null;
  return (
    <section>
      <SectionHeading>What&apos;s New</SectionHeading>
      <Panel>
        <ol>
          {events.map((e, i) => (
            <li key={`${e.date}-${i}`} className="border-l-2 border-yellow-500/40 pl-4 pb-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-yellow-400 font-semibold text-sm">{eventDate(e.date)}</span>
                <Pill>{KIND_LABEL[e.kind]}</Pill>
              </div>
              <div className="mt-1 text-gray-200">{e.title}</div>
            </li>
          ))}
        </ol>
      </Panel>
    </section>
  );
}
