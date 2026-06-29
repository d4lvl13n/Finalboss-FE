// Gaming Laptops — section index. Lists every family from the dataset.
// Brand/category/"best" hubs come next; this is the navigable root + the
// breadcrumb target for product pages. Static + ISR.

import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { buildPageMetadata } from '@/app/lib/seo';
import LaptopCard from '@/app/components/laptops/LaptopCard';
import { getAllFamilies, allBrands } from '@/app/lib/laptops/queries';
import { listCategories } from '@/app/lib/laptops/categories';

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: 'Gaming Laptops 2026: Specs, Prices & Reviews | FinalBoss.io',
  description:
    'Every 2026 gaming laptop in one place — RTX 5050 to RTX 5090, with specs, configurations, reliability notes and pricing. Compiled from manufacturer specs and independent reviews.',
  path: '/gaming-laptops',
});

export default function GamingLaptopsIndex() {
  const families = getAllFamilies()
    .slice()
    .sort((a, b) => a.manufacturer.localeCompare(b.manufacturer) || a.name.localeCompare(b.name));
  const brands = allBrands();
  const categories = listCategories();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 text-gray-100">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-24">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Gaming Laptops 2026</h1>
            <p className="mt-2 max-w-2xl text-gray-400">
              {families.length} laptop families with full specs, configurations, reliability notes and
              where-to-buy links — from budget RTX 5050 machines to RTX 5090 flagships.
            </p>
          </header>

          {/* Browse by category */}
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Browse by category</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/gaming-laptops/best/${c.slug}`}
                  className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-300 hover:border-gray-600 hover:text-white"
                >
                  {c.title.replace(' Gaming Laptops (2026)', '').replace('Best ', '')}{' '}
                  <span className="text-gray-500">({c.count})</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Browse by brand */}
          <section className="mb-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Browse by brand</h2>
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <Link
                  key={b.slug}
                  href={`/gaming-laptops/brands/${b.slug}`}
                  className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-300 hover:border-gray-600 hover:text-white"
                >
                  {b.name} <span className="text-gray-500">({b.count})</span>
                </Link>
              ))}
            </div>
          </section>

          <h2 className="mb-4 text-xl font-bold text-white">All models</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {families.map((f) => (
              <LaptopCard key={f.slug} family={f} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
