import Image from 'next/image';
import type { KnowledgeEntity } from '@/app/lib/knowledge/types';
import { igdbImage } from '@/app/lib/knowledge/client';

export default function GameHero({ entity }: { entity: KnowledgeEntity }) {
  const a = entity.attributes || {};
  const cover = entity.imageUrl || igdbImage(a.cover_image_id);
  const meta = [a.developer, a.publisher && a.publisher !== a.developer ? a.publisher : null]
    .filter(Boolean)
    .join(' · ');
  const platforms = (a.platforms || []).join(' · ');

  return (
    <section className="flex flex-col gap-6 sm:flex-row">
      {cover && (
        <div className="relative h-64 w-44 flex-shrink-0 overflow-hidden rounded-lg shadow-lg">
          <Image src={cover} alt={entity.canonicalName} fill sizes="176px" className="object-cover" />
        </div>
      )}
      <div className="flex flex-col justify-end gap-2">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-cyan-400">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
          Live coverage
        </div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">{entity.canonicalName}</h1>
        {meta && <p className="text-gray-300">{meta}</p>}
        <div className="flex flex-wrap gap-2 text-sm text-gray-400">
          {(a.genres || []).slice(0, 3).map((g) => (
            <span key={g} className="rounded-full bg-gray-800 px-3 py-1">{g}</span>
          ))}
        </div>
        {platforms && <p className="text-sm text-gray-400">{platforms}</p>}
        {a.release_date && (
          <p className="text-sm text-gray-500">
            Release: {new Date(a.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
      </div>
    </section>
  );
}
