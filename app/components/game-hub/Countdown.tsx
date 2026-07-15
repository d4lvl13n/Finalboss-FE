'use client';

// Countdown to a game's release. Client component; renders nothing until mounted
// (avoids SSR/CSR hydration mismatch) and nothing once the date has passed.

import { useEffect, useState } from 'react';

function parts(ms: number) {
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60,
    s: Math.floor(ms / 1000) % 60,
  };
}

export default function Countdown({ target, label = 'Releases in' }: { target: string; label?: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const tgt = new Date(target).getTime();
  if (Number.isNaN(tgt) || now === null) return null;
  const diff = tgt - now;
  if (diff <= 0) return null;

  const { d, h, m, s } = parts(diff);
  const cell = (v: number, unit: string) => (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-bold text-white tabular-nums md:text-4xl">{String(v).padStart(2, '0')}</span>
      <span className="text-[11px] uppercase tracking-widest text-gray-400">{unit}</span>
    </div>
  );

  return (
    <div className="rounded-lg bg-gray-800 p-5 text-center shadow-xl">
      <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-yellow-400">{label}</div>
      <div className="flex items-center justify-center gap-5">
        {cell(d, 'days')}
        {cell(h, 'hrs')}
        {cell(m, 'min')}
        {cell(s, 'sec')}
      </div>
    </div>
  );
}
