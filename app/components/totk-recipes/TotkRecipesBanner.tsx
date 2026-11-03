import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { RECIPES_PATH } from '@/app/lib/totk-recipes/types';
export default function TotkRecipesBanner() {
  return (
    <Link
      prefetch={false}
      href={RECIPES_PATH}
      className="group flex flex-col gap-5 rounded-lg border border-yellow-400/25 bg-gray-800 p-6 transition-colors hover:border-yellow-400/70 sm:flex-row sm:items-center sm:p-8"
    >
      <Image
        src="/totk-recipes/zelda-totk-apple-pie-131.webp"
        width={72}
        height={72}
        alt="Apple Pie from Zelda TOTK"
        className="h-18 w-18 shrink-0 object-contain"
      />
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-yellow-400">
          Tears of the Kingdom
        </p>
        <h2 className="mt-1 text-2xl font-bold text-white">
          Good food. Better adventures.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">
          All 228 recipes, their ingredients, and a cooking simulator. Find the
          right meal for your next journey.
        </p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-yellow-300">
        Open the recipe book
        <ArrowUpRight size={19} />
      </span>
    </Link>
  );
}
