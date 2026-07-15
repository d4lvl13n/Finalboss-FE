// FAQ block — warm FinalBoss idiom. Server component. FAQPage JSON-LD is
// emitted separately by the page (buildGameplayJsonLd).

import type { FaqItem } from '@/app/lib/game-hub/types';
import { SectionHeading, Panel } from './ui';
import SourceList from './SourceList';

export default function FaqSection({ items, intro }: { items: FaqItem[]; intro?: string }) {
  if (!items.length) return null;
  return (
    <section>
      <SectionHeading>FAQ</SectionHeading>
      {intro && <p className="mb-5 max-w-3xl text-gray-400 leading-relaxed">{intro}</p>}
      <div className="space-y-4">
        {items.map((f, i) => (
          <Panel key={i}>
            <h3 className="text-lg font-semibold text-white">{f.question}</h3>
            <p className="mt-2 leading-relaxed text-gray-300">{f.answer}</p>
            {f.sources && f.sources.length > 0 && (
              <div className="mt-3">
                <SourceList sources={f.sources} />
              </div>
            )}
          </Panel>
        ))}
      </div>
    </section>
  );
}
