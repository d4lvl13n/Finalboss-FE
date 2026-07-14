// Gameplay entity detail (class / dungeon / system) for local blueprint games.
// Blueprint-driven: the [type] segment is the entity type; only a blueprint's
// `detailTypes` are generated. dynamicParams=false — api games (no local
// sub-entities) 404 here rather than attempting a render.

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { buildPageMetadata } from '@/app/lib/seo';
import { getLocalEntity, localEntityParams } from '@/app/lib/game-hub/provider';
import { breadcrumbJsonLd, graph } from '@/app/lib/jsonld';

import ClassDetail from '@/app/components/game-hub/ClassDetail';
import EntityDetailGeneric from '@/app/components/game-hub/EntityDetailGeneric';

export const revalidate = 3600;
export const dynamicParams = false;

interface Props {
  params: { slug: string; type: string; entity: string };
}

export function generateStaticParams() {
  return localEntityParams();
}

const TYPE_LABEL: Record<string, string> = {
  class: 'Class',
  dungeon: 'Dungeon',
  system: 'System',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const detail = getLocalEntity(params.slug, params.type, params.entity);
  if (!detail) return { title: 'Not found | FinalBoss.io' };
  const label = TYPE_LABEL[params.type] || 'Guide';
  const name = detail.entity.canonicalName;
  const game = detail.game.canonicalName;
  return buildPageMetadata({
    title: `${name} ${label} — ${game} | FinalBoss.io`,
    description: `${name} in ${game}: role, playstyle, tier rating, skills and synergies.`.slice(0, 200),
    path: `/games/${params.slug}/${params.type}/${params.entity}`,
    type: 'website',
  });
}

export default function EntityDetailPage({ params }: Props) {
  const detail = getLocalEntity(params.slug, params.type, params.entity);
  if (!detail) notFound();

  const gamePath = `/games/${params.slug}`;
  const crumbs = breadcrumbJsonLd([
    { name: 'Games', path: '/games' },
    { name: detail.game.canonicalName, path: gamePath },
    { name: detail.entity.canonicalName, path: `${gamePath}/${params.type}/${params.entity}` },
  ]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <nav className="mb-6 text-sm text-gray-400">
            <a href="/games" className="hover:text-yellow-400">Games</a>
            <span className="px-2">/</span>
            <a href={gamePath} className="hover:text-yellow-400">{detail.game.canonicalName}</a>
            <span className="px-2">/</span>
            <span className="text-gray-300">{detail.entity.canonicalName}</span>
          </nav>

          {params.type === 'class' ? <ClassDetail detail={detail} /> : <EntityDetailGeneric detail={detail} />}
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph([crumbs])) }} />
    </>
  );
}
