// The structured gameplay hub body, rendered inside /game/[slug] for local
// blueprint games (e.g. Crystal of Atlan). Same visual language as GameDetails
// (gradient bg, cover hero, yellow accents, bg-gray-800 cards) so it reads as a
// native FinalBoss game page. Server component; the page fetches `readNext`.

import Image from 'next/image';

import { igdbImage } from '@/app/lib/knowledge/client';
import type { GameHub } from '@/app/lib/game-hub/types';
import type { HubArticle } from '@/app/lib/game-hub/related-articles';
import { videoGameJsonLd, itemListJsonLd, breadcrumbJsonLd, graph } from '@/app/lib/jsonld';

import TrackViewContent from '@/app/components/TrackViewContent';
import ArticleGridMore from '@/app/components/game-hub/ArticleGridMore';
import { SectionHeading, Panel, Pill, FieldLabel } from '@/app/components/game-hub/ui';

import ClassRoster from '@/app/components/game-hub/ClassRoster';
import TierListView from '@/app/components/game-hub/TierListView';
import CodesTracker from '@/app/components/game-hub/CodesTracker';
import DungeonsGrid from '@/app/components/game-hub/DungeonsGrid';
import SystemsGrid from '@/app/components/game-hub/SystemsGrid';
import HubTimeline from '@/app/components/game-hub/HubTimeline';
import HubNav from '@/app/components/game-hub/HubNav';

