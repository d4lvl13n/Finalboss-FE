// Methodology / "how we research" — E-E-A-T trust page for the handheld section.

import { Metadata } from 'next';
import Link from 'next/link';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { buildPageMetadata, absoluteUrl } from '@/app/lib/seo';
import { getAllHandhelds } from '@/app/lib/handhelds/queries';
import { DATASET_DATE, formatVerifiedDate } from '@/app/lib/handhelds/format';

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: 'How We Research Handheld Gaming PCs — Methodology | FinalBoss.io',
  description:
    'How FinalBoss researches handheld gaming PCs: manufacturer specs pressure-tested against independent testing and owner reports, conflicts recorded, unknowns left blank, every page dated.',
  path: '/handhelds/methodology',
});

export default function MethodologyPage() {
  const devices = getAllHandhelds();
  const count = devices.length;
  const configCount = devices.reduce((n, h) => n + h.configurations.length, 0);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 text-gray-100">
        <div className="mx-auto max-w-3xl px-4 pb-16 pt-24">
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/handhelds" className="hover:text-gray-300">
              Handhelds
            </Link>
            <span className="px-2">/</span>
            <span className="text-gray-400">Methodology</span>
          </nav>

          <h1 className="text-3xl font-bold text-white sm:text-4xl">How we research handheld gaming PCs</h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-300">
            The FinalBoss hardware team maintains a structured database of {count} handheld gaming PCs
            ({configCount} configurations) for 2026 — every device researched, cross-checked and given a
            verdict by us, then turned into the product, category and brand pages across the section. Here is
            how we work, and why you can trust what you read here.
          </p>

          <section className="mt-10 space-y-3">
            <h2 className="text-xl font-bold text-white">How we research each handheld</h2>
            <p className="text-gray-400">
              We start from the manufacturer&apos;s spec sheet — and treat it as a claim to verify, not a
              fact. Our team then pressure-tests every figure against the independent labs and owner
              communities we trust most: Notebookcheck, Tom&apos;s Hardware, PCMag, RTINGS and the handheld
              owner forums where real-world behaviour actually shows up. A spec sheet won&apos;t tell you
              whether a handheld throttles, drifts, cooks its own SD reader, or lasts a real four hours off a
              charge — that is the part we dig for, device by device. Wherever a figure leans on a source, we
              cite it, with a link, in the &quot;Sources &amp; data quality&quot; box on that handheld&apos;s page.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-bold text-white">Our verdicts are our own</h2>
            <p className="text-gray-400">
              The summaries, the pros and cons and the rankings are FinalBoss&apos;s independent editorial
              judgment — not a manufacturer&apos;s marketing line, and not any single reviewer&apos;s score.
              We weigh the evidence, reconcile the contradictions, and tell you what we would actually buy and
              who it is for. No brand pays for placement, and an affiliate link never moves a device up a list.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-bold text-white">Conflicts are recorded, not hidden</h2>
            <p className="text-gray-400">
              Sources disagree constantly in this category — a launch price that shifts between outlets, a
              USB4-vs-USB-3.2 port spec, a battery figure that differs between the spec sheet and a teardown.
              Rather than silently pick one, we record both and show the conflict on the page.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-bold text-white">Unknowns stay blank</h2>
            <p className="text-gray-400">
              When a value can&apos;t be verified — common for announced-but-unshipped devices — we leave it
              out rather than guess or copy it from a similar model. A missing field means &quot;not confirmed
              yet&quot;, not &quot;not applicable&quot;.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-bold text-white">Pricing, freshness &amp; disclosure</h2>
            <p className="text-gray-400">
              Prices are shown as a starting figure valid &quot;as of&quot; the date on each page (currently
              {' '}{formatVerifiedDate(DATASET_DATE)}); always confirm the live price at the retailer before
              buying. Some retailer links are affiliate links — as an Amazon Associate we earn from qualifying
              purchases — but that never affects which devices we include or how we rank them.
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
            name: 'How we research handheld gaming PCs',
            url: absoluteUrl('/handhelds/methodology'),
            publisher: { '@type': 'Organization', name: 'FinalBoss.io', url: absoluteUrl('/') },
          }),
        }}
      />
    </>
  );
}
