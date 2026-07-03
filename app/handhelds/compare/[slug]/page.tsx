// Handheld head-to-head comparison page (A vs B). Curated pairs, spec-diff
// table, pros/cons side by side, buy CTAs and cross-links to related
// comparisons. Static + ISR. Reads only through app/lib/handhelds/*.

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { buildPageMetadata, absoluteUrl } from '@/app/lib/seo';
import AmazonBox from '@/app/components/handhelds/AmazonBox';
import ProsCons from '@/app/components/laptops/ProsCons';

import {
  getAllComparisons,
  getComparison,
  comparisonsFor,
  buildSpecRows,
  type ResolvedComparison,
  type SpecRow,
} from '@/app/lib/handhelds/comparisons';
import { startingPrice, formatPrice, PRICE_VOLATILITY_NOTE } from '@/app/lib/handhelds/format';
import { getHandheldImage } from '@/app/lib/handhelds/images';
import type { Handheld } from '@/app/lib/handhelds/types';

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllComparisons().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getComparison(params.slug);
  if (!c) return { title: 'Comparison not found | FinalBoss.io' };
  const { handheldA, handheldB } = c;
  return buildPageMetadata({
    title: `${handheldA.name} vs ${handheldB.name}: Which Handheld Should You Buy? | FinalBoss.io`,
    description: c.verdict.slice(0, 200),
    path: `/handhelds/compare/${c.slug}`,
    image: getHandheldImage(handheldA.slug)?.url,
    type: 'article',
    keywords: [handheldA.name, handheldB.name, 'handheld gaming pc comparison', '2026'],
  });
}

