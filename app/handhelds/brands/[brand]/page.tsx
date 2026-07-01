// Brand hub — all of one manufacturer's handhelds. Breadcrumb target. Static + ISR.

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { buildPageMetadata, absoluteUrl } from '@/app/lib/seo';
import HandheldCard from '@/app/components/handhelds/HandheldCard';
import { allBrands, getByBrand } from '@/app/lib/handhelds/queries';
import { osLabel, startingPrice, formatPrice } from '@/app/lib/handhelds/format';
import { getHandheldImage } from '@/app/lib/handhelds/images';

export const revalidate = 3600;

interface Props {
  params: { brand: string };
}

export function generateStaticParams() {
  return allBrands().map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const items = getByBrand(params.brand);
  if (!items.length) return { title: 'Brand not found | FinalBoss.io' };
  const name = items[0].manufacturer;
  return buildPageMetadata({
    title: `${name} Handhelds (2026): Specs, Prices & Reviews | FinalBoss.io`,
    description: `Every ${name} handheld gaming PC for 2026 — specs, controls, battery and pricing for all ${items.length} models.`,
    path: `/handhelds/brands/${params.brand}`,
    image: getHandheldImage(items[0].slug)?.url,
  });
}

export default function BrandPage({ params }: Props) {
  const items = getByBrand(params.brand);
  if (!items.length) notFound();

  const name = items[0].manufacturer;
  const sorted = items
    .slice()
    .sort((a, b) => (startingPrice(a) ?? Infinity) - (startingPrice(b) ?? Infinity) || a.name.localeCompare(b.name));
  const prices = items.map(startingPrice).filter((p): p is number => p != null);
  const oses = Array.from(new Set(items.map((h) => osLabel(h.os))));

  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Handhelds', item: absoluteUrl('/handhelds') },
        { '@type': 'ListItem', position: 2, name, item: absoluteUrl(`/handhelds/brands/${params.brand}`) },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${name} handhelds (2026)`,
      numberOfItems: items.length,
      itemListElement: sorted.map((h, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(`/handhelds/${h.slug}`),
        name: h.name,
      })),
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 text-gray-100">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-24">
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/handhelds" className="hover:text-gray-300">
              Handhelds
            </Link>
            <span className="px-2">/</span>
            <span className="text-gray-400">{name}</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{name} Handhelds (2026)</h1>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-400">
              <span>
                <span className="font-semibold text-gray-200">{items.length}</span> models
              </span>
              {prices.length ? (
                <span>
                  From <span className="font-semibold text-gray-200">{formatPrice(Math.min(...prices))}</span>
                </span>
              ) : null}
              <span>
                OS: <span className="text-gray-300">{oses.join(', ')}</span>
              </span>
            </div>
            <p className="mt-3 max-w-2xl text-sm text-gray-400">
              {name}&apos;s complete handheld gaming PC range — specs, controls, battery and live pricing for
              every model, compiled from manufacturer specs and independent reviews.
            </p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sorted.map((h) => (
              <HandheldCard key={h.slug} handheld={h} />
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
