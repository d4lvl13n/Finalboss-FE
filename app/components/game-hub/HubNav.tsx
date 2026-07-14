'use client';

// Sticky in-page anchor nav for the game hub. Warm FinalBoss idiom. Client component.
// Highlights the active section on scroll via IntersectionObserver (SSR-guarded).

import { useEffect, useState } from 'react';

type HubNavItem = { label: string; href: string };

export default function HubNav({ items }: { items: HubNavItem[] }) {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    // Map each item to its target id (strip a leading '#').
    const ids = items
      .map((it) => (it.href.startsWith('#') ? it.href.slice(1) : ''))
      .filter((id) => id.length > 0);

    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav className="sticky top-16 z-40 -mx-4 mb-8 border-b border-gray-800 bg-gray-900/80 px-4 backdrop-blur">
      <div className="container mx-auto flex gap-2 overflow-x-auto py-3">
        {items.map((item) => {
          const id = item.href.startsWith('#') ? item.href.slice(1) : '';
          const isActive = id.length > 0 && id === active;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-yellow-400 text-gray-900'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
