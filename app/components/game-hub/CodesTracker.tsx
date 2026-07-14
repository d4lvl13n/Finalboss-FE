'use client';

// Redeemable codes tracker with copy-to-clipboard. Client component.

import { useState } from 'react';
import type { CodeEntity } from '@/app/lib/game-hub/types';

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
    <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-800 bg-gray-950/40 px-3 py-2">
      <div className="min-w-0">
        <div className="font-mono text-sm font-semibold text-gray-100">{value}</div>
        {code.attributes.reward && (
          <div className="truncate text-xs text-gray-400">{code.attributes.reward}</div>
        )}
      </div>
      <button
        type="button"
        onClick={copy}
        className={`flex-shrink-0 rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
          copied ? 'bg-emerald-400/10 text-emerald-400' : 'bg-gray-800 text-gray-300 hover:text-white'
        }`}
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
    <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-cyan-400">Codes</h2>

      {active.length > 0 ? (
        <div className="space-y-2">
          {active.map((code) => (
            <CodeRow key={code.slug} code={code} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">
          No active codes right now — check back after the next update.
        </p>
      )}

      {expired.length > 0 && (
        <details className="mt-4 group">
          <summary className="cursor-pointer text-xs uppercase tracking-wide text-gray-500 hover:text-gray-400">
            Expired codes ({expired.length})
          </summary>
          <ul className="mt-2 space-y-1">
            {expired.map((code) => (
              <li key={code.slug} className="font-mono text-xs text-gray-600 line-through">
                {code.canonicalName}
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="mt-4 border-t border-gray-800 pt-3 text-xs text-gray-500">
        Last verified {lastVerified}
      </div>
    </section>
  );
}
