import { intlLocale } from '../lib/siteConfig';

/** Short numeric date — e.g. "1/15/2025" (en) or "15/01/2025" (fr) */
export function formatDate(date: string | Date, locale?: string) {
  const d = new Date(date);
  return d.toLocaleDateString(locale || intlLocale, {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Long date — e.g. "January 15, 2025" (en) or "15 janvier 2025" (fr) */
export function formatDateLong(date: string | Date, locale?: string) {
  const d = new Date(date);
  return d.toLocaleDateString(locale || intlLocale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Short date — e.g. "Jan 15, 2025" (en) or "15 janv. 2025" (fr) */
export function formatDateShort(date: string | Date, locale?: string) {
  const d = new Date(date);
  return d.toLocaleDateString(locale || intlLocale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Month + day only — e.g. "Jan 15" (en) or "15 janv." (fr) */
export function formatDateCompact(date: string | Date, locale?: string) {
  const d = new Date(date);
  return d.toLocaleDateString(locale || intlLocale, {
    month: 'short',
    day: 'numeric',
  });
}

/** Time only — e.g. "3:45 PM" (en) or "15:45" (fr) */
export function formatTime(date: string | Date, locale?: string) {
  const d = new Date(date);
  return d.toLocaleTimeString(locale || intlLocale, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Locale-aware number — e.g. "1,234,567" (en) or "1 234 567" (fr) */
export function formatNumber(num: number, locale?: string) {
  return num.toLocaleString(locale || intlLocale);
}
