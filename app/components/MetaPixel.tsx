'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { trackAffiliateClick } from '../lib/fbq';

/**
 * Meta Pixel (dataset) loader + SPA pageview tracking.
 *
 * Loads the fbq base code once and fires the initial PageView with full
 * referrer context. Because the App Router does client-side navigations for
 * <Link> clicks, that initial PageView would otherwise be the ONLY one Meta
 * sees — so this component also reports each subsequent route change,
 * mirroring the GAPageviews pattern (skip first render to avoid
 * double-counting the landing view).
 *
 * The fbq stub queues calls made before the script finishes loading, so the
 * route-change effect is safe without readiness checks.
 *
 * Renders nothing when no pixel ID is configured (NEXT_PUBLIC_META_PIXEL_ID).
 */
export default function MetaPixel({ pixelId }: { pixelId: string }) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!pixelId) return;

    // The landing PageView is sent by the base snippet below.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (typeof window === 'undefined') return;
    const w = window as unknown as { fbq?: (...args: unknown[]) => void };
    if (typeof w.fbq === 'function') {
      w.fbq('track', 'PageView');
    }
  }, [pathname, pixelId]);

  // Delegated affiliate-click tracking. One document-level listener catches
  // every outbound Amazon/Kinguin link — WP article content, gear boxes, and
  // product-page CTAs alike — without instrumenting each call site. This is
  // the highest-value audience signal on the site (proven commercial intent).
  useEffect(() => {
    if (!pixelId) return;

    const AFFILIATE_HOSTS: Array<[RegExp, 'amazon' | 'kinguin']> = [
      [/(^|\.)amazon\.[a-z.]+$/i, 'amazon'],
      [/(^|\.)amzn\.to$/i, 'amazon'],
      [/(^|\.)kinguin\.net$/i, 'kinguin'],
    ];

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element | null)?.closest?.('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      let host: string;
      try {
        host = new URL(href, window.location.href).hostname;
      } catch {
        return;
      }
      const match = AFFILIATE_HOSTS.find(([re]) => re.test(host));
      if (!match) return;
      trackAffiliateClick({
        destination: match[1],
        href,
        page: window.location.pathname,
      });
    };

    // Capture phase so the event is seen even if the link stops propagation.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [pixelId]);

  if (!pixelId) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
