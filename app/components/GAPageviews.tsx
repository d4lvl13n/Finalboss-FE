'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Sends a GA4 `page_view` on client-side (App Router) route changes.
 *
 * Why this exists: the App Router does full client-side navigations for <Link>
 * clicks, so gtag's initial document-load pageview (fired by the config in
 * layout.tsx) is the ONLY pageview GA sees without this — every in-app
 * navigation would go untracked, undercounting pageviews and engagement.
 *
 * The initial/landing pageview is intentionally handled by gtag's default
 * send_page_view in layout.tsx (so it carries the referrer for attribution);
 * this component SKIPS the first render to avoid double-counting it, then
 * reports each subsequent navigation with the full URL (query string intact).
 */
export default function GAPageviews({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!gaId) return;

    // The landing pageview is already sent by gtag('config') in layout.tsx.
    // Only report subsequent client-side navigations here.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (typeof window === 'undefined') return;
    const w = window as unknown as {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };
    // Fall back to a dataLayer push if gtag isn't ready yet; it will be
    // processed once gtag.js finishes loading.
    w.dataLayer = w.dataLayer || [];
    const send =
      typeof w.gtag === 'function'
        ? w.gtag
        : (...args: unknown[]) => w.dataLayer!.push(args);

    send('event', 'page_view', {
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.search,
      page_title: document.title,
    });
  }, [pathname, gaId]);

  return null;
}
