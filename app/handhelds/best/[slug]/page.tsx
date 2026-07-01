// "Best <X> handhelds" — spec categories + facet-driven collections. Static + ISR.

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { buildPageMetadata, absoluteUrl } from '@/app/lib/seo';
import HandheldCard from '@/app/components/handhelds/HandheldCard';
import {
  getCategory,
  categoryHandhelds,
  listCategories,
  categoryChipLabel,
} from '@/app/lib/handhelds/categories';
import { getHandheldImage } from '@/app/lib/handhelds/images';

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return listCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getCategory(params.slug);
  if (!cat) return { title: 'Not found | FinalBoss.io' };
  const items = categoryHandhelds(cat);
  return buildPageMetadata({
    title: `${cat.title} | FinalBoss.io`,
    description: cat.description,
    path: `/handhelds/best/${cat.slug}`,
    image: items.length ? getHandheldImage(items[0].slug)?.url : undefined,
  });
}

export default function CategoryPage({ params }: Props) {
  const cat = getCategory(params.slug);
  if (!cat) notFound();
  const items = categoryHandhelds(cat);
  if (!items.length) notFound();

  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Handhelds', item: absoluteUrl('/handhelds') },
        { '@type': 'ListItem', position: 2, name: cat.title, item: absoluteUrl(`/handhelds/best/${cat.slug}`) },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: cat.title,
      numberOfItems: items.length,
      itemListElement: items.map((h, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(`/handhelds/${h.slug}`),
        name: h.name,
      })),
    },
  ];

  const others = listCategories().filter((c) => c.slug !== cat.slug);

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
            <span className="text-gray-400">{cat.group === 'collection' ? 'Best for' : 'Best'}</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{cat.title}</h1>
            <p className="mt-2 max-w-2xl text-gray-300">{cat.description}</p>
            {cat.intro ? <p className="mt-2 max-w-2xl text-sm text-gray-400">{cat.intro}</p> : null}
            <p className="mt-2 text-sm text-gray-500">
              {items.length} models · {cat.sort ? 'ranked' : 'sorted by starting price'}
            </p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((h) => (
              <HandheldCard key={h.slug} handheld={h} />
            ))}
          </div>

          {others.length ? (
            <section className="mt-14 border-t border-gray-800 pt-8">
              <h2 className="mb-4 text-lg font-bold text-white">Browse other categories</h2>
              <div className="flex flex-wrap gap-2">
                {others.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/handhelds/best/${c.slug}`}
                    className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-300 hover:border-gray-600 hover:text-white"
                  >
                    {categoryChipLabel(c.title)} <span className="text-gray-500">({c.count})</span>
                  </Link>
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
