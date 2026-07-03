// Handhelds — section index. Lists every device + browse-by-OS/need/brand.

import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { buildPageMetadata } from '@/app/lib/seo';
import HandheldCard from '@/app/components/handhelds/HandheldCard';
import { getAllHandhelds, allBrands } from '@/app/lib/handhelds/queries';
import { listSpecCategories, listCollections, categoryChipLabel } from '@/app/lib/handhelds/categories';

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: 'Handheld Gaming PCs 2026: Specs, Prices & Reviews | FinalBoss.io',
  description:
    'Every 2026 handheld gaming PC in one place — Steam Deck, ROG Ally, Legion Go, MSI Claw and more, with specs, controls, battery, reliability and pricing. SteamOS and Windows.',
  path: '/handhelds',
});

export default function HandheldsIndex() {
  const devices = getAllHandhelds()
    .slice()
    .sort((a, b) => a.manufacturer.localeCompare(b.manufacturer) || a.name.localeCompare(b.name));
  const brands = allBrands();
  const specCats = listSpecCategories();
  const collections = listCollections();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 text-gray-100">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-24">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Handheld Gaming PCs 2026</h1>
            <p className="mt-2 max-w-2xl text-gray-400">
              {devices.length} handheld gaming PCs with full specs, controls, battery, reliability notes and
              where-to-buy links — SteamOS and Windows, from the Steam Deck to the ROG Ally and beyond.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link href="/handhelds/compare" className="font-semibold text-amber-400 hover:text-amber-300">
                Compare handhelds →
              </Link>
              <Link href="/handhelds/guides" className="text-gray-300 hover:text-white">
                Buying guides →
              </Link>
              <Link href="/handhelds/glossary" className="text-gray-400 hover:text-gray-300">
                Glossary →
              </Link>
              <Link href="/handhelds/methodology" className="text-gray-400 hover:text-gray-300">
                How we research →
              </Link>
            </div>
          </header>

          {specCats.length ? (
            <section className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Browse by type</h2>
              <div className="flex flex-wrap gap-2">
                {specCats.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/handhelds/best/${c.slug}`}
                    className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-300 hover:border-gray-600 hover:text-white"
                  >
                    {categoryChipLabel(c.title)} <span className="text-gray-500">({c.count})</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {collections.length ? (
            <section className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Browse by need</h2>
              <div className="flex flex-wrap gap-2">
                {collections.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/handhelds/best/${c.slug}`}
                    className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-300 hover:border-gray-600 hover:text-white"
                  >
                    {categoryChipLabel(c.title)} <span className="text-gray-500">({c.count})</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {brands.length ? (
            <section className="mb-10">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Browse by brand</h2>
              <div className="flex flex-wrap gap-2">
                {brands.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/handhelds/brands/${b.slug}`}
                    className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-300 hover:border-gray-600 hover:text-white"
                  >
                    {b.name} <span className="text-gray-500">({b.count})</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <h2 className="mb-4 text-xl font-bold text-white">All handhelds</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {devices.map((h) => (
              <HandheldCard key={h.slug} handheld={h} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
