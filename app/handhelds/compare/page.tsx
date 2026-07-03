// Handheld comparisons index — lists every curated A-vs-B pair. Static + ISR.

import { Metadata } from 'next';
import Link from 'next/link';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { buildPageMetadata, absoluteUrl } from '@/app/lib/seo';
import { getAllComparisons } from '@/app/lib/handhelds/comparisons';
import { startingPriceLabel } from '@/app/lib/handhelds/format';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Handheld Gaming PC Comparisons: Head-to-Head Buying Guides | FinalBoss.io',
    description:
      'Steam Deck vs ROG Ally, Legion Go vs Legion Go 2 and more — head-to-head handheld gaming PC comparisons with spec tables and buying verdicts.',
    path: '/handhelds/compare',
  });
}

export default function CompareIndexPage() {
  const comparisons = getAllComparisons();

  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Handhelds', item: absoluteUrl('/handhelds') },
        { '@type': 'ListItem', position: 2, name: 'Compare', item: absoluteUrl('/handhelds/compare') },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Handheld Gaming PC Comparisons',
      numberOfItems: comparisons.length,
      itemListElement: comparisons.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(`/handhelds/compare/${c.slug}`),
        name: `${c.handheldA.name} vs ${c.handheldB.name}`,
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
            <span className="text-gray-400">Compare</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Handheld Gaming PC Comparisons</h1>
            <p className="mt-2 max-w-2xl text-gray-300">
              Head-to-head verdicts on the handheld matchups buyers actually ask about — spec tables, pros/cons and
              a straight answer on who should buy which.
            </p>
            <p className="mt-2 text-sm text-gray-500">{comparisons.length} comparisons</p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comparisons.map((c) => (
              <ComparisonCard key={c.slug} comparison={c} />
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

function ComparisonCard({ comparison }: { comparison: ReturnType<typeof getAllComparisons>[number] }) {
  const { handheldA, handheldB, slug } = comparison;
  return (
    <Link
      href={`/handhelds/compare/${slug}`}
      className="group flex flex-col rounded-xl border border-gray-800 bg-gray-900/50 p-5 transition-colors hover:border-gray-700 hover:bg-gray-900"
    >
      <h2 className="text-base font-semibold leading-snug text-gray-100 group-hover:text-white">
        {handheldA.name} <span className="text-gray-500">vs</span> {handheldB.name}
      </h2>
      <div className="mt-3 flex items-center justify-between text-sm text-amber-400">
        <span>{startingPriceLabel(handheldA)}</span>
        <span className="text-gray-600">·</span>
        <span>{startingPriceLabel(handheldB)}</span>
      </div>
    </Link>
  );
}
