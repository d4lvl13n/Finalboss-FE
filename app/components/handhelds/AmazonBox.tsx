// Amazon buy-box for handhelds — monetised CTA. Server component. Mirrors the
// laptop AmazonBox but uses the handheld affiliate + price helpers.

import type { Configuration } from '@/app/lib/handhelds/types';
import { amazonLinkForConfig } from '@/app/lib/handhelds/affiliate';
import { priceAsOf } from '@/app/lib/handhelds/format';

interface AmazonBoxProps {
  config?: Configuration;
  productName?: string;
}

export default function AmazonBox({ config, productName }: AmazonBoxProps) {
  const link = amazonLinkForConfig(config);
  const price = config ? priceAsOf(config) : null;
  const cta = link.isDirect ? 'View on Amazon' : 'Check price on Amazon';

  return (
    <aside className="rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">Where to buy</span>
        <span className="text-[11px] text-gray-500">Amazon</span>
      </div>

      <div className="mt-2">
        {price ? (
          <p className="text-lg font-bold text-white">{price}</p>
        ) : (
          <p className="text-sm text-gray-300">Live pricing varies — check the latest deal on Amazon.</p>
        )}
      </div>

      <a
        href={link.url}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        aria-label={productName ? `${cta}: ${productName}` : cta}
        className="mt-4 block w-full rounded-lg bg-amber-500 px-4 py-3 text-center text-sm font-bold text-gray-950 transition-colors hover:bg-amber-400"
      >
        {cta}
      </a>

      <p className="mt-3 text-[11px] leading-snug text-gray-500">
        As an Amazon Associate we earn from qualifying purchases. Prices and availability are accurate as
        of the date shown and are subject to change.
      </p>
    </aside>
  );
}
