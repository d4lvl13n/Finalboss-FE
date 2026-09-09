import { FaGoogle } from 'react-icons/fa';
import siteConfig from '../lib/siteConfig';

/** Google's documented deeplink works without loading a third-party SDK.
 * Use the configured publication domain, never the current article or preview URL.
 * https://developers.google.com/search/docs/appearance/preferred-sources
 */
export default function GooglePreferredSource() {
  const domain = new URL(siteConfig.url).hostname;
  const isFrench = siteConfig.locale === 'fr';

  return (
    <a
      href={`https://www.google.com/preferences/source?q=${encodeURIComponent(domain)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 max-w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-left text-sm font-semibold leading-snug text-white transition-colors hover:border-yellow-400/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
    >
      <FaGoogle aria-hidden="true" className="h-5 w-5 shrink-0 text-yellow-400" />
      <span>
        {isFrench
          ? 'Ajoutez-nous comme source préférée sur Google'
          : 'Add us as a preferred source on Google'}
      </span>
      <span className="sr-only">
        {isFrench ? ' (nouvel onglet)' : ' (opens in a new tab)'}
      </span>
    </a>
  );
}
