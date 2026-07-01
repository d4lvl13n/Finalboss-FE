// Author / freshness byline for handhelds — links the handheld methodology.

import Link from 'next/link';
import { formatVerifiedDate } from '@/app/lib/handhelds/format';

export default function Byline({ lastVerified }: { lastVerified: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
      <span>
        By <span className="font-medium text-gray-300">FinalBoss Hardware Team</span>
      </span>
      <span aria-hidden>·</span>
      <Link
        href="/handhelds/methodology"
        className="underline-offset-2 hover:text-gray-300 hover:underline"
      >
        How we research &amp; verify
      </Link>
      <span aria-hidden>·</span>
      <span>Last verified {formatVerifiedDate(lastVerified)}</span>
    </div>
  );
}
