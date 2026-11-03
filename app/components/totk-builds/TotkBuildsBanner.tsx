import Link from 'next/link';
import { ArrowUpRight, QrCode } from 'lucide-react';
import { TOTK_BUILDS_PATH } from '@/app/lib/totk-builds/types';

export default function TotkBuildsBanner() {
  return (
    <Link prefetch={false} href={TOTK_BUILDS_PATH} className="group flex flex-col gap-5 rounded-lg border border-yellow-400/25 bg-gray-800 p-6 transition-colors hover:border-yellow-400/70 sm:flex-row sm:items-center sm:p-8">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400"><QrCode size={30} aria-hidden="true" /></span>
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-400">Tears of the Kingdom</p>
        <h2 className="mt-1 text-2xl font-bold text-white">Find your next Autobuild.</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">Hoverbikes, battle machines and clever contraptions. Explore the collection and grab a QR code.</p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-yellow-300">Explore builds<ArrowUpRight size={19} aria-hidden="true" /></span>
    </Link>
  );
}
