import { buildPageMetadata } from '../lib/seo';
import siteConfig from '../lib/siteConfig';
import { t } from '../lib/i18n';

export const metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description: `Understand how ${siteConfig.name} collects, uses, and protects your information.`,
  path: '/privacy-policy',
  robots: {
    index: true,
    follow: true,
  },
});

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center text-yellow-400">{t('pages.privacy.heading')}</h1>
        <p className="text-lg text-gray-400 leading-relaxed mb-8">
          {t('pages.privacy.intro', { name: siteConfig.name })}
        </p>
        <h2 className="text-3xl font-bold mb-4">{t('pages.privacy.section1Heading')}</h2>
        <p className="text-gray-400 mb-4">
          {t('pages.privacy.section1Content')}
        </p>
        <h2 className="text-3xl font-bold mb-4">{t('pages.privacy.section2Heading')}</h2>
        <p className="text-gray-400 mb-4">
          {t('pages.privacy.section2Content')}
        </p>
        <h2 className="text-3xl font-bold mb-4">{t('pages.privacy.section3Heading')}</h2>
        <p className="text-gray-400 mb-4">
          {t('pages.privacy.section3Content')}
        </p>
        <h2 className="text-3xl font-bold mb-4" id="chrome-extension">{t('pages.privacy.section4Heading')}</h2>
        <p className="text-gray-400 mb-4">
          {t('pages.privacy.section4Intro', { name: siteConfig.name })}
        </p>
        <ul className="text-gray-400 mb-4 list-disc list-inside space-y-2">
          <li><strong>No personal data collection:</strong> The extension does not collect, store, or transmit any personal information.</li>
          <li><strong>No tracking or analytics:</strong> We do not track your browsing activity or search history.</li>
          <li><strong>Local storage only:</strong> Any temporary data (such as pending searches) is stored locally on your device and automatically cleared.</li>
          <li><strong>API requests:</strong> When you search for a game, the query is sent to {siteConfig.url} to fetch game information from IGDB. No user identifiers are attached to these requests.</li>
        </ul>
        <p className="text-gray-400 mb-8">
          {t('pages.privacy.section4Outro', { url: siteConfig.url })}
        </p>

        <h2 className="text-3xl font-bold mb-4">{t('pages.privacy.section5Heading')}</h2>
        <p className="text-gray-400">
          {t('pages.privacy.section5Content')}
        </p>
      </div>
    </div>
  );
}
