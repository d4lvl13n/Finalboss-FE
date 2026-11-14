'use client';

import { useEffect, useState, type ComponentType, type ReactNode } from 'react';

/**
 * Shows the server-rendered fallback, then swaps in the interactive 404
 * (search suggestions) once its code has been fetched.
 *
 * The import() must live in a CLIENT component. Calling next/dynamic from the
 * server not-found file does not split anything: the target simply becomes part
 * of the not-found bundle, which Next.js loads on every page of the site.
 */
export default function NotFoundLoader({ children, gaId }: { children: ReactNode; gaId?: string }) {
  const [Interactive, setInteractive] = useState<ComponentType | null>(null);

  useEffect(() => {
    let alive = true;
    import('./NotFoundClient').then((mod) => {
      if (alive) setInteractive(() => mod.default);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Client-side navigations to a dead URL do not re-run the inline opt-out
  // script in not-found.tsx, so set the same switch here, and clear it on the
  // way out so real pages are counted again.
  useEffect(() => {
    if (!gaId) return;
    const w = window as unknown as Record<string, unknown>;
    w[`ga-disable-${gaId}`] = true;
    return () => {
      w[`ga-disable-${gaId}`] = false;
    };
  }, [gaId]);

  return Interactive ? <Interactive /> : <>{children}</>;
}
