// Gaming-laptop product page (family grain) — one page per LaptopFamily, with
// a configuration list, conditional spec sections (full families only), a
// reliability block, an E-E-A-T "Sources & last verified" block, alternatives,
// and an FAQ. Fully static (generateStaticParams) + ISR. Reads ONLY through
// app/lib/laptops/queries.

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { buildPageMetadata, absoluteUrl } from '@/app/lib/seo';
import AmazonBox from '@/app/components/laptops/AmazonBox';
import LaptopCard from '@/app/components/laptops/LaptopCard';
import ProsCons from '@/app/components/laptops/ProsCons';
import Byline from '@/app/components/laptops/Byline';
import TermLinker from '@/app/components/laptops/TermLinker';

import {
  getAllFamilies,
  getFamily,
  comparableFamilies,
  familyGpuTiers,
  brandSlug,
} from '@/app/lib/laptops/queries';
import {
  gpuTierLabel,
  panelLabel,
  priceAsOf,
  startingPrice,
  formatPrice,
  formatVerifiedDate,
} from '@/app/lib/laptops/format';
import { amazonLinkForConfig } from '@/app/lib/laptops/affiliate';
import { getLaptopImage } from '@/app/lib/laptops/images';
import { categoriesForFamily } from '@/app/lib/laptops/categories';
import type {
  Configuration,
  LaptopFamily,
  ReliabilityIssue,
  Severity,
} from '@/app/lib/laptops/types';

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllFamilies().map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const family = getFamily(params.slug);
  if (!family) return { title: 'Laptop not found | FinalBoss.io' };

  const price = startingPrice(family);
  const priceBit = price != null ? ` Priced from ${formatPrice(price)}.` : '';
  const description = (
    family.summary ?? `${family.name}: full specs, configurations, reliability and where to buy.${priceBit}`
  ).slice(0, 200);

  return buildPageMetadata({
    title: `${family.name}: Specs, Price & Review | FinalBoss.io`,
    description,
    path: `/gaming-laptops/${family.slug}`,
    image: getLaptopImage(family.slug)?.url,
    type: 'article',
    modifiedTime: `${family.lastVerified}T00:00:00.000Z`,
    keywords: [family.name, family.manufacturer, 'gaming laptop', '2026'],
  });
}

