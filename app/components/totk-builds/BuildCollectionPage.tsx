import Link from 'next/link';
import { notFound } from 'next/navigation';
import { QrCode, Smartphone } from 'lucide-react';
import BuildExplorer from './BuildExplorer';
import { Panel, SectionHeading } from '@/app/components/game-hub/ui';
import { TOTK_BUILDS } from '@/app/lib/totk-builds/catalogue';
import { TOTK_GAME_SLUG, type BuildCategory } from '@/app/lib/totk-builds/types';
import { cataloguePath, collectionBuilds, collectionFor, collectionPageCount } from '@/app/lib/totk-builds/collections';
import { collectionJsonLd } from '@/app/lib/totk-builds/seo';
import { breadcrumbJsonLd, graph } from '@/app/lib/jsonld';
import { RECIPES_PATH, simulatorPath } from '@/app/lib/totk-recipes/types';

export default function BuildCollectionPage({ category = 'all', page = 1 }: { category?: BuildCategory; page?: number }) {
  const collection = collectionFor(category);
  const count = collectionBuilds(TOTK_BUILDS, category).length;
  if (!collection || page < 1 || page > collectionPageCount(TOTK_BUILDS, category)) notFound();
  const crumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Games', path: '/games' },
    { name: 'Tears of the Kingdom', path: `/game/${TOTK_GAME_SLUG}` },
    { name: 'Autobuilds', path: cataloguePath() },
    ...(category === 'all' ? [] : [{ name: collection.shortTitle, path: cataloguePath(category) }]),
    ...(page === 1 ? [] : [{ name: `Page ${page}`, path: cataloguePath(category, page) }]),
  ]);
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pb-16 pt-28 text-white">
      <div className="container mx-auto px-4">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-400">
          <Link prefetch={false} href="/games" className="hover:text-yellow-400">Games</Link><span aria-hidden="true">/</span>
          <Link prefetch={false} href={`/game/${TOTK_GAME_SLUG}`} className="hover:text-yellow-400">Tears of the Kingdom</Link><span aria-hidden="true">/</span>
          {category === 'all' ? <span aria-current="page" className="text-gray-200">Autobuilds</span> : <><a href={cataloguePath()} className="hover:text-yellow-400">Autobuilds</a><span aria-hidden="true">/</span><span aria-current="page" className="text-gray-200">{collection.shortTitle}</span></>}
        </nav>
        <nav aria-label="Tears of the Kingdom tools" className="mb-7 flex flex-wrap gap-1 border-b border-gray-700 text-sm"><span aria-current="page" className="border-b-2 border-yellow-400 px-4 py-3 font-semibold text-yellow-400">Autobuilds</span><a href={RECIPES_PATH} className="px-4 py-3 text-gray-400 hover:text-yellow-400">Recipes</a><a href={simulatorPath()} className="px-4 py-3 text-gray-400 hover:text-yellow-400">Cooking simulator</a></nav>
        <header className="mb-10">
          <div className="mb-5 flex items-center gap-4">
            <h1 className="text-4xl font-bold text-yellow-400 md:text-5xl">{collection.title}</h1>
            <div aria-hidden="true" className="hidden h-1 flex-grow rounded-full bg-gradient-to-r from-yellow-400 to-transparent lg:block" />
          </div>
          <p className="max-w-3xl text-base leading-relaxed text-gray-300 sm:text-lg">{collection.intro}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-200">
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-700 px-4 py-2"><QrCode size={16} className="text-yellow-400" aria-hidden="true" />{count} build QR codes</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-700 px-4 py-2"><Smartphone size={16} className="text-yellow-400" aria-hidden="true" />Zelda Notes · Switch 2 Edition</span>
            <a href="#how-to-use" className="inline-flex items-center px-2 py-2 text-yellow-400 hover:text-yellow-300">How to use QR codes →</a>
          </div>
        </header>
        <BuildExplorer builds={TOTK_BUILDS} initialCategory={category} initialPage={page} />
        <section id="how-to-use" className="mt-12 scroll-mt-24">
          <SectionHeading>How to Use QR Codes</SectionHeading>
          <Panel>
            <p className="mb-6 max-w-3xl text-sm leading-relaxed text-gray-300">You need Tears of the Kingdom — Nintendo Switch 2 Edition and Zelda Notes in the Nintendo Switch App. A Nintendo Switch Online membership is not required.</p>
            <ol className="grid gap-6 md:grid-cols-3">
              {[
                ['Choose a build', 'Open a blueprint and save its original QR image to your phone, or keep it open on another screen.'],
                ['Scan in Zelda Notes', 'Enable Zelda Notes in the game settings. In the Nintendo Switch App, open Zelda Notes → Autobuild Sharing, then scan or select the saved QR image.'],
                ['Send it to your game', 'Choose Send to Game, then open Autobuild in TOTK to recreate the design. Nearby parts can reduce the Zonaite cost.'],
              ].map(([title, description], index) => (
                <li key={title}><h3 className="mb-2 font-semibold text-yellow-400">{index + 1}. {title}</h3><p className="text-sm leading-relaxed text-gray-300">{description}</p></li>
              ))}
            </ol>
          </Panel>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph([crumbs, collectionJsonLd(TOTK_BUILDS, category, page)])).replace(/</g, '\\u003c') }} />
    </main>
  );
}
