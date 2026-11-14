import Link from 'next/link';
import { t } from './lib/i18n';
import siteConfig from './lib/siteConfig';
import NotFoundLoader from './components/NotFoundLoader';

// Next.js loads the not-found module on EVERY page, not just on 404s. The
// interactive version (search suggestions via Apollo, framer-motion) used to
// live here, which put ~280 KB of libraries in every page's first load.
// It is now fetched only when a 404 is actually shown (see NotFoundLoader);
// until then this plain server-rendered version is what the visitor sees.
const SECTIONS = [
  { href: '/guides', key: 'notFound.browseGuides' },
  { href: '/gaming', key: 'notFound.browseGaming' },
  { href: '/reviews', key: 'notFound.browseReviews' },
  { href: '/games', key: 'notFound.browseGames' },
];

// 404s are not sent to Google Analytics. In Oct–Nov 2026, "Article Not Found"
// was the #1 "page" in GA4 (4,330 views, 7.3% of all views): 99% direct traffic
// with 0s engagement, 44% from Singapore, spread across 738 deleted article
// URLs — bots, not readers. They inflated users and bounce rate site-wide.
// `ga-disable-<ID>` is Google's documented opt-out switch; this inline script
// runs while the HTML is parsed, before gtag loads (afterInteractive).
const GA_OPT_OUT = siteConfig.analyticsId
  ? `window['ga-disable-${siteConfig.analyticsId}']=true;`
  : '';

function StaticNotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center text-center px-4 py-24">
      {GA_OPT_OUT && <script dangerouslySetInnerHTML={{ __html: GA_OPT_OUT }} />}
      <h1 className="text-4xl md:text-5xl text-yellow-400 mb-4">{t('notFound.title')}</h1>
      <p className="text-xl md:text-2xl mt-2 text-gray-400">{t('notFound.subtitle')}</p>
      <p className="mt-4 text-gray-300">{t('notFound.movedOrGone')}</p>
      <div className="mt-12 flex flex-wrap justify-center gap-3">
        {SECTIONS.map(({ href, key }) => (
          <Link prefetch={false} key={href} href={href} className="fb-btn">
            {t(key)}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function NotFoundPage() {
  return (
    <NotFoundLoader gaId={siteConfig.analyticsId}>
      <StaticNotFound />
    </NotFoundLoader>
  );
}
