'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';

type PreferredSourceClient = {
  init: (options: { theme: string; lang: string }) => void;
  addPreferredSource: () => void;
};

/** Google's advanced SDK integration, with a working deeplink before JS loads.
 * https://developers.google.com/search/docs/appearance/preferred-sources
 */
export default function PreferredSource({ domain, lang = 'fr', placement = 'article', dark = false }: {
  domain: string; lang?: string; placement?: string; dark?: boolean;
}) {
  const client = useRef<PreferredSourceClient | null>(null);
  const fr = lang.startsWith('fr');
  useEffect(() => {
    let active = true;
    const host = window.location.hostname.replace(/^www\./, '');
    // Preview deployments must always link to the real publication.
    if (host !== domain.replace(/^www\./, '')) return;
    const queue = window as unknown as { PREFERRED_SOURCE?: Array<(sdk: PreferredSourceClient) => void> };
    (queue.PREFERRED_SOURCE = queue.PREFERRED_SOURCE || []).push((sdk) => {
      if (!active) return;
      sdk.init({ theme: dark ? 'dark' : 'light', lang });
      client.current = sdk;
    });
    return () => { active = false; client.current = null; };
  }, [domain, lang, dark]);

  return (
    <div data-preferred-source={placement} style={{ margin: '20px 0', maxWidth: '100%' }}>
      <Script src="https://news.google.com/swg/js/v1/publisher.js" strategy="afterInteractive" preferred-sources-control="manual" />
      <a
        href={`https://www.google.com/preferences/source?q=${encodeURIComponent(domain)}`}
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          const analytics = window as unknown as { gtag?: (...args: unknown[]) => void };
          analytics.gtag?.('event', 'preferred_source_click', { publication: domain, placement });
          if (client.current) {
            try { client.current.addPreferredSource(); event.preventDefault(); } catch { /* Deeplink remains usable. */ }
          }
        }}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 44, padding: '10px 16px', maxWidth: '100%', boxSizing: 'border-box', border: `1px solid ${dark ? '#64748b' : '#cbd5e1'}`, borderRadius: 8, background: dark ? '#1e293b' : '#fff', color: dark ? '#f8fafc' : '#1f2937', fontSize: 14, fontWeight: 600, lineHeight: 1.5, textDecoration: 'none' }}
      >
        <span aria-hidden="true" style={{ fontWeight: 700, fontSize: 20, color: dark ? '#93c5fd' : '#4285f4' }}>G</span>
        <span>{fr ? 'Ajoutez-nous à vos sources préférées sur Google' : 'Add us as a preferred source on Google'}</span>
      </a>
    </div>
  );
}
