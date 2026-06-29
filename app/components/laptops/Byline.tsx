// Author / freshness byline — E-E-A-T signal on laptop pages. Links to the
// methodology page so the trust claim is verifiable.

import Link from 'next/link';
import { formatVerifiedDate } from '@/app/lib/laptops/format';

export default function Byline({ lastVerified }: { lastVerified: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
      <span>
        By <span className="font-medium text-gray-300">FinalBoss Hardware Team</span>
      </span>
      <span aria-hidden>·</span>
      <Link
        href="/gaming-laptops/methodology"
        className="underline-offset-2 hover:text-gray-300 hover:underline"
      >
        How we research &amp; verify
      </Link>
      <span aria-hidden>·</span>
      <span>Last verified {formatVerifiedDate(lastVerified)}</span>
    </div>
  );
}
