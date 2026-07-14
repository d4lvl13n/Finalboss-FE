// Game hub — provider-backed. Two layouts behind ONE contract:
//   • local blueprint games (e.g. Crystal of Atlan) → structured gameplay hub
//   • api games (GPBot Knowledge API, e.g. GTA VI)   → living-intelligence view
// The api branch is unchanged from the original intelligence page, so existing
// api-backed pages render identically. Which layout is chosen depends only on
// whether the provider returned a `gameplay` payload (local) vs `intelligence`.

import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { buildPageMetadata } from '@/app/lib/seo';
import { igdbImage } from '@/app/lib/knowledge/client';
import { getGameHub, localGameSlugs } from '@/app/lib/game-hub/provider';
import type { GameHub } from '@/app/lib/game-hub/types';
import { videoGameJsonLd, itemListJsonLd, breadcrumbJsonLd, graph } from '@/app/lib/jsonld';

// intelligence (api) layout — existing components
import GameHero from '@/app/components/intelligence/GameHero';
import IntelligenceSnapshot from '@/app/components/intelligence/IntelligenceSnapshot';
import CoverageTrend from '@/app/components/intelligence/CoverageTrend';
import TopicsPanel from '@/app/components/intelligence/TopicsPanel';
import GameTimeline from '@/app/components/intelligence/GameTimeline';
import LatestNews from '@/app/components/intelligence/LatestNews';

// gameplay (local blueprint) layout — game-hub components
import ClassRoster from '@/app/components/game-hub/ClassRoster';
import TierListView from '@/app/components/game-hub/TierListView';
import CodesTracker from '@/app/components/game-hub/CodesTracker';
import DungeonsGrid from '@/app/components/game-hub/DungeonsGrid';
import SystemsGrid from '@/app/components/game-hub/SystemsGrid';
import HubTimeline from '@/app/components/game-hub/HubTimeline';
import ReadNext from '@/app/components/game-hub/ReadNext';

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

// Pre-render local blueprint games; api games render on-demand (ISR).
export function generateStaticParams() {
  return localGameSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hub = await getGameHub(params.slug);
  if (!hub) return { title: 'Game not found | FinalBoss.io' };
  const e = hub.entity;
  const indexable = hub.seo.indexabilityStatus === 'public_index';
  const description = (
    hub.seo.description ||
    e.description ||
    `Live coverage, sentiment and the latest for ${e.canonicalName}.`
  ).slice(0, 200);
  const image = e.imageUrl || igdbImage(e.attributes?.cover_image_id) || undefined;
  return buildPageMetadata({
    title: hub.seo.title || `${e.canonicalName} — Coverage & Intelligence`,
    description,
    path: `/games/${hub.seo.canonicalSlug || params.slug}`,
    image,
    type: 'website',
    robots: indexable ? undefined : { index: false, follow: true },
  });
}

export default async function GameHubPage({ params }: Props) {
  const hub = await getGameHub(params.slug);
  if (!hub) notFound();

  const canonical = hub.seo.canonicalSlug;
  if (canonical && canonical !== params.slug) {
    permanentRedirect(`/games/${canonical}`);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 text-gray-100">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <nav className="mb-6 text-sm text-gray-500">
            <a href="/games" className="hover:text-gray-300">Games</a>
            <span className="px-2">/</span>
            <span className="text-gray-400">{hub.entity.canonicalName}</span>
          </nav>

          {hub.gameplay ? <GameplayHub hub={hub} slug={params.slug} /> : <IntelligenceHub hub={hub} />}
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(hub, params.slug)) }} />
    </>
  );
}

function GameplayHub({ hub, slug }: { hub: GameHub; slug: string }) {
  const gp = hub.gameplay!;
  const tierArticle = gp.articles.find((a) => a.kind === 'tier_list')?.url;
  return (
    <div className="space-y-8">
      <GameHero entity={hub.entity} />
      {gp.classes.length > 0 && <ClassRoster gameSlug={slug} classes={gp.classes} />}
      {gp.classes.length > 0 && <TierListView gameSlug={slug} classes={gp.classes} articleUrl={tierArticle} />}
      <CodesTracker lastVerified={gp.codes.lastVerified} active={gp.codes.active} expired={gp.codes.expired} />
      {gp.dungeons.length > 0 && <DungeonsGrid gameSlug={slug} dungeons={gp.dungeons} />}
      {gp.systems.length > 0 && <SystemsGrid gameSlug={slug} systems={gp.systems} />}
      <HubTimeline events={gp.timeline} />
      <ReadNext articles={gp.articles} />
    </div>
  );
}

function IntelligenceHub({ hub }: { hub: GameHub }) {
  const intel = hub.intelligence;
  if (!intel) return null;
  return (
    <div className="space-y-6">
      <GameHero entity={hub.entity} />
      <IntelligenceSnapshot coverage={intel.coverage} topic={intel.latestTopicSnapshot} lastBuiltAt={hub.entity.lastBuiltAt} />
      <CoverageTrend coverage={intel.coverage} />
      <TopicsPanel topic={intel.latestTopicSnapshot} />
      <GameTimeline events={intel.timeline} />
      <LatestNews content={intel.content} />
    </div>
  );
}

function buildJsonLd(hub: GameHub, slug: string) {
  const e = hub.entity;
  const a = e.attributes || {};
  const path = `/games/${hub.seo.canonicalSlug || slug}`;
  const image = e.imageUrl || igdbImage(a.cover_image_id) || undefined;
  const game = videoGameJsonLd({
    name: e.canonicalName,
    path,
    description: e.description,
    image,
    developer: a.developer,
    publisher: a.publisher,
    genres: a.genres,
    platforms: a.platforms,
    datePublished: a.release_date,
  });

  if (!hub.gameplay) return game;

  const crumbs = breadcrumbJsonLd([
    { name: 'Games', path: '/games' },
    { name: e.canonicalName, path },
  ]);
  const nodes = [game, crumbs];
  if (hub.gameplay.classes.length > 0) {
    nodes.push(
      itemListJsonLd({
        name: `${e.canonicalName} Classes`,
        items: hub.gameplay.classes.map((c) => ({ name: c.canonicalName, path: `${path}/class/${c.slug}` })),
      }),
    );
  }
  return graph(nodes);
}
