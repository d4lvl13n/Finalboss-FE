import { buildPageMetadata } from '../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Privacy Policy | FinalBoss.io',
  description: 'Understand how FinalBoss.io collects, uses, and protects your information.',
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
        <h1 className="text-5xl font-bold mb-8 text-center text-yellow-400">Privacy Policy</h1>
        <p className="text-lg text-gray-400 leading-relaxed mb-8">
          At FinalBoss.io, we take your privacy seriously. This Privacy Policy outlines the types of personal information we collect, how we use it, and the steps we take to ensure your data is protected.
        </p>
        <h2 className="text-3xl font-bold mb-4">Information Collection</h2>
        <p className="text-gray-400 mb-4">
          We collect personal information such as your name, email address, and other contact details when you voluntarily provide it to us through forms on our website, such as the contact form.
        </p>
        <h2 className="text-3xl font-bold mb-4">Use of Information</h2>
        <p className="text-gray-400 mb-4">
          We use your information to respond to your inquiries, send newsletters, and improve our website. We do not share your personal information with third parties without your consent, except when required by law.
        </p>
        <h2 className="text-3xl font-bold mb-4">Cookies</h2>
        <p className="text-gray-400 mb-4">
          Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, but this may affect the functionality of our site.
        </p>
        <h2 className="text-3xl font-bold mb-4" id="chrome-extension">Chrome Extension</h2>
        <p className="text-gray-400 mb-4">
          The FinalBoss Quick Game Lookup Chrome extension is designed with privacy in mind:
        </p>
        <ul className="text-gray-400 mb-4 list-disc list-inside space-y-2">
          <li><strong>No personal data collection:</strong> The extension does not collect, store, or transmit any personal information.</li>
          <li><strong>No tracking or analytics:</strong> We do not track your browsing activity or search history.</li>
          <li><strong>Local storage only:</strong> Any temporary data (such as pending searches) is stored locally on your device and automatically cleared.</li>
          <li><strong>API requests:</strong> When you search for a game, the query is sent to finalboss.io to fetch game information from IGDB. No user identifiers are attached to these requests.</li>
        </ul>
        <p className="text-gray-400 mb-8">
          The extension requires minimal permissions: context menus (for right-click search), storage (for temporary local data), and access to finalboss.io (for API requests).
        </p>

        <h2 className="text-3xl font-bold mb-4">Changes to This Policy</h2>
        <p className="text-gray-400">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our website.
        </p>
      </div>
    </div>
  );
}
