// Methodology / "how we research" — the E-E-A-T trust page linked from every
// laptop page's byline + sources block. Explains sourcing, conflict handling,
// the Unknown policy and the freshness cadence.

import { Metadata } from 'next';
import Link from 'next/link';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { buildPageMetadata, absoluteUrl } from '@/app/lib/seo';
import { getAllFamilies } from '@/app/lib/laptops/queries';
import { DATASET_DATE, formatVerifiedDate } from '@/app/lib/laptops/format';

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: 'How We Research Gaming Laptops — Methodology | FinalBoss.io',
  description:
    'How FinalBoss compiles its gaming-laptop database: manufacturer specs cross-referenced with independent reviews and owner reports, conflicts recorded, unknowns left blank, and every page dated.',
  path: '/gaming-laptops/methodology',
});

export default function MethodologyPage() {
  const families = getAllFamilies();
  const familyCount = families.length;
  const configCount = families.reduce((n, f) => n + f.configurations.length, 0);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 text-gray-100">
        <div className="mx-auto max-w-3xl px-4 pb-16 pt-24">
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/gaming-laptops" className="hover:text-gray-300">
              Gaming Laptops
            </Link>
            <span className="px-2">/</span>
            <span className="text-gray-400">Methodology</span>
          </nav>

          <h1 className="text-3xl font-bold text-white sm:text-4xl">How we research gaming laptops</h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-300">
            The FinalBoss hardware team maintains a structured database of {familyCount} gaming-laptop
            families ({configCount} configurations) for 2026 — every model researched, cross-checked and
            given a verdict by us, then turned into the product, category and buying-guide pages across the
            site. Here is how we work, and why you can trust what you read here.
          </p>

          <section className="mt-10 space-y-3">
            <h2 className="text-xl font-bold text-white">How we research each laptop</h2>
            <p className="text-gray-400">
              We start from the manufacturer&apos;s spec sheet — and treat it as a claim to verify, not a
              fact. Our team then pressure-tests every figure against the independent labs and owner
              communities we trust most: Notebookcheck, Tom&apos;s Hardware, PCWorld, RTINGS, TechRadar,
              PCGamer and the brand-specific owner forums where real-world reliability actually shows up. A
              spec sheet will never tell you whether a laptop throttles, coil-whines, or holds together after
              six months — that is the part we dig for, model by model. Wherever a figure leans on a source,
              we cite it, with a link, in the &quot;Sources &amp; data quality&quot; box on that laptop&apos;s page.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-bold text-white">Our verdicts are our own</h2>
            <p className="text-gray-400">
              The summaries, the pros and cons, the rankings and the buying guides are FinalBoss&apos;s
              independent editorial judgment — not a manufacturer&apos;s marketing line, and not any single
              reviewer&apos;s score. We weigh the evidence, reconcile the contradictions (below), and tell you
              what we would actually buy and who it is for. No brand pays for placement, and an affiliate link
              never moves a laptop up a list.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-bold text-white">Conflicts are recorded, not hidden</h2>
            <p className="text-gray-400">
              Manufacturers and reviewers frequently disagree — a CPU SKU that differs by region, a GPU
              power limit that changes between &quot;Turbo&quot; and &quot;Manual&quot; modes, a price that
              swings by hundreds of dollars between retailers. Rather than silently pick one number, we
              record both and show the conflict on the page so you can judge it. Reconciling these is one of
              the main reasons this database exists.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-bold text-white">Unknowns stay blank</h2>
            <p className="text-gray-400">
              When a value can&apos;t be verified from any available source, it is left out — never guessed
              or interpolated from a similar model. A missing field means &quot;not confirmed yet&quot;, not
              &quot;not applicable&quot;.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-bold text-white">Pricing &amp; freshness</h2>
            <p className="text-gray-400">
              Prices are shown as a starting figure valid &quot;as of&quot; the date on each page
              (currently {formatVerifiedDate(DATASET_DATE)}); gaming-laptop prices move constantly, so always
              confirm the live price at the retailer before buying. Pages are dated with a
              &quot;last verified&quot; stamp and re-checked as new reviews and pricing land.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-bold text-white">Affiliate disclosure</h2>
            <p className="text-gray-400">
              Some links to retailers are affiliate links — as an Amazon Associate we earn from qualifying
              purchases. This never affects which laptops we include, how we rank them, or what we say about
              them; the data and the editorial verdicts are independent of any commercial relationship.
            </p>
          </section>
        </div>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'How we research gaming laptops',
            url: absoluteUrl('/gaming-laptops/methodology'),
            publisher: {
              '@type': 'Organization',
              name: 'FinalBoss.io',
              url: absoluteUrl('/'),
            },
          }),
        }}
      />
    </>
  );
}
