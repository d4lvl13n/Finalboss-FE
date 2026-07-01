// Compact handheld card — reused by product "Alternatives", the index and
// brand/category pages. Server component.

import Link from 'next/link';
import Image from 'next/image';
import type { Handheld } from '@/app/lib/handhelds/types';
import { osLabel, panelLabel, startingPriceLabel } from '@/app/lib/handhelds/format';
import { getHandheldImage } from '@/app/lib/handhelds/images';

export default function HandheldCard({ handheld }: { handheld: Handheld }) {
  const image = getHandheldImage(handheld.slug);
  return (
    <Link
      href={`/handhelds/${handheld.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 transition-colors hover:border-gray-700 hover:bg-gray-900"
    >
      <div className="bg-gray-950/40 p-3">
        <div className="relative aspect-[16/10]">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-xs text-gray-600">{handheld.manufacturer}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            {handheld.manufacturer}
          </span>
          {handheld.displaySizeInches ? (
            <span className="text-[11px] text-gray-500">{handheld.displaySizeInches}&quot;</span>
          ) : null}
        </div>

        <h3 className="mt-1 text-sm font-semibold leading-snug text-gray-100 group-hover:text-white">
          {handheld.name}
        </h3>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[11px] font-medium text-gray-300">
            {osLabel(handheld.os)}
          </span>
          {handheld.display ? (
            <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[11px] font-medium text-gray-300">
              {panelLabel(handheld.display.panelType)}
            </span>
          ) : null}
        </div>

        <div className="mt-auto pt-4 text-sm font-semibold text-amber-400">
          {startingPriceLabel(handheld)}
        </div>
      </div>
    </Link>
  );
}