export default function LaptopPage({ params }: Props) {
  const family = getFamily(params.slug);
  if (!family) notFound();

  const tiers = familyGpuTiers(family);
  const headline = headlineConfig(family);
  const heroImage = getLaptopImage(family.slug);
  const alternatives = comparableFamilies(family, 4);
  const faqs = buildFaqs(family);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 text-gray-100">
        <div className="mx-auto max-w-5xl px-4 pb-12 pt-24">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/gaming-laptops" className="hover:text-gray-300">
              Gaming Laptops
            </Link>
            <span className="px-2">/</span>
            <Link
              href={`/gaming-laptops/brands/${brandSlug(family.manufacturer)}`}
              className="hover:text-gray-300"
            >
              {family.manufacturer}
            </Link>
            <span className="px-2">/</span>
            <span className="text-gray-400">{family.name}</span>
          </nav>

          {/* Hero */}
          <header className="mb-8 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-amber-400">
                {family.manufacturer} · {family.productLine}
              </p>
              <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">{family.name}</h1>
              {family.targetMarket ? (
                <p className="mt-2 text-gray-400">
                  {family.targetMarket}
                  {family.releaseDate ? ` · ${family.releaseDate}` : ''}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                {tiers.map((t) => (
                  <Chip key={t}>{gpuTierLabel(t)}</Chip>
                ))}
                {family.displaySizeInches ? <Chip>{family.displaySizeInches}&quot; display</Chip> : null}
                {family.display ? <Chip>{panelLabel(family.display.panelType)}</Chip> : null}
                {family.build?.weightKg ? <Chip>{family.build.weightKg}</Chip> : null}
              </div>

              <div className="mt-4">
                <Byline lastVerified={family.lastVerified} />
              </div>
            </div>

            {heroImage ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-800 bg-gray-950/40">
                <Image
                  src={heroImage.url}
                  alt={heroImage.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 380px"
                  className="object-contain p-4"
                />
              </div>
            ) : null}
          </header>

          {/* Two-column: content + sticky buy box */}
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="min-w-0 space-y-10">
              {family.summary ? (
                <p className="text-lg leading-relaxed text-gray-300">
                  <TermLinker text={family.summary} />
                </p>
              ) : (
                <p className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-sm text-gray-400">
                  Detailed specs for this model are being finalised. The configurations and where-to-buy
                  links below are current as of {formatVerifiedDate(family.lastVerified)}.
                </p>
              )}

              <ProsCons pros={family.pros} cons={family.cons} />

              <AlsoIn family={family} />

              {/* Configurations */}
              <section>
                <SectionTitle>Configurations</SectionTitle>
                <div className="space-y-3">
                  {family.configurations.map((c) => (
                    <ConfigRow key={c.id} config={c} productName={family.name} />
                  ))}
                </div>
              </section>

              {/* Spec sections (full families) */}
              {family.display ? (
                <SpecSection
                  title="Display"
                  rows={[
                    ['Size', family.display.sizeInches ? `${family.display.sizeInches}"` : undefined],
                    ['Panel', panelLabel(family.display.panelType)],
                    ['Resolution', family.display.resolution],
                    ['Refresh rate', String(family.display.refreshRateHz ?? '')],
                    ['Brightness', family.display.brightnessNits],
                    ['HDR', family.display.hdr],
                    ['Colour gamut', family.display.colorGamut],
                    ['G-Sync / VRR', family.display.gsyncVrr],
                    ['Options', family.display.options],
                  ]}
                />
              ) : null}

              {family.memory ? (
                <SpecSection
                  title="Memory & Upgradeability"
                  rows={[
                    ['Installed RAM', family.memory.installed],
                    ['Type', family.memory.type],
                    ['Max RAM', family.memory.maxGb ? `${family.memory.maxGb} GB` : undefined],
                    ['Upgradeable', boolText(family.memory.upgradeable)],
                    ['Soldered', boolText(family.memory.soldered)],
                    ['SO-DIMM slots', family.memory.slots != null ? String(family.memory.slots) : undefined],
                    ['M.2 SSD slots', family.memory.ssdSlots != null ? String(family.memory.ssdSlots) : undefined],
                    ['Storage', family.memory.storageUpgradeable],
                  ]}
                />
              ) : null}

              {family.thermals ? (
                <SpecSection
                  title="Thermals & Noise"
                  rows={[
                    ['Vapor chamber', unknownableText(family.thermals.vaporChamber)],
                    ['Fans', family.thermals.fanCount != null ? String(family.thermals.fanCount) : undefined],
                    ['Liquid metal', unknownableText(family.thermals.liquidMetal)],
                    ['Noise (gaming)', family.thermals.noiseGamingDb],
                    ['CPU temps', family.thermals.cpuTempNote],
                    ['GPU temps', family.thermals.gpuTempNote],
                    ['Throttling', family.thermals.throttlingNote],
                  ]}
                />
              ) : null}

              {family.battery ? (
                <SpecSection
                  title="Battery"
                  rows={[
                    ['Capacity', family.battery.capacityWh ? `${family.battery.capacityWh} Wh` : undefined],
                    ['Office / web', family.battery.officeHours],
                    ['Gaming', family.battery.gamingHours],
                    ['USB-C charging', family.battery.usbCharging],
                    ['Fast charging', family.battery.fastCharging],
                  ]}
                />
              ) : null}

              {family.connectivity ? (
                <SpecSection
                  title="Connectivity & I/O"
                  rows={[
                    ['Ethernet', family.connectivity.ethernet],
                    ['HDMI', family.connectivity.hdmi],
                    ['USB-A', family.connectivity.usbA],
                    ['USB-C', family.connectivity.usbC],
                    ['USB4', family.connectivity.usb4],
                    ['Thunderbolt', family.connectivity.thunderbolt],
                    ['SD reader', family.connectivity.sdReader],
                    ['Wi-Fi', family.connectivity.wifi],
                    ['Bluetooth', family.connectivity.bluetooth],
                  ]}
                />
              ) : null}

              {family.build ? (
                <SpecSection
                  title="Build & Design"
                  rows={[
                    ['Materials', family.build.materials],
                    ['Weight', family.build.weightKg],
                    ['Thickness', family.build.thickness],
                    ['Keyboard', family.build.keyboard],
                    ['RGB', family.build.rgb],
                    ['Build quality', family.build.buildQuality],
                    ['Repairability', family.build.repairability],
                    ['Upgradeability score', family.build.upgradeabilityScore],
                  ]}
                />
              ) : null}

              {/* Reliability */}
              {family.reliability?.length ? (
                <section>
                  <SectionTitle>Reliability & common issues</SectionTitle>
                  <ul className="space-y-3">
                    {family.reliability.map((issue, i) => (
                      <ReliabilityItem key={i} issue={issue} />
                    ))}
                  </ul>
                </section>
              ) : null}

              {/* FAQ */}
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

              {/* Sources & last verified — E-E-A-T block */}
              <SourcesBlock family={family} />
            </div>

            {/* Sidebar */}
            <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
              <AmazonBox config={headline} productName={family.name} />
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-sm">
                <p className="font-semibold text-gray-200">Quick facts</p>
                <dl className="mt-2 space-y-1.5 text-gray-400">
                  <FactRow label="Best GPU" value={tiers.map(gpuTierLabel).join(', ')} />
                  {family.displaySizeInches ? (
                    <FactRow label="Screen" value={`${family.displaySizeInches}"${family.display ? ` ${panelLabel(family.display.panelType)}` : ''}`} />
                  ) : null}
                  {family.build?.weightKg ? <FactRow label="Weight" value={family.build.weightKg} /> : null}
                  <FactRow label="Configs" value={String(family.configurations.length)} />
                  <FactRow label="Verified" value={formatVerifiedDate(family.lastVerified)} />
                </dl>
              </div>
            </aside>
          </div>

          {/* Alternatives */}
          {alternatives.length ? (
            <section className="mt-14">
              <SectionTitle>Alternatives to consider</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {alternatives.map((f) => (
                  <LaptopCard key={f.slug} family={f} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <Footer />

      <JsonLd family={family} faqs={faqs} />
    </>
  );
}

/* ------------------------------------------------------------------ helpers */

function headlineConfig(family: LaptopFamily): Configuration {
  const priced = family.configurations
    .filter((c) => c.priceUsd != null)
    .sort((a, b) => (a.priceUsd ?? 0) - (b.priceUsd ?? 0));
  return priced[0] ?? family.configurations[0];
}

function boolText(v: boolean | undefined): string | undefined {
  if (v === undefined) return undefined;
  return v ? 'Yes' : 'No';
}

function unknownableText(v: boolean | 'unknown' | undefined): string | undefined {
  if (v === undefined || v === 'unknown') return undefined;
  return v ? 'Yes' : 'No';
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-xs font-medium text-gray-300">
      {children}
    </span>
  );
}

// Hub-and-spoke internal links: brand hub + every category/collection this
// family belongs to. Turns the flat list into a crawlable topical cluster.
function AlsoIn({ family }: { family: LaptopFamily }) {
  const cats = categoriesForFamily(family);
  if (!cats.length) return null;
  const linkCls =
    'rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-300 hover:border-gray-600 hover:text-white';
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Also in</h2>
      <div className="flex flex-wrap gap-2">
        <Link href={`/gaming-laptops/brands/${brandSlug(family.manufacturer)}`} className={linkCls}>
          {family.manufacturer}
        </Link>
        {cats.map((c) => (
          <Link key={c.slug} href={`/gaming-laptops/best/${c.slug}`} className={linkCls}>
            {c.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

/** ISO date + n days, for offers.priceValidUntil. */
function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
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

function ConfigRow({ config, productName }: { config: Configuration; productName: string }) {
  const price = priceAsOf(config);
  const link = amazonLinkForConfig(config);
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-gray-100">{config.label}</p>
          <p className="mt-1 text-sm text-gray-400">
            {config.cpu.model} · {config.gpu.model}
            {config.gpu.vramGb ? ` (${config.gpu.vramGb} GB)` : ''}
            {config.gpu.tgpWatts ? ` · up to ${config.gpu.tgpWatts} W` : ''}
          </p>
          {config.statusNote ? (
            <p className="mt-1 text-xs text-gray-500">{config.statusNote}</p>
          ) : null}
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
          <span
            className={`rounded border px-1.5 py-0.5 text-[11px] font-medium capitalize ${SEVERITY_STYLES[issue.severity]}`}
          >
            {issue.severity}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-gray-400">{issue.detail}</p>
    </li>
  );
}

function SourcesBlock({ family }: { family: LaptopFamily }) {
  const hasSources = Boolean(family.sources?.length);
  const hasConflicts = Boolean(family.conflicts?.length);
  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
      <h2 className="text-lg font-bold text-white">Sources &amp; data quality</h2>
      <p className="mt-1 text-sm text-gray-400">
        Compiled from manufacturer specs and independent reviews. Last verified{' '}
        <span className="font-medium text-gray-200">{formatVerifiedDate(family.lastVerified)}</span>.
        Unknown values are left blank rather than guessed.
      </p>

      {hasConflicts ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Recorded conflicts</p>
          <ul className="mt-2 space-y-2">
            {family.conflicts!.map((c, i) => (
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
            {family.sources!.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-sm text-amber-400/90 hover:text-amber-300"
                >
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

function buildFaqs(family: LaptopFamily): Faq[] {
  const faqs: Faq[] = [];
  const price = startingPrice(family);
  const tiers = familyGpuTiers(family).map(gpuTierLabel);

  if (price != null) {
    faqs.push({
      q: `How much does the ${family.name} cost?`,
      a: `The ${family.name} starts from ${formatPrice(price)} (as of ${formatVerifiedDate(family.lastVerified)}). Pricing varies by configuration and retailer — check the latest on Amazon.`,
    });
  }

  if (tiers.length) {
    faqs.push({
      q: `What GPU does the ${family.name} have?`,
      a: `It is offered with the ${tiers.join(' and ')} (NVIDIA GeForce RTX 50-series). ${family.configurations.length} configuration${family.configurations.length > 1 ? 's are' : ' is'} listed.`,
    });
  }

  if (family.memory?.upgradeable !== undefined) {
    faqs.push({
      q: `Is the RAM upgradeable on the ${family.name}?`,
      a: family.memory.upgradeable
        ? `Yes — the RAM is user-upgradeable${family.memory.maxGb ? ` up to ${family.memory.maxGb} GB` : ''}${family.memory.slots ? ` across ${family.memory.slots} SO-DIMM slots` : ''}.`
        : `No — the RAM is soldered to the mainboard${family.memory.installed ? ` (${family.memory.installed})` : ''} and cannot be upgraded later, so choose your capacity at purchase.`,
    });
  }

  return faqs;
}

function JsonLd({ family, faqs }: { family: LaptopFamily; faqs: Faq[] }) {
  const url = absoluteUrl(`/gaming-laptops/${family.slug}`);
  const price = startingPrice(family);

  const img = getLaptopImage(family.slug);
  const product: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: family.name,
    category: 'Gaming Laptop',
    brand: { '@type': 'Brand', name: family.manufacturer },
    url,
    ...(img ? { image: absoluteUrl(img.url) } : {}),
    ...(family.summary ? { description: family.summary } : {}),
  };
  if (family.pros?.length) {
    product.positiveNotes = {
      '@type': 'ItemList',
      itemListElement: family.pros.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p })),
    };
  }
  if (family.cons?.length) {
    product.negativeNotes = {
      '@type': 'ItemList',
      itemListElement: family.cons.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c })),
    };
  }
  if (price != null) {
    product.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: price,
      offerCount: family.configurations.length,
      availability: 'https://schema.org/InStock',
      priceValidUntil: addDays(family.lastVerified, 30),
      url,
    };
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Gaming Laptops', item: absoluteUrl('/gaming-laptops') },
      { '@type': 'ListItem', position: 2, name: family.manufacturer, item: absoluteUrl(`/gaming-laptops/brands/${brandSlug(family.manufacturer)}`) },
      { '@type': 'ListItem', position: 3, name: family.name, item: url },
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
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  );
}
