// Handheld glossary — A–Z index of feature/term explainers. These are the
// internal-link targets the product pages point at. Static + ISR.

import { Metadata } from 'next';
import Link from 'next/link';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { buildPageMetadata, absoluteUrl } from '@/app/lib/seo';
import { GLOSSARY } from '@/app/lib/handhelds/glossary';

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: 'Handheld Gaming PC Glossary: TDP, SteamOS, Hall-Effect Sticks & More | FinalBoss.io',
  description:
    'Plain-English explanations of the handheld gaming PC terms that actually affect your purchase — TDP, SteamOS vs Windows, Hall-effect sticks, OCuLink, FSR and more.',
  path: '/handhelds/glossary',
});

export default function GlossaryIndex() {
  const terms = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Handheld Gaming PC Glossary',
    url: absoluteUrl('/handhelds/glossary'),
    hasDefinedTerm: terms.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.term,
      description: t.short,
      url: absoluteUrl(`/handhelds/glossary/${t.slug}`),
    })),
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 text-gray-100">
        <div className="mx-auto max-w-4xl px-4 pb-16 pt-24">
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/handhelds" className="hover:text-gray-300">
              Handhelds
            </Link>
            <span className="px-2">/</span>
            <span className="text-gray-400">Glossary</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Handheld Gaming PC Glossary</h1>
            <p className="mt-2 max-w-2xl text-gray-400">
              The terms that actually change which handheld you should buy — explained in plain English, with
              what to look for in a 2026 handheld gaming PC.
            </p>
          </header>

          <ul className="grid gap-3 sm:grid-cols-2">
            {terms.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/handhelds/glossary/${t.slug}`}
                  className="block rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition-colors hover:border-gray-700 hover:bg-gray-900"
                >
                  <span className="font-semibold text-gray-100">{t.term}</span>
                  <span className="mt-1 block text-sm text-gray-400">{t.short}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
