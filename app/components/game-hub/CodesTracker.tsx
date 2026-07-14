'use client';

// Redeemable codes tracker with copy-to-clipboard. Warm FinalBoss idiom. Client component.

import { useState } from 'react';
import type { CodeEntity } from '@/app/lib/game-hub/types';
import { SectionHeading, Panel } from './ui';

function CodeRow({ code }: { code: CodeEntity }) {
  const [copied, setCopied] = useState(false);
  const value = code.canonicalName;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3 min-w-0">
        <span className="font-mono text-yellow-300 bg-gray-900 rounded px-2 py-1">{value}</span>
        {code.attributes.reward && (
          <span className="text-gray-300 text-sm">{code.attributes.reward}</span>
        )}
      </div>
      <button
        type="button"
        onClick={copy}
        className="flex-shrink-0 bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-sm text-gray-100 transition"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export default function CodesTracker({
  lastVerified,
  active,
  expired,
}: {
  lastVerified: string;
  active: CodeEntity[];
  expired: CodeEntity[];
}) {
  return (
    <section>
      <SectionHeading>Codes</SectionHeading>
      <Panel>
        {active.length > 0 ? (
          <div className="space-y-3">
            {active.map((code) => (
              <CodeRow key={code.slug} code={code} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">
            No active codes right now — check back after the next update.
          </p>
        )}

        {expired.length > 0 && (
          <details className="mt-6">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400">
              Expired codes ({expired.length})
            </summary>
            <ul className="mt-3 space-y-1">
              {expired.map((code) => (
                <li key={code.slug} className="font-mono text-sm text-gray-600 line-through">
                  {code.canonicalName}
                </li>
              ))}
            </ul>
          </details>
        )}

        <div className="mt-6 text-gray-500 text-xs">Last verified {lastVerified}</div>
      </Panel>
    </section>
  );
}
