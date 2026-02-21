// app/write-for-us/page.tsx

import Header from '../components/Header';
import Footer from '../components/Footer';
import { buildPageMetadata } from '../lib/seo';
import siteConfig from '../lib/siteConfig';
import { t } from '../lib/i18n';

export const metadata = buildPageMetadata({
  title: `Write for ${siteConfig.name}`,
  description: `Pitch your gaming or technology guest post to the ${siteConfig.name} editorial team.`,
  path: '/write-for-us',
});

export default function WriteForUsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-white px-4 py-24">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold mb-12 text-center">{t('pages.writeForUs.heading')}</h1>
          
          <div className="text-lg leading-relaxed mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center">{t('pages.writeForUs.section1Heading')}</h2>
            <p className="mb-4">{t('pages.writeForUs.section1Content')}</p>
          </div>

          <div className="text-lg leading-relaxed mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center">{t('pages.writeForUs.section2Heading')}</h2>
            <p className="mb-4">{t('pages.writeForUs.section2Content', { name: siteConfig.name })}</p>
          </div>
          
          <div className="text-lg leading-relaxed mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center">{t('pages.writeForUs.section3Heading')}</h2>
            <p className="mb-4">{t('pages.writeForUs.section3Intro')}</p>
            <ul className="list-disc list-inside mb-4">
              <li>Tech Trends</li>
              <li>Tech News</li>
              <li>Augmented Reality & Virtual Reality</li>
              <li>Artificial Intelligence</li>
              <li>Gaming Tech</li>
              <li>Machine Learning</li>
              <li>Entertainment Tech</li>
              <li>Cyber Security</li>
              <li>Nanotechnology</li>
              <li>Music Tech</li>
              <li>Cloud Technology</li>
              <li>Business Technology</li>
              <li>Gadgets</li>
              <li>Smartphones</li>
              <li>Internet-Ready Devices</li>
              <li>Computers and PCs</li>
              <li>iOS Technology</li>
              <li>Google Technology</li>
              <li>Blockchain</li>
              <li>Web3</li>
            </ul>
            <p className="mb-4">{t('pages.writeForUs.section3Outro')}</p>
          </div>

          <div className="text-lg leading-relaxed mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center">{t('pages.writeForUs.section4Heading')}</h2>
            <p className="mb-4">{t('pages.writeForUs.section4Intro')}</p>
            <ul className="list-disc list-inside mb-4">
              <li>Tech guest post submissions should be 600 words or more.</li>
              <li>Tech guest posts should be well-written & proofread before submission.</li>
              <li>You should have your ideas for your tech guest post ready before you pitch to us.</li>
              <li>We do not want to hear from agencies looking to add us to their marketing list.</li>
            </ul>
            <p className="mb-4">{t('pages.writeForUs.section4Outro1')}<a href={`mailto:${siteConfig.contactEmail}`} className="text-yellow-400">{siteConfig.contactEmail}</a>{t('pages.writeForUs.section4Outro2')}</p>
          </div>

          <div className="text-lg leading-relaxed mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center">{t('pages.writeForUs.section5Heading', { name: siteConfig.name })}</h2>
            <p className="mb-4">{t('pages.writeForUs.section5Content', { name: siteConfig.name })}</p>
          </div>

          <div className="text-lg leading-relaxed mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center">{t('pages.writeForUs.section6Heading')}</h2>
            <p className="mb-4">{t('pages.writeForUs.section6Content')}</p>
          </div>

          <div className="text-center">
            <a href={`mailto:${siteConfig.contactEmail}`} className="inline-block bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors">
              <span>{t('pages.writeForUs.submitButton')}</span>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