export default function GameplayHub({
  hub,
  slug,
  readNext,
}: {
  hub: GameHub;
  slug: string;
  readNext: HubArticle[];
}) {
  const gp = hub.gameplay!;
  const e = hub.entity;
  const a = e.attributes || {};
  const cover = e.imageUrl || igdbImage(a.cover_image_id) || null;
  const description = e.description || null;
  const ratingRaw = (a as Record<string, unknown>).igdb_rating;
  const rating = typeof ratingRaw === 'number' ? Math.round(ratingRaw) : null;
  const platforms = (a.platforms as string[] | undefined) || [];
  const genres = (a.genres as string[] | undefined) || [];
  const screenshots = (((a as Record<string, unknown>).screenshots as string[] | undefined) || [])
    .map((id) => igdbImage(id, 't_screenshot_big'))
    .filter((u): u is string => Boolean(u));
  const companies: string[] = [];
  const tierArticle = gp.articles.find((art) => art.kind === 'tier_list')?.url;

  const navItems = [
    gp.classes.length > 0 && { label: 'Tier List', href: '#tier-list' },
    gp.classes.length > 0 && { label: 'Classes', href: '#classes' },
    { label: 'Codes', href: '#codes' },
    gp.dungeons.length > 0 && { label: 'Dungeons', href: '#dungeons' },
    gp.systems.length > 0 && { label: 'Systems', href: '#systems' },
    gp.timeline.length > 0 && { label: 'Updates', href: '#updates' },
    screenshots.length > 0 && { label: 'Screenshots', href: '#screenshots' },
    readNext.length > 0 && { label: 'Articles', href: '#read-next' },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <TrackViewContent name={e.canonicalName} category="Games" type="game" />

      {/* Hero */}
      <div className="relative h-[56vh] min-h-[360px] w-full">
        {cover ? (
          <>
            <div className="absolute inset-0 overflow-hidden">
              <Image src={cover} alt="" fill className="object-cover blur-xl opacity-30" priority unoptimized />
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 to-gray-900" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-[360px] w-[270px] overflow-hidden rounded-lg shadow-2xl">
                <Image src={cover} alt={e.canonicalName} fill className="object-cover" priority unoptimized />
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900" />
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <nav className="mb-4 text-sm text-gray-400">
          <a href="/games" className="hover:text-yellow-400">Games</a>
          <span className="px-2">/</span>
          <span className="text-gray-300">{e.canonicalName}</span>
        </nav>

        <header className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-bold text-white md:text-6xl">{e.canonicalName}</h1>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {rating != null && (
              <span className="rounded-full bg-yellow-400 px-4 py-2 font-bold text-gray-900">{rating}/100</span>
            )}
            {platforms.map((p) => (
              <span key={p} className="rounded-full bg-gray-700 px-4 py-2 text-gray-200">{p}</span>
            ))}
          </div>
        </header>

        {description && (
          <Panel className="mb-8">
            <p className="leading-relaxed text-gray-300">{description}</p>
          </Panel>
        )}

        <HubNav items={navItems} />

        <div className="space-y-12">
          {gp.classes.length > 0 && (
            <div id="tier-list" className="scroll-mt-28">
              <TierListView
                gameSlug={slug}
                classes={gp.classes}
                articleUrl={tierArticle}
                intro="Where each advanced class currently sits in PvE and PvP. Flip between the two — these ratings track the live meta and shift with balance patches, so treat them as a starting point, not gospel."
              />
            </div>
          )}
          {gp.classes.length > 0 && (
            <div id="classes" className="scroll-mt-28">
              <ClassRoster
                gameSlug={slug}
                classes={gp.classes}
                intro="You start on one of eight base classes, each branching into advanced specialisations at around level 15 — and that choice is permanent. Open any class for its role, weapon, playstyle and synergies."
              />
            </div>
          )}
          <div id="codes" className="scroll-mt-28">
            <CodesTracker
              lastVerified={gp.codes.lastVerified}
              active={gp.codes.active}
              expired={gp.codes.expired}
              intro="Redeem these in-game for free rewards like Hunting Permits and Bound Gold. Codes are region-specific and expire over time, so check the verified date below."
            />
          </div>
          {gp.dungeons.length > 0 && (
            <div id="dungeons" className="scroll-mt-28">
              <DungeonsGrid
                gameSlug={slug}
                dungeons={gp.dungeons}
                intro="The group PvE that anchors the endgame — dungeons, raids and open-world bosses."
              />
            </div>
          )}
          {gp.systems.length > 0 && (
            <div id="systems" className="scroll-mt-28">
              <SystemsGrid
                gameSlug={slug}
                systems={gp.systems}
                intro="The progression and live-service systems that shape a run, from the permanent advanced-class pick to housing and monetisation."
              />
            </div>
          )}
          {gp.timeline.length > 0 && (
            <div id="updates" className="scroll-mt-28">
              <HubTimeline events={gp.timeline} intro="Recent patches, new classes and collaborations — newest first." />
            </div>
          )}

          {(genres.length > 0 || platforms.length > 0 || companies.length > 0) && (
            <section id="facts" className="scroll-mt-28">
              <SectionHeading>Game Facts</SectionHeading>
              <Panel>
                <div className="grid gap-6 md:grid-cols-2">
                  {[
                    { label: 'Genres', items: genres },
                    { label: 'Platforms', items: platforms },
                    { label: 'Studios', items: companies },
                  ]
                    .filter((b) => b.items && b.items.length > 0)
                    .map((b) => (
                      <div key={b.label}>
                        <FieldLabel>{b.label}</FieldLabel>
                        <div className="flex flex-wrap gap-2">
                          {b.items!.map((it) => (
                            <Pill key={`${b.label}-${it}`}>{it}</Pill>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </Panel>
            </section>
          )}

          {screenshots.length > 0 && (
            <section id="screenshots" className="scroll-mt-28">
              <SectionHeading>Screenshots</SectionHeading>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {screenshots.map((src, i) => (
                  <div key={i} className="group relative h-48 overflow-hidden rounded-lg">
                    <Image
                      src={src}
                      alt={`${e.canonicalName} screenshot ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {readNext.length > 0 && (
            <section id="read-next" className="scroll-mt-28">
              <SectionHeading>Read next on FinalBoss</SectionHeading>
              <ArticleGridMore articles={readNext} pageSize={6} />
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

/** JSON-LD for a local blueprint hub at /game/<slug>. */
export function buildGameplayJsonLd(hub: GameHub, slug: string) {
  const e = hub.entity;
  const a = e.attributes || {};
  const path = `/game/${slug}`;
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
  const crumbs = breadcrumbJsonLd([
    { name: 'Games', path: '/games' },
    { name: e.canonicalName, path },
  ]);
  const nodes = [game, crumbs];
  if (hub.gameplay && hub.gameplay.classes.length > 0) {
    nodes.push(
      itemListJsonLd({
        name: `${e.canonicalName} Classes`,
        items: hub.gameplay.classes.map((c) => ({ name: c.canonicalName, path: `${path}/class/${c.slug}` })),
      }),
    );
  }
  return graph(nodes);
}
