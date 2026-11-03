import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Check, Diamond, Download, Maximize, QrCode, Smartphone } from 'lucide-react';
import BuildCard from '@/app/components/totk-builds/BuildCard';
import { TOTK_BUILDS, getTotkBuild, relatedTotkBuilds } from '@/app/lib/totk-builds/catalogue';
import { TOTK_BUILDS_PATH, TOTK_GAME_SLUG, buildPath, categoryLabel } from '@/app/lib/totk-builds/types';
import { absoluteUrl } from '@/app/lib/seo';
import { buildQuestions, buildSeo } from '@/app/lib/totk-builds/seo';
import { cataloguePath } from '@/app/lib/totk-builds/collections';
import { SectionHeading, Panel } from '@/app/components/game-hub/ui';
import { breadcrumbJsonLd, graph } from '@/app/lib/jsonld';

export const revalidate = 86400;
export const dynamicParams = false;
type Props = { params: { slug: string; build: string } };

export function generateStaticParams() {
  return TOTK_BUILDS.map((build) => ({ slug: TOTK_GAME_SLUG, build: build.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const build = params.slug === TOTK_GAME_SLUG ? getTotkBuild(params.build) : undefined;
  if (!build) return { title: 'Build not found' };
  return buildSeo(build);
}

export default function TotkBuildPage({ params }: Props) {
  const build = params.slug === TOTK_GAME_SLUG ? getTotkBuild(params.build) : undefined;
  if (!build) notFound();
  const related = relatedTotkBuilds(build);
  const primaryCategory = build.categories[0];
  const questions = buildQuestions(build);
  const crumbs = breadcrumbJsonLd([
    { name: 'Games', path: '/games' },
    { name: 'Tears of the Kingdom', path: `/game/${TOTK_GAME_SLUG}` },
    { name: 'Autobuilds', path: TOTK_BUILDS_PATH },
    { name: categoryLabel(primaryCategory), path: cataloguePath(primaryCategory) },
    { name: build.name, path: buildPath(build) },
  ]);
  const creativeWork = {
    '@context': 'https://schema.org', '@type': 'CreativeWork',
    name: build.name, url: absoluteUrl(buildPath(build)),
    description: build.description || `Autobuild blueprint and QR code for ${build.name}.`,
    image: { '@type': 'ImageObject', contentUrl: absoluteUrl(build.image), thumbnailUrl: absoluteUrl(build.preview), width: build.imageWidth, height: build.imageHeight, caption: `${build.name} — Zelda TOTK Autobuild QR code` },
    mainEntityOfPage: absoluteUrl(buildPath(build)),
    isPartOf: { '@type': 'CollectionPage', '@id': `${absoluteUrl(cataloguePath(primaryCategory))}#collection` },
    keywords: build.tags,
    about: { '@type': 'VideoGame', name: 'The Legend of Zelda: Tears of the Kingdom', url: absoluteUrl(`/game/${TOTK_GAME_SLUG}`) },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pb-16 pt-28 text-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400">
          <Link prefetch={false} href="/games" className="hover:text-yellow-300">Games</Link><span aria-hidden="true">/</span>
          <Link prefetch={false} href={`/game/${TOTK_GAME_SLUG}`} className="hover:text-yellow-300">Tears of the Kingdom</Link><span aria-hidden="true">/</span>
          <Link prefetch={false} href={TOTK_BUILDS_PATH} className="text-yellow-300 hover:text-white">Autobuilds</Link>
        </nav>
        <Link prefetch={false} href={TOTK_BUILDS_PATH} className="mb-6 inline-flex min-h-10 items-center gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft size={16} aria-hidden="true" />All builds</Link>

        <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <div className="order-2 overflow-hidden rounded-lg border border-gray-700 bg-gray-900 lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <div className="flex items-center justify-between gap-3 border-b border-gray-700 px-4 py-3 text-xs text-gray-400"><span className="inline-flex items-center gap-2"><QrCode size={15} className="text-yellow-400" aria-hidden="true" />Original Autobuild QR</span><a href={build.image} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-1.5 text-yellow-300 hover:text-white"><Maximize size={13} aria-hidden="true" />Full size<span className="sr-only"> (opens a new tab)</span></a></div>
            <Image src={build.image} alt={`${build.name} — original Zelda Notes Autobuild QR code`} width={build.imageWidth} height={build.imageHeight} priority unoptimized className="mx-auto h-auto max-h-[1000px] w-full object-contain" />
          </div>

          <div className="order-1 lg:col-start-2 lg:row-start-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">Zelda TOTK / Autobuild QR Code</p>
            <h1 className="mt-3 break-words text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">{build.name}</h1>
            <p className="mt-2 text-xs text-gray-500">Blueprint #{build.id}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {build.categories.map((category) => <a key={category} href={cataloguePath(category)} className="rounded-full border border-gray-700 px-3 py-1.5 text-xs text-gray-300 hover:border-yellow-400 hover:text-yellow-300">{categoryLabel(category)}</a>)}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-gray-700 bg-gray-800 p-4"><span className="block text-xs text-gray-400">Build cost</span><p className="mt-2 flex items-center gap-2 text-xl font-semibold text-white"><Diamond size={19} className="shrink-0 text-yellow-400" aria-hidden="true" />{build.zonaite === null ? 'Not listed' : `${build.zonaite} Zonaite`}</p></div>
              <div className="rounded-lg border border-gray-700 bg-gray-800 p-4"><span className="block text-xs text-gray-400">Platform</span><p className="mt-2 text-xl font-semibold text-white">Switch 2</p></div>
            </div>
            {build.tested && <p className="mt-4 flex items-center gap-2 text-sm text-yellow-300"><Check size={17} aria-hidden="true" />Community tested{build.testCount > 0 ? ` · ${build.testCount} player ${build.testCount === 1 ? 'report' : 'reports'}` : ''}</p>}
            {build.description && <div className="mt-6 border-t border-gray-700 pt-5"><h2 className="mb-3 text-sm font-semibold text-white">About this build</h2><p className="whitespace-pre-line break-words text-sm leading-relaxed text-gray-300 [overflow-wrap:anywhere]">{build.description}</p></div>}
            <a href={build.image} download={`${build.slug}-qr.${build.image.split('.').pop()}`} className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-lg bg-yellow-400 px-5 py-4 font-semibold text-gray-900 transition-colors hover:bg-yellow-300"><Download size={20} aria-hidden="true" />Download QR code</a>
            <p className="mt-2 text-center text-xs text-gray-500">Original image · {build.imageWidth} × {build.imageHeight} px</p>
          </div>
          <div className="order-3 lg:col-start-2 lg:row-start-2">
            <div className="rounded-lg border border-gray-700 bg-gray-800 p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-white"><Smartphone size={17} className="text-yellow-400" aria-hidden="true" />Bring it into your game</h2>
              <ol className="mt-4 list-decimal space-y-3 pl-4 text-sm leading-relaxed text-gray-400">
                <li>Enable Zelda Notes in the game settings. Open Zelda Notes in the Nintendo Switch App, then choose <span className="text-gray-200">Autobuild Sharing</span>.</li>
                <li>Scan this QR from another screen, or select the downloaded image from your phone.</li>
                <li>Choose <span className="text-gray-200">Send to Game</span>, then open Autobuild in TOTK and select the blueprint.</li>
              </ol>
              <p className="mt-4 border-t border-gray-700 pt-3 text-xs leading-relaxed text-gray-400">Requires Tears of the Kingdom — Nintendo Switch 2 Edition. No Nintendo Switch Online membership required.{build.zonaite === null ? '' : ' Using nearby parts can lower the Zonaite cost.'}</p>
            </div>
            {build.tags.length > 0 && <div className="mt-6 flex flex-wrap gap-2" aria-label="Build tags">{build.tags.map((tag) => <Link prefetch={false} key={tag} href={`${TOTK_BUILDS_PATH}?tag=${encodeURIComponent(tag)}`} className="max-w-full break-words rounded-md bg-white/5 px-2.5 py-1.5 text-xs text-gray-400 hover:bg-yellow-400/10 hover:text-yellow-300">#{tag}</Link>)}</div>}
          </div>
        </div>

        <section className="mt-12">
          <SectionHeading>Build &amp; QR FAQ</SectionHeading>
          <Panel><div className="space-y-6">{questions.map((item) => <div key={item.question}><h3 className="break-words font-semibold text-white">{item.question}</h3><p className="mt-2 text-sm leading-relaxed text-gray-300">{item.answer}</p></div>)}</div></Panel>
        </section>

        <section className="mt-16 border-t border-gray-700 pt-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><h2 className="text-2xl font-bold text-white">Keep building.</h2><Link prefetch={false} href={TOTK_BUILDS_PATH} className="inline-flex min-h-10 items-center gap-2 text-sm text-yellow-300 hover:text-white">Explore all builds<ArrowUpRight size={17} aria-hidden="true" /></Link></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{related.map((candidate) => <BuildCard key={candidate.id} build={candidate} />)}</div>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph([crumbs, creativeWork])).replace(/</g, '\\u003c') }} />
    </main>
  );
}
