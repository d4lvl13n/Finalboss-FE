// Brand hub — all of one manufacturer's 2026 families, with quick brand stats.
// This is the breadcrumb target from product pages. Static + ISR.

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { buildPageMetadata, absoluteUrl } from '@/app/lib/seo';
import LaptopCard from '@/app/components/laptops/LaptopCard';
import { allBrands, getFamiliesByBrand, familyGpuTiers } from '@/app/lib/laptops/queries';
import { gpuTierLabel, startingPrice, formatPrice } from '@/app/lib/laptops/format';
import { getLaptopImage } from '@/app/lib/laptops/images';

export const revalidate = 3600;

interface Props {
  params: { brand: string };
}

export function generateStaticParams() {
  return allBrands().map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const families = getFamiliesByBrand(params.brand);
  if (!families.length) return { title: 'Brand not found | FinalBoss.io' };
  const name = families[0].manufacturer;
  return buildPageMetadata({
    title: `${name} Gaming Laptops (2026): Specs, Prices & Reviews | FinalBoss.io`,
    description: `Every ${name} gaming laptop for 2026 — specs, configurations, reliability notes and pricing for all ${families.length} models.`,
    path: `/gaming-laptops/brands/${params.brand}`,
    image: getLaptopImage(families[0].slug)?.url,
  });
}

export default function BrandPage({ params }: Props) {
  const families = getFamiliesByBrand(params.brand);
  if (!families.length) notFound();

  const name = families[0].manufacturer;
  const sorted = families
    .slice()
    .sort((a, b) => (startingPrice(a) ?? Infinity) - (startingPrice(b) ?? Infinity) || a.name.localeCompare(b.name));

  const prices = families.map(startingPrice).filter((p): p is number => p != null);
  const tiers = Array.from(new Set(families.flatMap(familyGpuTiers)));

  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Gaming Laptops', item: absoluteUrl('/gaming-laptops') },
        { '@type': 'ListItem', position: 2, name, item: absoluteUrl(`/gaming-laptops/brands/${params.brand}`) },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${name} gaming laptops (2026)`,
      numberOfItems: families.length,
      itemListElement: sorted.map((f, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(`/gaming-laptops/${f.slug}`),
        name: f.name,
      })),
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 text-gray-100">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-24">
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/gaming-laptops" className="hover:text-gray-300">
              Gaming Laptops
            </Link>
            <span className="px-2">/</span>
            <span className="text-gray-400">{name}</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{name} Gaming Laptops (2026)</h1>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-400">
              <span>
                <span className="font-semibold text-gray-200">{families.length}</span> models
              </span>
              {prices.length ? (
                <span>
                  From <span className="font-semibold text-gray-200">{formatPrice(Math.min(...prices))}</span>
                </span>
              ) : null}
              <span>
                GPUs:{' '}
                <span className="text-gray-300">
                  {tiers.filter((t) => t !== 'other' && t !== 'igpu').map(gpuTierLabel).join(', ')}
                </span>
              </span>
            </div>
            <p className="mt-3 max-w-2xl text-sm text-gray-400">
              {name}&apos;s complete 2026 gaming-laptop range — specs, configurations, reliability notes and
              live pricing for every model, compiled from manufacturer specs and independent reviews.
            </p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sorted.map((f) => (
              <LaptopCard key={f.slug} family={f} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
      {graph.map((node, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }} />
      ))}
    </>
  );
}
