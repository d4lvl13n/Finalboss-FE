// Meta Pixel event helpers — the ONLY place fbq is called outside the
// MetaPixel loader. All helpers are safe no-ops when the pixel isn't loaded
// (no NEXT_PUBLIC_META_PIXEL_ID, SSR, or ad-blocked), so call sites never
// need readiness checks.

type Fbq = (...args: unknown[]) => void;

function fbq(): Fbq | null {
  if (typeof window === 'undefined') return null;
  const f = (window as unknown as { fbq?: Fbq }).fbq;
  return typeof f === 'function' ? f : null;
}

/** Standard event: article/game page view. Powers content-interest audiences. */
export function trackViewContent(params: {
  content_name: string;
  content_category?: string;
  content_type?: string;
}) {
  fbq()?.('track', 'ViewContent', params);
}

/** Standard event: site search. */
export function trackSearch(query: string) {
  if (!query.trim()) return;
  fbq()?.('track', 'Search', { search_string: query.trim() });
}

/** Standard event: newsletter signup (Meta's canonical free-signup event). */
export function trackCompleteRegistration(source: string) {
  fbq()?.('track', 'CompleteRegistration', { content_name: source });
}

/**
 * Custom event: outbound affiliate click (Amazon / Kinguin). The highest
 * commercial-intent signal on the site — the audience to retarget/lookalike.
 */
export function trackAffiliateClick(params: {
  destination: 'amazon' | 'kinguin' | 'other';
  href: string;
  page: string;
}) {
  fbq()?.('trackCustom', 'AffiliateClick', params);
}