export default function ComparePage({ params }: Props) {
  const c = getComparison(params.slug);
  if (!c) notFound();

  const { handheldA, handheldB } = c;
  const imageA = getHandheldImage(handheldA.slug);
  const imageB = getHandheldImage(handheldB.slug);
  const rows = buildSpecRows(handheldA, handheldB);
  const related = [...comparisonsFor(handheldA.slug), ...comparisonsFor(handheldB.slug)].filter(
    (r, i, arr) => r.slug !== c.slug && arr.findIndex((x) => x.slug === r.slug) === i
  );

  const priceA = startingPrice(handheldA);
  const priceB = startingPrice(handheldB);
  const headlineA = headlineConfig(handheldA);
  const headlineB = headlineConfig(handheldB);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 text-gray-100">
        <div className="mx-auto max-w-5xl px-4 pb-12 pt-24">
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/handhelds" className="hover:text-gray-300">
              Handhelds
            </Link>
            <span className="px-2">/</span>
            <Link href="/handhelds/compare" className="hover:text-gray-300">
              Compare
            </Link>
            <span className="px-2">/</span>
            <span className="text-gray-400">
              {handheldA.name} vs {handheldB.name}
            </span>
          </nav>

          {/* Hero */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {handheldA.name} vs {handheldB.name}
            </h1>

            <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-6">
              <DeviceHero handheld={handheldA} image={imageA?.url} imageAlt={imageA?.alt} price={priceA} />
              <span className="text-lg font-bold text-gray-500">vs</span>
              <DeviceHero handheld={handheldB} image={imageB?.url} imageAlt={imageB?.alt} price={priceB} />
            </div>
          </header>

          <p className="text-lg leading-relaxed text-gray-300">{c.verdict}</p>

          {/* Spec comparison table */}
          <section className="mt-10">
            <SectionTitle>Spec comparison</SectionTitle>
            <div className="overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/60">
                    <th className="px-4 py-3 text-left font-semibold text-gray-400">Spec</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-200">{handheldA.name}</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-200">{handheldB.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <SpecTableRow key={r.label} row={r} />
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-500">{PRICE_VOLATILITY_NOTE}</p>
          </section>

          {/* Pros / cons side by side */}
          <section className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">{handheldA.name}</h3>
              <ProsCons pros={handheldA.pros} cons={handheldA.cons} />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">{handheldB.name}</h3>
              <ProsCons pros={handheldB.pros} cons={handheldB.cons} />
            </div>
          </section>

          {/* Who should buy which */}
          <section className="mt-10">
            <SectionTitle>Who should buy which</SectionTitle>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <p className="text-gray-300">{c.whoA}</p>
                <AmazonBox config={headlineA} productName={handheldA.name} />
              </div>
              <div className="space-y-4">
                <p className="text-gray-300">{c.whoB}</p>
                <AmazonBox config={headlineB} productName={handheldB.name} />
              </div>
            </div>
          </section>

          {related.length ? (
            <section className="mt-14 border-t border-gray-800 pt-8">
              <SectionTitle>Related comparisons</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/handhelds/compare/${r.slug}`}
                    className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-300 hover:border-gray-600 hover:text-white"
                  >
                    {r.handheldA.name} vs {r.handheldB.name}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <Footer />
      <JsonLd comparison={c} />
    </>
  );
}

/* ------------------------------------------------------------------ helpers */

function headlineConfig(h: Handheld) {
  const priced = h.configurations
    .filter((c) => c.priceUsd != null)
    .sort((a, b) => (a.priceUsd ?? 0) - (b.priceUsd ?? 0));
  return priced[0] ?? h.configurations[0];
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-xl font-bold text-white">{children}</h2>;
}

function DeviceHero({
  handheld,
  image,
  imageAlt,
  price,
}: {
  handheld: Handheld;
  image?: string;
  imageAlt?: string;
  price: number | null;
}) {
  return (
    <Link href={`/handhelds/${handheld.slug}`} className="group flex flex-col items-center text-center">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-gray-800 bg-gray-900/40">
        {image ? (
          <Image
            src={image}
            alt={imageAlt ?? handheld.name}
            fill
            sizes="(max-width: 640px) 40vw, 220px"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs text-gray-600">{handheld.manufacturer}</span>
          </div>
        )}
      </div>
      <p className="mt-3 text-sm font-semibold leading-snug text-gray-100 group-hover:text-white">{handheld.name}</p>
      <p className="mt-1 text-sm font-semibold text-amber-400">
        {price != null ? `from ${formatPrice(price)}` : 'Price unavailable'}
      </p>
    </Link>
  );
}

function SpecTableRow({ row }: { row: SpecRow }) {
  const cellClass = (winner: boolean) =>
    winner ? 'px-4 py-2.5 font-semibold text-amber-400 bg-amber-500/5' : 'px-4 py-2.5 text-gray-300';
  return (
    <tr className="border-b border-gray-800/70 last:border-0">
      <td className="px-4 py-2.5 text-gray-500">{row.label}</td>
      <td className={cellClass(row.winner === 'a')}>
        {row.winner === 'a' ? <span aria-hidden className="mr-1">✓</span> : null}
        {row.a}
      </td>
      <td className={cellClass(row.winner === 'b')}>
        {row.winner === 'b' ? <span aria-hidden className="mr-1">✓</span> : null}
        {row.b}
      </td>
    </tr>
  );
}

function productNode(h: Handheld, url: string) {
  const price = startingPrice(h);
  const img = getHandheldImage(h.slug);
  const node: Record<string, unknown> = {
    '@type': 'Product',
    name: h.name,
    category: 'Handheld Gaming PC',
    brand: { '@type': 'Brand', name: h.manufacturer },
    url,
    ...(img ? { image: absoluteUrl(img.url) } : {}),
    ...(h.summary ? { description: h.summary } : {}),
  };
  if (price != null) {
    node.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: price,
      offerCount: h.configurations.length,
      availability: 'https://schema.org/InStock',
      url,
    };
  }
  return node;
}

function JsonLd({ comparison }: { comparison: ResolvedComparison }) {
  const { handheldA, handheldB, slug } = comparison;
  const url = absoluteUrl(`/handhelds/compare/${slug}`);
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Handhelds', item: absoluteUrl('/handhelds') },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: absoluteUrl('/handhelds/compare') },
      { '@type': 'ListItem', position: 3, name: `${handheldA.name} vs ${handheldB.name}`, item: url },
    ],
  };
  const graph: Record<string, unknown>[] = [
    breadcrumb,
    { '@context': 'https://schema.org', ...productNode(handheldA, absoluteUrl(`/handhelds/${handheldA.slug}`)) },
    { '@context': 'https://schema.org', ...productNode(handheldB, absoluteUrl(`/handhelds/${handheldB.slug}`)) },
  ];
  return (
    <>
      {graph.map((node, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }} />
      ))}
    </>
  );
}
