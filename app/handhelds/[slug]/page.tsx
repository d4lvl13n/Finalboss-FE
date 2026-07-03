// Handheld product page (family grain). Configurations, conditional spec
// sections (display, controls, battery, thermals, build, connectivity),
// reliability, sources/E-E-A-T, alternatives, FAQ, Product/Breadcrumb/FAQ
// JSON-LD. Static + ISR. Reads only through app/lib/handhelds/*.

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { buildPageMetadata, absoluteUrl } from '@/app/lib/seo';
import AmazonBox from '@/app/components/handhelds/AmazonBox';
import HandheldCard from '@/app/components/handhelds/HandheldCard';
import Byline from '@/app/components/handhelds/Byline';
import ProsCons from '@/app/components/laptops/ProsCons';

import {
  getAllHandhelds,
  getHandheld,
  comparableHandhelds,
  brandSlug,
} from '@/app/lib/handhelds/queries';
import { categoriesForHandheld } from '@/app/lib/handhelds/categories';
import { comparisonsFor, type ResolvedComparison } from '@/app/lib/handhelds/comparisons';
import {
  osLabel,
  panelLabel,
  priceAsOf,
  startingPrice,
  formatPrice,
  formatVerifiedDate,
  PRICE_VOLATILITY_NOTE,
} from '@/app/lib/handhelds/format';
import { amazonLinkForConfig } from '@/app/lib/handhelds/affiliate';
import { getHandheldImage } from '@/app/lib/handhelds/images';
import type { Configuration, Handheld, ReliabilityIssue, Severity } from '@/app/lib/handhelds/types';

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllHandhelds().map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const h = getHandheld(params.slug);
  if (!h) return { title: 'Handheld not found | FinalBoss.io' };
  const price = startingPrice(h);
  const priceBit = price != null ? ` Priced from ${formatPrice(price)}.` : '';
  const description = (
    h.summary ?? `${h.name}: full specs, configurations, reliability and where to buy.${priceBit}`
  ).slice(0, 200);
  return buildPageMetadata({
    title: `${h.name}: Specs, Price & Review | FinalBoss.io`,
    description,
    path: `/handhelds/${h.slug}`,
    image: getHandheldImage(h.slug)?.url,
    type: 'article',
    modifiedTime: `${h.lastVerified}T00:00:00.000Z`,
    keywords: [h.name, h.manufacturer, 'handheld gaming pc', osLabel(h.os), '2026'],
  });
}

