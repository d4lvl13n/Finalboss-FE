// Glossary term page — definition, why it matters when buying, related terms,
// and (where relevant) the live list of laptops that have the feature.

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { buildPageMetadata, absoluteUrl } from '@/app/lib/seo';
import LaptopCard from '@/app/components/laptops/LaptopCard';
import { GLOSSARY, getTerm } from '@/app/lib/laptops/glossary';
import { getCategory, categoryFamilies, categoryChipLabel } from '@/app/lib/laptops/categories';

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return GLOSSARY.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const term = getTerm(params.slug);
  if (!term) return { title: 'Not found | FinalBoss.io' };
  return buildPageMetadata({
    title: `${term.term} — What It Is & Why It Matters | FinalBoss.io`,
    description: term.short,
    path: `/gaming-laptops/glossary/${term.slug}`,
  });
}

export default function GlossaryTermPage({ params }: Props) {
  const term = getTerm(params.slug);
  if (!term) notFound();

  const relatedTerms = term.related.map(getTerm).filter((t): t is NonNullable<typeof t> => Boolean(t));
  const category = term.relatedCategorySlug ? getCategory(term.relatedCategorySlug) : null;
  const families = category ? categoryFamilies(category).slice(0, 8) : [];

  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: term.term,
      description: term.short,
      url: absoluteUrl(`/gaming-laptops/glossary/${term.slug}`),
      inDefinedTermSet: absoluteUrl('/gaming-laptops/glossary'),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Gaming Laptops', item: absoluteUrl('/gaming-laptops') },
        { '@type': 'ListItem', position: 2, name: 'Glossary', item: absoluteUrl('/gaming-laptops/glossary') },
        { '@type': 'ListItem', position: 3, name: term.term, item: absoluteUrl(`/gaming-laptops/glossary/${term.slug}`) },
      ],
    },
  ];

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
            <Link href="/gaming-laptops/glossary" className="hover:text-gray-300">
              Glossary
            </Link>
            <span className="px-2">/</span>
            <span className="text-gray-400">{term.term}</span>
          </nav>

          <article>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{term.term}</h1>
            <p className="mt-4 text-lg leading-relaxed text-gray-300">{term.short}</p>

            <div className="mt-6 space-y-4">
              {term.body.map((para, i) => (
                <p key={i} className="leading-relaxed text-gray-400">
                  {para}
                </p>
              ))}
            </div>

            <section className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-400">
                Why it matters when buying
              </h2>
              <p className="mt-2 leading-relaxed text-gray-300">{term.buying}</p>
            </section>

            {category && families.length ? (
              <section className="mt-12">
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <h2 className="text-xl font-bold text-white">Laptops with {term.term}</h2>
                  <Link
                    href={`/gaming-laptops/best/${category.slug}`}
                    className="text-sm font-semibold text-amber-400 hover:text-amber-300"
                  >
                    See all {categoryChipLabel(category.title)} →
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {families.map((f) => (
                    <LaptopCard key={f.slug} family={f} />
                  ))}
                </div>
              </section>
            ) : null}

            {relatedTerms.length ? (
              <section className="mt-12 border-t border-gray-800 pt-8">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Related terms
                </h2>
                <div className="flex flex-wrap gap-2">
                  {relatedTerms.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/gaming-laptops/glossary/${t.slug}`}
                      className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-300 hover:border-gray-600 hover:text-white"
                    >
                      {t.term}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </article>
        </div>
      </main>
      <Footer />
      {graph.map((node, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }} />
      ))}
    </>
  );
}
