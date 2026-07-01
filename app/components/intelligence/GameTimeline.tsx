import type { TimelineEvent } from '@/app/lib/knowledge/types';
import { shortDate } from './format';

export default function GameTimeline({ events }: { events: TimelineEvent[] }) {
  if (!events.length) return null;
  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">Timeline · media intelligence</h2>
      <ol className="space-y-4">
        {events.map((e) => {
          const signal = e.eventClass === 'media_signal';
          return (
            <li key={e.id} className="relative border-l border-gray-800 pl-4">
              <span className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ${signal ? 'bg-cyan-500' : 'bg-emerald-500'}`} />
              <div className="text-xs text-gray-500">{shortDate(e.date)}{signal ? ' · signal' : ''}</div>
              <div className="text-sm font-medium text-gray-200">{e.title}</div>
              {e.summary && <p className="text-sm text-gray-400">{e.summary}</p>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
