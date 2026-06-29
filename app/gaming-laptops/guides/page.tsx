// Buying-guides hub — lists every markdown-authored guide. Static + ISR.

import { Metadata } from 'next';
import Link from 'next/link';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { buildPageMetadata, absoluteUrl } from '@/app/lib/seo';
import { getAllGuides } from '@/app/lib/laptops/guides';

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: 'Gaming Laptop Buying Guides (2026) | FinalBoss.io',
  description:
    'Hand-picked gaming-laptop rankings for every budget and use case — best under $1,000/$1,500/$2,000, for college, AAA gaming, programming, streaming and content creation.',
  path: '/gaming-laptops/guides',
});

export default function GuidesHub() {
  const guides = getAllGuides();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Gaming Laptop Buying Guides',
    numberOfItems: guides.length,
    itemListElement: guides.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/gaming-laptops/guides/${g.slug}`),
      name: g.title,
    })),
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 text-gray-100">
        <div className="mx-auto max-w-4xl px-4 pb-16 pt-24">
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/gaming-laptops" className="hover:text-gray-300">
              Gaming Laptops
            </Link>
            <span className="px-2">/</span>
            <span className="text-gray-400">Buying Guides</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Gaming Laptop Buying Guides</h1>
            <p className="mt-2 max-w-2xl text-gray-400">
              Curated picks for every budget and use case — each ranked from our 2026 database, with live
              pricing so the recommendations never go stale.
            </p>
          </header>

          <ul className="grid gap-3 sm:grid-cols-2">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/gaming-laptops/guides/${g.slug}`}
                  className="block rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition-colors hover:border-gray-700 hover:bg-gray-900"
                >
                  <span className="font-semibold text-gray-100">{g.title}</span>
                  <span className="mt-1 block text-sm text-gray-400">{g.description}</span>
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
