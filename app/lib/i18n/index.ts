import siteConfig from '../siteConfig';
import { en } from './translations/en';
import { fr } from './translations/fr';

const translations: Record<string, Record<string, unknown>> = { en, fr };

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : undefined;
}

/**
 * Translate a key using the current locale from siteConfig.
 * Supports dot-notation keys and {param} interpolation.
 * Falls back to English, then to the key itself.
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const locale = siteConfig.locale;
  let value =
    getNestedValue(translations[locale] ?? {}, key) ??
    getNestedValue(translations.en, key) ??
    key;

  if (params) {
    for (const [param, replacement] of Object.entries(params)) {
      value = value.replace(new RegExp(`\\{${param}\\}`, 'g'), String(replacement));
    }
  }

  return value;
}

export default t;
