// Game Intelligence page — powered by the GPBot Knowledge API.
//
// NOTE: this is a SEPARATE surface from the IGDB-driven /game/[slug] pages.
// Do not merge the two. This route renders the "living entity" intelligence
// (coverage, sentiment, topics, timeline, latest coverage) for a game.

import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { buildPageMetadata, absoluteUrl } from '@/app/lib/seo';
import { getGamePage, igdbImage } from '@/app/lib/knowledge/client';
import type { GamePagePayload, KnowledgeEntity } from '@/app/lib/knowledge/types';

import GameHero from '@/app/components/intelligence/GameHero';
import IntelligenceSnapshot from '@/app/components/intelligence/IntelligenceSnapshot';
import CoverageTrend from '@/app/components/intelligence/CoverageTrend';
import TopicsPanel from '@/app/components/intelligence/TopicsPanel';
import GameTimeline from '@/app/components/intelligence/GameTimeline';
import LatestNews from '@/app/components/intelligence/LatestNews';

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getGamePage(params.slug);
  if (!page) return { title: 'Game not found | FinalBoss.io' };
  const e = page.entity;
  const indexable = page.seo.indexabilityStatus === 'public_index';
  const description = (page.seo.description || e.description || `Live coverage, sentiment and the latest news for ${e.canonicalName}.`).slice(0, 200);
  const image = e.imageUrl || igdbImage(e.attributes?.cover_image_id) || undefined;
  return buildPageMetadata({
    title: `${e.canonicalName} — Coverage & Intelligence`,
    description,
    path: `/games/${page.seo.canonicalSlug || params.slug}`,
    image,
    type: 'website',
    robots: indexable ? undefined : { index: false, follow: true },
  });
}

export default async function GameIntelligencePage({ params }: Props) {
  const page = await getGamePage(params.slug);
  if (!page) notFound();

  const canonical = page.seo.canonicalSlug;
  if (canonical && canonical !== params.slug) {
    permanentRedirect(`/games/${canonical}`);
  }

  const { entity, coverage, latestTopicSnapshot, timeline, content } = page;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 text-gray-100">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <nav className="mb-6 text-sm text-gray-500">
            <a href="/games" className="hover:text-gray-300">Games</a>
            <span className="px-2">/</span>
            <span className="text-gray-400">{entity.canonicalName}</span>
          </nav>

          <div className="space-y-6">
            <GameHero entity={entity} />
            <IntelligenceSnapshot coverage={coverage} topic={latestTopicSnapshot} lastBuiltAt={entity.lastBuiltAt} />
            <CoverageTrend coverage={coverage} />
            <TopicsPanel topic={latestTopicSnapshot} />
            <GameTimeline events={timeline} />
            <LatestNews content={content} />
          </div>
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(entity, page)) }} />
    </>
  );
}

function buildJsonLd(entity: KnowledgeEntity, page: GamePagePayload) {
  const a = entity.attributes || {};
  const image = entity.imageUrl || igdbImage(a.cover_image_id) || undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: entity.canonicalName,
    url: absoluteUrl(`/games/${page.seo.canonicalSlug || entity.slug}`),
    ...(entity.description ? { description: entity.description } : {}),
    ...(image ? { image } : {}),
    ...(a.developer ? { author: { '@type': 'Organization', name: a.developer } } : {}),
    ...(a.publisher ? { publisher: { '@type': 'Organization', name: a.publisher } } : {}),
    ...(a.genres?.length ? { genre: a.genres } : {}),
    ...(a.platforms?.length ? { gamePlatform: a.platforms } : {}),
    ...(a.release_date ? { datePublished: a.release_date } : {}),
  };
}
