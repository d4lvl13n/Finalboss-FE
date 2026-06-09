'use client';

import { useEffect, useState } from 'react';

type Counts = { up: number; down: number };
type Mode = 'idle' | 'upEmail' | 'downFeedback' | 'done';

interface Props {
  slug: string;
  postId?: string | number;
  /** Primary game name — used in the email hook ("new {game} guides"). */
  game?: string;
}

const REASONS: { key: string; label: string }[] = [
  { key: 'outdated', label: 'Outdated' },
  { key: 'incomplete', label: 'Incomplete' },
  { key: 'wrong', label: 'Wrong' },
];

/** Stable anonymous id (one reaction per reader per article). */
function getClientId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = localStorage.getItem('fb_client_id');
    if (!id) {
      id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `c_${Date.now()}_${Math.floor(Math.random() * 1e9)}`;
      localStorage.setItem('fb_client_id', id);
    }
    return id;
  } catch {
    return `c_${Date.now()}`;
  }
}

export default function ArticleReactions({ slug, postId, game }: Props) {
  const [counts, setCounts] = useState<Counts>({ up: 0, down: 0 });
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);
  const [mode, setMode] = useState<Mode>('idle');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const gameLabel = game && game.trim() ? game.trim() : 'gaming';

  useEffect(() => {
    fetch(`/api/reactions?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((c) => setCounts({ up: c.up || 0, down: c.down || 0 }))
      .catch(() => {});
    try {
      const prev = localStorage.getItem(`fb_react_${slug}`);
      if (prev === 'up' || prev === 'down') {
        setVoted(prev);
        setMode('done');
      }
    } catch {
      /* ignore */
    }
  }, [slug]);

  async function vote(kind: 'up' | 'down') {
    if (voted || busy) return;
    setBusy(true);
    setVoted(kind);
    setCounts((c) => ({ ...c, [kind]: c[kind] + 1 }));
    try {
      localStorage.setItem(`fb_react_${slug}`, kind);
    } catch {
      /* ignore */
    }
    try {
      const res = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, postId, kind, clientId: getClientId() }),
      });
      if (res.ok) {
        const c = await res.json();
        setCounts({ up: c.up || 0, down: c.down || 0 });
      }
    } catch {
      /* ignore */
    }
    setMode(kind === 'up' ? 'upEmail' : 'downFeedback');
    setBusy(false);
  }

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@') || busy) return;
    setBusy(true);
    try {
      await fetch('/api/reactions/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, slug, game: gameLabel, reaction: 'up' }),
      });
    } catch {
      /* ignore */
    }
    setBusy(false);
    setMode('done');
  }

  async function submitFeedback(reason: string) {
    if (busy) return;
    setBusy(true);
    try {
      await fetch('/api/reactions/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, reason }),
      });
    } catch {
      /* ignore */
    }
    setBusy(false);
    setMode('done');
  }

  const btn = (kind: 'up' | 'down') => {
    const active = voted === kind;
    const isUp = kind === 'up';
    return (
      <button
        onClick={() => vote(kind)}
        disabled={!!voted || busy}
        aria-label={isUp ? 'Helpful' : 'Not helpful'}
        className={[
          'flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all',
          active
            ? isUp
              ? 'border-yellow-400 bg-yellow-400/15 text-yellow-400'
              : 'border-gray-500 bg-gray-700/40 text-gray-200'
            : 'border-gray-600/70 bg-gray-800/60 text-gray-300 hover:border-gray-500 hover:bg-gray-700/60',
          voted && !active ? 'opacity-50' : '',
          !voted ? 'cursor-pointer' : 'cursor-default',
        ].join(' ')}
      >
        <span className="text-lg leading-none">{isUp ? '👍' : '👎'}</span>
        <span className="tabular-nums">{isUp ? counts.up : counts.down}</span>
      </button>
    );
  };

  return (
    <section
      className="my-10 rounded-xl border border-gray-700/60 bg-gray-800/40 p-5 sm:p-6"
      aria-label="Rate this guide"
    >
      {/* IDLE — the ask */}
      {mode === 'idle' && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-bold text-white sm:text-lg">Was this guide helpful?</h3>
          <div className="flex items-center gap-3">
            {btn('up')}
            {btn('down')}
          </div>
        </div>
      )}

      {/* 👍 — email opt-in */}
      {mode === 'upEmail' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎮</span>
            <h3 className="text-base font-bold text-white sm:text-lg">Glad it helped!</h3>
          </div>
          <p className="text-sm text-gray-300">
            Get new <span className="font-semibold text-yellow-400">{gameLabel}</span> guides in your inbox — no spam,
            just the good stuff.
          </p>
          <form onSubmit={submitEmail} className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 rounded-lg border border-gray-600 bg-gray-900/70 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !email.includes('@')}
              className="rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-bold text-gray-900 transition-colors hover:bg-yellow-300 disabled:opacity-50"
            >
              {busy ? '…' : 'Notify me'}
            </button>
          </form>
          <button
            onClick={() => setMode('done')}
            className="self-start text-xs text-gray-500 underline-offset-2 hover:text-gray-400 hover:underline"
          >
            No thanks
          </button>
        </div>
      )}

      {/* 👎 — what was missing */}
      {mode === 'downFeedback' && (
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-bold text-white sm:text-lg">Thanks — what was missing?</h3>
          <div className="flex flex-wrap gap-2">
            {REASONS.map((r) => (
              <button
                key={r.key}
                onClick={() => submitFeedback(r.key)}
                disabled={busy}
                className="rounded-lg border border-gray-600/70 bg-gray-800/60 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-50"
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DONE — never looks empty: always shows the tally */}
      {mode === 'done' && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-300">
            {voted === 'up' ? "Thanks for the love — you're in. 🎉" : "Thanks — we'll make it better."}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <span>👍</span>
              <span className="tabular-nums">{counts.up}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span>👎</span>
              <span className="tabular-nums">{counts.down}</span>
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