export default function HandheldPage({ params }: Props) {
  const h = getHandheld(params.slug);
  if (!h) notFound();

  const image = getHandheldImage(h.slug);
  const headline = headlineConfig(h);
  const alternatives = comparableHandhelds(h, 4);
  const comparisons = comparisonsFor(h.slug);
  const faqs = buildFaqs(h);

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
            <Link href={`/handhelds/brands/${brandSlug(h.manufacturer)}`} className="hover:text-gray-300">
              {h.manufacturer}
            </Link>
            <span className="px-2">/</span>
            <span className="text-gray-400">{h.name}</span>
          </nav>

          {/* Hero */}
          <header className="mb-8 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-amber-400">
                {h.manufacturer} · {h.productLine}
              </p>
              <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">{h.name}</h1>
              {h.targetMarket || h.status2026 ? (
                <p className="mt-2 text-gray-400">
                  {[h.targetMarket, h.status2026].filter(Boolean).join(' · ')}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <Chip>{osLabel(h.os)}</Chip>
                {h.displaySizeInches ? <Chip>{h.displaySizeInches}&quot; screen</Chip> : null}
                {h.display ? <Chip>{panelLabel(h.display.panelType)}</Chip> : null}
                {h.ergonomics?.weightGrams ? <Chip>{h.ergonomics.weightGrams} g</Chip> : null}
              </div>

              <div className="mt-4">
                <Byline lastVerified={h.lastVerified} />
              </div>
            </div>

            {image ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-800 bg-gray-950/40">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 380px"
                  className="object-contain p-4"
                />
              </div>
            ) : null}
          </header>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="min-w-0 space-y-10">
              {h.summary ? (
                <p className="text-lg leading-relaxed text-gray-300">{h.summary}</p>
              ) : null}

              <ProsCons pros={h.pros} cons={h.cons} />

              <AlsoIn handheld={h} />

              <CompareLinks handheld={h} comparisons={comparisons} />

              {/* Configurations */}
              <section>
                <SectionTitle>Configurations</SectionTitle>
                <div className="space-y-3">
                  {h.configurations.map((c) => (
                    <ConfigRow key={c.id} config={c} productName={h.name} />
                  ))}
                </div>
                <p className="mt-3 text-xs text-gray-500">{PRICE_VOLATILITY_NOTE}</p>
              </section>

              {h.display ? (
                <SpecSection
                  title="Display"
                  rows={[
                    ['Size', h.display.sizeInches ? `${h.display.sizeInches}"` : undefined],
                    ['Panel', panelLabel(h.display.panelType)],
                    ['Resolution', h.display.resolution],
                    ['Refresh rate', h.display.refreshRateHz != null ? String(h.display.refreshRateHz) : undefined],
                    ['VRR', h.display.vrr],
                    ['Brightness', h.display.brightnessNits],
                    ['Colour gamut', h.display.colorGamut],
                    ['Touch', boolText(h.display.touch)],
                  ]}
                />
              ) : null}

              {h.controls ? (
                <SpecSection
                  title="Controls & input"
                  rows={[
                    ['Hall-effect sticks', unknownableText(h.controls.hallSticks)],
                    ['Triggers', h.controls.triggers],
                    ['Gyro', unknownableText(h.controls.gyro)],
                    ['Trackpads', h.controls.trackpads],
                    ['Back buttons', h.controls.backButtons != null ? String(h.controls.backButtons) : undefined],
                    ['Haptics', h.controls.haptics],
                    ['Layout', h.controls.layoutNote],
                  ]}
                />
              ) : null}

              {h.battery ? (
                <SpecSection
                  title="Battery & power"
                  rows={[
                    ['Capacity', h.battery.capacityWh ? `${h.battery.capacityWh} Wh` : undefined],
                    ['Charger', h.battery.chargerW ? `${h.battery.chargerW} W` : undefined],
                    ['Life (low TDP)', h.battery.lifeLowTdp],
                    ['Life (balanced)', h.battery.lifeBalanced],
                    ['Life (high TDP)', h.battery.lifeHighTdp],
                  ]}
                />
              ) : null}

              {h.thermals ? (
                <SpecSection
                  title="Thermals & noise"
                  rows={[
                    ['Fans', h.thermals.fanCount != null ? String(h.thermals.fanCount) : undefined],
                    ['Cooling', h.thermals.coolingDesign],
                    ['Noise', h.thermals.noiseNote],
                    ['Throttling', h.thermals.throttlingNote],
                  ]}
                />
              ) : null}

              {h.ergonomics ? (
                <SpecSection
                  title="Build & ergonomics"
                  rows={[
                    ['Weight', h.ergonomics.weightGrams ? `${h.ergonomics.weightGrams} g` : undefined],
                    ['Dimensions', h.ergonomics.dimensions],
                    ['Materials', h.ergonomics.materials],
                    ['Notes', h.ergonomics.notes],
                  ]}
                />
              ) : null}

              {h.connectivity ? (
                <SpecSection
                  title="Connectivity & ports"
                  rows={[
                    ['Ports', h.connectivity.ports],
                    ['USB4 / Thunderbolt', h.connectivity.usb4Thunderbolt],
                    ['External GPU', h.connectivity.externalGpu],
                    ['Wi-Fi', h.connectivity.wifi],
                    ['Bluetooth', h.connectivity.bluetooth],
                  ]}
                />
              ) : null}

              {h.reliability?.length ? (
                <section>
                  <SectionTitle>Reliability &amp; common issues</SectionTitle>
                  <ul className="space-y-3">
                    {h.reliability.map((issue, i) => (
                      <ReliabilityItem key={i} issue={issue} />
                    ))}
                  </ul>
                </section>
              ) : null}

              {faqs.length ? (
                <section>
                  <SectionTitle>FAQ</SectionTitle>
                  <div className="space-y-4">
                    {faqs.map((f) => (
                      <div key={f.q}>
                        <h3 className="font-semibold text-gray-100">{f.q}</h3>
                        <p className="mt-1 text-sm text-gray-400">{f.a}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              <SourcesBlock handheld={h} />
            </div>

            <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
              <AmazonBox config={headline} productName={h.name} />
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-sm">
                <p className="font-semibold text-gray-200">Quick facts</p>
                <dl className="mt-2 space-y-1.5 text-gray-400">
                  <FactRow label="OS" value={osLabel(h.os)} />
                  {h.displaySizeInches ? (
                    <FactRow label="Screen" value={`${h.displaySizeInches}"${h.display ? ` ${panelLabel(h.display.panelType)}` : ''}`} />
                  ) : null}
                  {h.ergonomics?.weightGrams ? <FactRow label="Weight" value={`${h.ergonomics.weightGrams} g`} /> : null}
                  {h.battery?.capacityWh ? <FactRow label="Battery" value={`${h.battery.capacityWh} Wh`} /> : null}
                  <FactRow label="Configs" value={String(h.configurations.length)} />
                  <FactRow label="Verified" value={formatVerifiedDate(h.lastVerified)} />
                </dl>
              </div>
            </aside>
          </div>

          {alternatives.length ? (
            <section className="mt-14">
              <SectionTitle>Alternatives to consider</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {alternatives.map((a) => (
                  <HandheldCard key={a.slug} handheld={a} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <Footer />
      <JsonLd handheld={h} faqs={faqs} />
    </>
  );
}

/* ------------------------------------------------------------------ helpers */

function headlineConfig(h: Handheld): Configuration {
  const priced = h.configurations
    .filter((c) => c.priceUsd != null)
    .sort((a, b) => (a.priceUsd ?? 0) - (b.priceUsd ?? 0));
  return priced[0] ?? h.configurations[0];
}

function boolText(v: boolean | undefined): string | undefined {
  if (v === undefined) return undefined;
  return v ? 'Yes' : 'No';
}
function unknownableText(v: boolean | 'unknown' | undefined): string | undefined {
  if (v === undefined || v === 'unknown') return undefined;
  return v ? 'Yes' : 'No';
}
function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-xs font-medium text-gray-300">
      {children}
    </span>
  );
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-xl font-bold text-white">{children}</h2>;
}
function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-right text-gray-300">{value}</dd>
    </div>
  );
}

function AlsoIn({ handheld }: { handheld: Handheld }) {
  const cats = categoriesForHandheld(handheld);
  if (!cats.length) return null;
  const cls =
    'rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-300 hover:border-gray-600 hover:text-white';
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Also in</h2>
      <div className="flex flex-wrap gap-2">
        <Link href={`/handhelds/brands/${brandSlug(handheld.manufacturer)}`} className={cls}>
          {handheld.manufacturer}
        </Link>
        {cats.map((c) => (
          <Link key={c.slug} href={`/handhelds/best/${c.slug}`} className={cls}>
            {c.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

function CompareLinks({ handheld, comparisons }: { handheld: Handheld; comparisons: ResolvedComparison[] }) {
  if (!comparisons.length) return null;
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Compare the {handheld.name}
      </h2>
      <div className="flex flex-wrap gap-2">
        {comparisons.map((c) => {
          const other = c.handheldA.slug === handheld.slug ? c.handheldB : c.handheldA;
          return (
            <Link
              key={c.slug}
              href={`/handhelds/compare/${c.slug}`}
              className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-300 hover:border-gray-600 hover:text-white"
            >
              vs {other.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ConfigRow({ config, productName }: { config: Configuration; productName: string }) {
  const price = priceAsOf(config);
  const link = amazonLinkForConfig(config, productName);
  const apu = config.apu;
  const specLine = [
    apu.model,
    apu.gpuArch,
    apu.cores,
    apu.tdpRangeW ? `${apu.tdpRangeW} TDP` : undefined,
    config.ramGb ? `${config.ramGb} GB` : undefined,
    config.storage,
  ]
    .filter(Boolean)
    .join(' · ');
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-gray-100">{config.label}</p>
          <p className="mt-1 text-sm text-gray-400">{specLine}</p>
          {config.statusNote ? <p className="mt-1 text-xs text-gray-500">{config.statusNote}</p> : null}
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-white">{price ?? '—'}</p>
          <a
            href={link.url}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            aria-label={`Check price for ${productName} ${config.label}`}
            className="mt-1 inline-block text-xs font-semibold text-amber-400 hover:text-amber-300"
          >
            Check price →
          </a>
        </div>
      </div>
    </div>
  );
}

function SpecSection({ title, rows }: { title: string; rows: Array<[string, string | undefined]> }) {
  const present = rows.filter((r): r is [string, string] => Boolean(r[1] && r[1].trim()));
  if (!present.length) return null;
  return (
    <section>
      <SectionTitle>{title}</SectionTitle>
      <dl className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
        {present.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 border-b border-gray-800/70 py-1.5">
            <dt className="text-sm text-gray-500">{label}</dt>
            <dd className="text-right text-sm text-gray-200">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const SEVERITY_STYLES: Record<Severity, string> = {
  high: 'bg-red-500/15 text-red-300 border-red-500/30',
  moderate: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  low: 'bg-gray-700/40 text-gray-300 border-gray-600/40',
};
function ReliabilityItem({ issue }: { issue: ReliabilityIssue }) {
  return (
    <li className="rounded-lg border border-gray-800 bg-gray-900/40 p-4">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-100">{issue.area}</span>
        {issue.severity ? (
          <span className={`rounded border px-1.5 py-0.5 text-[11px] font-medium capitalize ${SEVERITY_STYLES[issue.severity]}`}>
            {issue.severity}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-gray-400">{issue.detail}</p>
    </li>
  );
}

function SourcesBlock({ handheld }: { handheld: Handheld }) {
  const hasSources = Boolean(handheld.sources?.length);
  const hasConflicts = Boolean(handheld.conflicts?.length);
  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
      <h2 className="text-lg font-bold text-white">Sources &amp; data quality</h2>
      <p className="mt-1 text-sm text-gray-400">
        Compiled from manufacturer specs and independent reviews. Last verified{' '}
        <span className="font-medium text-gray-200">{formatVerifiedDate(handheld.lastVerified)}</span>. Unknown
        values are left blank rather than guessed.
      </p>
      {hasConflicts ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Recorded conflicts</p>
          <ul className="mt-2 space-y-2">
            {handheld.conflicts!.map((c, i) => (
              <li key={i} className="text-sm text-gray-400">
                <span className="font-medium text-gray-300">{c.field}:</span> {c.detail}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {hasSources ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Sources</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {handheld.sources!.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="text-sm text-amber-400/90 hover:text-amber-300">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

interface Faq {
  q: string;
  a: string;
}
function buildFaqs(h: Handheld): Faq[] {
  const faqs: Faq[] = [];
  const price = startingPrice(h);
  if (price != null) {
    faqs.push({
      q: `How much does the ${h.name} cost?`,
      a: `The ${h.name} starts from ${formatPrice(price)} (as of ${formatVerifiedDate(h.lastVerified)}). Pricing varies by configuration and retailer — check the latest on Amazon.`,
    });
  }
  faqs.push({
    q: `What operating system does the ${h.name} run?`,
    a: `It runs ${osLabel(h.os)}${h.os === 'SteamOS' ? ' — Valve’s console-style handheld OS with strong battery efficiency' : h.os === 'Windows' ? ' — full access to every PC storefront and anti-cheat, with more UI friction than SteamOS' : ''}.`,
  });
  if (h.controls?.hallSticks !== undefined && h.controls.hallSticks !== 'unknown') {
    faqs.push({
      q: `Does the ${h.name} have Hall-effect sticks?`,
      a: h.controls.hallSticks
        ? `Yes — the ${h.name} uses Hall-effect analog sticks, which use magnets instead of contact potentiometers and don’t develop drift over time.`
        : `No — the ${h.name} uses conventional potentiometer sticks, which can develop drift over time (its triggers may still be Hall-effect).`,
    });
  }
  return faqs;
}

function JsonLd({ handheld, faqs }: { handheld: Handheld; faqs: Faq[] }) {
  const url = absoluteUrl(`/handhelds/${handheld.slug}`);
  const price = startingPrice(handheld);
  const img = getHandheldImage(handheld.slug);
  const product: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: handheld.name,
    category: 'Handheld Gaming PC',
    brand: { '@type': 'Brand', name: handheld.manufacturer },
    url,
    ...(img ? { image: absoluteUrl(img.url) } : {}),
    ...(handheld.summary ? { description: handheld.summary } : {}),
  };
  if (handheld.pros?.length) {
    product.positiveNotes = {
      '@type': 'ItemList',
      itemListElement: handheld.pros.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p })),
    };
  }
  if (handheld.cons?.length) {
    product.negativeNotes = {
      '@type': 'ItemList',
      itemListElement: handheld.cons.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c })),
    };
  }
  if (price != null) {
    product.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: price,
      offerCount: handheld.configurations.length,
      availability: 'https://schema.org/InStock',
      priceValidUntil: addDays(handheld.lastVerified, 30),
      url,
    };
  }
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Handhelds', item: absoluteUrl('/handhelds') },
      { '@type': 'ListItem', position: 2, name: handheld.manufacturer, item: absoluteUrl(`/handhelds/brands/${brandSlug(handheld.manufacturer)}`) },
      { '@type': 'ListItem', position: 3, name: handheld.name, item: url },
    ],
  };
  const graph: Record<string, unknown>[] = [product, breadcrumb];
  if (faqs.length >= 2) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }
  return (
    <>
      {graph.map((node, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }} />
      ))}
    </>
  );
}
