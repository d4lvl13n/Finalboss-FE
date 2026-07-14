// "What's New" timeline — mirrors GameTimeline styling. Server component.

import type { HubTimelineEvent } from '@/app/lib/game-hub/types';

const KIND_LABEL: Record<HubTimelineEvent['kind'], string> = {
  collab: 'Collab',
  update: 'Update',
  class_release: 'New class',
  event: 'Event',
};

function dotColor(kind: HubTimelineEvent['kind']): string {
  if (kind === 'collab') return 'bg-amber-500';
  if (kind === 'class_release') return 'bg-cyan-500';
  return 'bg-emerald-500';
}

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
    <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
        What&apos;s New
      </h2>
      <ol className="space-y-4">
        {events.map((e, i) => (
          <li key={`${e.date}-${i}`} className="relative border-l border-gray-800 pl-4">
            <span
              className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ${dotColor(e.kind)}`}
            />
            <div className="text-xs text-gray-500">
              {eventDate(e.date)}
              <span className="ml-2 rounded bg-gray-800 px-1.5 py-0.5 text-[11px] font-medium text-gray-300">
                {KIND_LABEL[e.kind]}
              </span>
            </div>
            <div className="mt-1 text-sm font-medium text-gray-200">{e.title}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}
