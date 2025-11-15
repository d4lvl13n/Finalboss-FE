import ContactFormClient from '../components/Contact/ContactFormClient';
import { buildPageMetadata } from '../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Contact FinalBoss.io',
  description: 'Reach the FinalBoss.io team for partnerships, press inquiries, or community questions.',
  path: '/contact',
  robots: {
    index: true,
    follow: true,
  },
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center text-yellow-400">Contact Us</h1>
        <ContactFormClient />
      </div>
    </div>
  );
}

