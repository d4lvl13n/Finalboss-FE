// Compact family card — reused by product-page "Alternatives", the section
// index, and brand/category pages. Pure server component.

import Link from 'next/link';
import Image from 'next/image';
import type { LaptopFamily } from '@/app/lib/laptops/types';
import { familyGpuTiers } from '@/app/lib/laptops/queries';
import { gpuTierLabel, panelLabel, startingPriceLabel } from '@/app/lib/laptops/format';
import { getLaptopImage } from '@/app/lib/laptops/images';

export default function LaptopCard({ family }: { family: LaptopFamily }) {
  const tiers = familyGpuTiers(family);
  const image = getLaptopImage(family.slug);

  return (
    <Link
      href={`/gaming-laptops/${family.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 transition-colors hover:border-gray-700 hover:bg-gray-900"
    >
      {/* Thumbnail */}
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
              <span className="text-xs text-gray-600">{family.manufacturer}</span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            {family.manufacturer}
          </span>
          {family.displaySizeInches ? (
            <span className="text-[11px] text-gray-500">{family.displaySizeInches}&quot;</span>
          ) : null}
        </div>

        <h3 className="mt-1 text-sm font-semibold leading-snug text-gray-100 group-hover:text-white">
          {family.name}
        </h3>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {tiers.map((t) => (
            <span
              key={t}
              className="rounded bg-gray-800 px-1.5 py-0.5 text-[11px] font-medium text-gray-300"
            >
              {gpuTierLabel(t)}
            </span>
          ))}
          {family.display ? (
            <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[11px] font-medium text-gray-300">
              {panelLabel(family.display.panelType)}
            </span>
          ) : null}
        </div>

        <div className="mt-auto pt-4 text-sm font-semibold text-amber-400">
          {startingPriceLabel(family)}
        </div>
      </div>
    </Link>
  );
}
