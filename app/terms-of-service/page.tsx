import { buildPageMetadata } from '../lib/seo';
import siteConfig from '../lib/siteConfig';
import { t } from '../lib/i18n';

export const metadata = buildPageMetadata({
  title: `Terms of Service | ${siteConfig.name}`,
  description: `Review the terms and conditions for using ${siteConfig.name} content and services.`,
  path: '/terms-of-service',
});

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center text-yellow-400">{t('pages.terms.heading')}</h1>
        <p className="text-lg text-gray-400 leading-relaxed mb-8">
          {t('pages.terms.intro1')}{siteConfig.name}{t('pages.terms.intro2')}
        </p>
        <h2 className="text-3xl font-bold mb-4">{t('pages.terms.section1Heading')}</h2>
        <p className="text-gray-400 mb-4">
          {t('pages.terms.section1Content')}
        </p>
        <h2 className="text-3xl font-bold mb-4">{t('pages.terms.section2Heading')}</h2>
        <p className="text-gray-400 mb-4">
          {t('pages.terms.section2Content1')}{siteConfig.name}{t('pages.terms.section2Content2')}
        </p>
        <h2 className="text-3xl font-bold mb-4">{t('pages.terms.section3Heading')}</h2>
        <p className="text-gray-400 mb-4">
          {t('pages.terms.section3Content')}
        </p>
        <h2 className="text-3xl font-bold mb-4">{t('pages.terms.section4Heading')}</h2>
        <p className="text-gray-400">
          {t('pages.terms.section4Content')}
        </p>
      </div>
    </div>
  );
}
