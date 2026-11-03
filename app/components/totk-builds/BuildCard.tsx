import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Check, Diamond } from 'lucide-react';
import { buildPath, categoryLabel, type TotkBuild } from '@/app/lib/totk-builds/types';

export default function BuildCard({ build, priority = false }: { build: TotkBuild; priority?: boolean }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-800 transition-colors hover:border-yellow-400/50">
      <Link prefetch={false} href={buildPath(build)} className="flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-yellow-400">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gray-900 p-3">
          <Image
            src={build.preview}
            alt={`${build.name} — build preview`}
            width={480}
            height={480}
            className="h-full w-full object-contain transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
            priority={priority}
            unoptimized
          />
          <span className="absolute bottom-3 right-3 rounded-md border border-gray-600 bg-black/80 px-2 py-1 text-[10px] font-semibold tracking-wider text-white">QR INCLUDED</span>
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-yellow-300/80">
            <span>{categoryLabel(build.categories[0])}</span>
            {build.tested && <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400/10 px-2 py-0.5 text-yellow-300"><Check size={12} aria-hidden="true" />Community tested</span>}
          </div>
          <h3 className="text-lg font-semibold leading-snug text-white transition-colors group-hover:text-yellow-300">{build.name}</h3>
          <p className="mt-2 line-clamp-2 break-words text-sm leading-relaxed text-gray-400">{build.description || 'Open this blueprint to view and download its Autobuild QR code.'}</p>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-700 pt-3 text-sm text-gray-200">
            <span className="mt-3 inline-flex items-center gap-1.5"><Diamond size={14} className="text-yellow-400" aria-hidden="true" />{build.zonaite === null ? 'Cost not listed' : `${build.zonaite} Zonaite`}</span>
            <ArrowUpRight size={18} className="mt-3 shrink-0 text-yellow-400" aria-hidden="true" />
          </div>
        </div>
      </Link>
    </article>
  );
}
