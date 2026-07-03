// Buying-guide page — markdown editorial body + ranked picks rendered LIVE from
// the dataset (current price + Amazon CTA), so prose stays editable while
// pricing never goes stale. Static + ISR.

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { buildPageMetadata, absoluteUrl } from '@/app/lib/seo';
import Byline from '@/app/components/handhelds/Byline';
import { getAllGuides, getGuide } from '@/app/lib/handhelds/guides';
import { getHandheldImage } from '@/app/lib/handhelds/images';
import { startingPriceLabel, DATASET_DATE, osLabel, panelLabel } from '@/app/lib/handhelds/format';
import { amazonLinkForConfig } from '@/app/lib/handhelds/affiliate';
import type { Configuration, Handheld } from '@/app/lib/handhelds/types';

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide(params.slug);
  if (!guide) return { title: 'Not found | FinalBoss.io' };
  return buildPageMetadata({
    title: `${guide.title} | FinalBoss.io`,
    description: guide.description,
    path: `/handhelds/guides/${guide.slug}`,
    image: guide.picks[0] ? getHandheldImage(guide.picks[0].handheld.slug)?.url : undefined,
    type: 'article',
    modifiedTime: guide.updated ? `${guide.updated}T00:00:00.000Z` : undefined,
  });
}

const MD = {
  p: ({ node, ...p }: any) => <p className="leading-relaxed text-gray-300" {...p} />,
  h2: ({ node, ...p }: any) => <h2 className="mb-3 mt-8 text-xl font-bold text-white" {...p} />,
  h3: ({ node, ...p }: any) => <h3 className="mb-2 mt-6 text-lg font-semibold text-white" {...p} />,
  ul: ({ node, ...p }: any) => <ul className="my-3 list-disc space-y-1 pl-5 text-gray-300" {...p} />,
  ol: ({ node, ...p }: any) => <ol className="my-3 list-decimal space-y-1 pl-5 text-gray-300" {...p} />,
  a: ({ node, ...p }: any) => <a className="text-amber-300 hover:text-amber-200" {...p} />,
  strong: ({ node, ...p }: any) => <strong className="text-white" {...p} />,
};

export default function GuidePage({ params }: Props) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();

  const url = absoluteUrl(`/handhelds/guides/${guide.slug}`);
  const graph: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Handhelds', item: absoluteUrl('/handhelds') },
        { '@type': 'ListItem', position: 2, name: 'Buying Guides', item: absoluteUrl('/handhelds/guides') },
        { '@type': 'ListItem', position: 3, name: guide.title, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: guide.title,
      numberOfItems: guide.picks.length,
      itemListElement: guide.picks.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(`/handhelds/${p.handheld.slug}`),
        name: p.handheld.name,
      })),
    },
  ];
  if (guide.faq.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: guide.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

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
            <Link href="/handhelds/guides" className="hover:text-gray-300">
              Buying Guides
            </Link>
            <span className="px-2">/</span>
            <span className="text-gray-400">{guide.title}</span>
          </nav>

          <header className="mb-6">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{guide.title}</h1>
            {guide.description ? <p className="mt-3 text-lg text-gray-300">{guide.description}</p> : null}
            <div className="mt-3">
              <Byline lastVerified={guide.updated || DATASET_DATE} />
            </div>
          </header>

          {guide.body ? (
            <div className="space-y-1">
              <ReactMarkdown rehypePlugins={[rehypeSanitize]} components={MD}>
                {guide.body}
              </ReactMarkdown>
            </div>
          ) : null}

          {/* Ranked picks (live) */}
          <ol className="mt-8 space-y-4">
            {guide.picks.map((pick, i) => (
              <PickRow key={pick.slug} rank={i + 1} handheld={pick.handheld} note={pick.note} />
            ))}
          </ol>

          {guide.faq.length ? (
            <section className="mt-12">
              <h2 className="mb-4 text-xl font-bold text-white">FAQ</h2>
              <div className="space-y-4">
                {guide.faq.map((f) => (
                  <div key={f.q}>
                    <h3 className="font-semibold text-gray-100">{f.q}</h3>
                    <p className="mt-1 text-sm text-gray-400">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <Footer />
      {graph.map((node, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }} />
      ))}
    </>
  );
}

function cheapestConfig(h: Handheld): Configuration | undefined {
  return [...h.configurations].sort((a, b) => (a.priceUsd ?? Infinity) - (b.priceUsd ?? Infinity))[0];
}

// Live at-a-glance specs for a pick — pulled from the dataset, never stale.
function specHighlights(h: Handheld): string[] {
  const chips: string[] = [];
  chips.push(osLabel(h.os));
  if (h.displaySizeInches) {
    chips.push(`${h.displaySizeInches}"${h.display ? ` ${panelLabel(h.display.panelType)}` : ''}`);
  }
  if (h.ergonomics?.weightGrams) chips.push(`${h.ergonomics.weightGrams} g`);
  if (h.battery?.capacityWh) chips.push(`${h.battery.capacityWh} Wh`);
  return chips;
}

function PickRow({ rank, handheld, note }: { rank: number; handheld: Handheld; note: string }) {
  const img = getHandheldImage(handheld.slug);
  const link = amazonLinkForConfig(cheapestConfig(handheld));
  return (
    <li className="flex gap-4 rounded-xl border border-gray-800 bg-gray-900/40 p-4">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-gray-950">
        {rank}
      </div>
      {img ? (
        <div className="relative hidden h-20 w-28 shrink-0 self-center sm:block">
          <Image src={img.url} alt={img.alt} fill sizes="112px" className="object-contain" />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <Link
          href={`/handhelds/${handheld.slug}`}
          className="font-semibold text-gray-100 hover:text-white"
        >
          {handheld.name}
        </Link>
        <p className="text-sm font-semibold text-amber-400">{startingPriceLabel(handheld)}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {specHighlights(handheld).map((s, i) => (
            <span
              key={i}
              className="rounded bg-gray-800 px-1.5 py-0.5 text-[11px] font-medium text-gray-300"
            >
              {s}
            </span>
          ))}
        </div>
        {note ? <p className="mt-2 text-sm text-gray-400">{note}</p> : null}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <Link href={`/handhelds/${handheld.slug}`} className="font-semibold text-gray-300 hover:text-white">
            Full details →
          </Link>
          <a
            href={link.url}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="font-semibold text-amber-400 hover:text-amber-300"
          >
            Check price on Amazon →
          </a>
        </div>
      </div>
    </li>
  );
}
