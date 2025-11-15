import { buildPageMetadata } from '../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Terms of Service | FinalBoss.io',
  description: 'Review the terms and conditions for using FinalBoss.io content and services.',
  path: '/terms-of-service',
});

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center text-yellow-400">Terms of Service</h1>
        <p className="text-lg text-gray-400 leading-relaxed mb-8">
          Welcome to FinalBoss.io. By using our website, you agree to comply with and be bound by the following terms and conditions.
        </p>
        <h2 className="text-3xl font-bold mb-4">Acceptance of Terms</h2>
        <p className="text-gray-400 mb-4">
          By accessing or using our website, you agree to be bound by these terms and conditions. If you do not agree with these terms, you are not authorized to use our website.
        </p>
        <h2 className="text-3xl font-bold mb-4">Content Ownership</h2>
        <p className="text-gray-400 mb-4">
          All content on this website, including text, graphics, logos, and images, is the property of FinalBoss.io. You may not reproduce, distribute, or use any content without our express written permission.
        </p>
        <h2 className="text-3xl font-bold mb-4">User Conduct</h2>
        <p className="text-gray-400 mb-4">
          You agree not to use our website for any unlawful purpose or to engage in any conduct that may harm or interfere with our website&apos;s operation. This includes hacking, spamming, or distributing malware.
        </p>
        <h2 className="text-3xl font-bold mb-4">Changes to These Terms</h2>
        <p className="text-gray-400">
          We reserve the right to update or modify these terms at any time. Any changes will be effective immediately upon posting on our website.
        </p>
      </div>
    </div>
  );
}
