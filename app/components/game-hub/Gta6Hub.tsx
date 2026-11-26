import Link from 'next/link';
import Image from 'next/image';

import PostRow from '@/app/components/Section/PostRow';
import Gta6MapHubLink from '@/app/components/gta6-map/Gta6MapHubLink';
import TrackViewContent from '@/app/components/TrackViewContent';
import type { HubArticle } from '@/app/lib/game-hub/related-articles';
import type { GameHub } from '@/app/lib/game-hub/types';
import { igdbImage } from '@/app/lib/knowledge/client';
import { videoGameJsonLd } from '@/app/lib/jsonld';

export const gta6HubCopy = {
  en: {
    title: 'GTA 6 Walkthrough, Guides & News',
    description: 'The complete GTA 6 walkthrough, step-by-step missions, missables, vehicles, activities and the latest news.',
    games: 'Games',
    breadcrumb: 'Breadcrumb',
    onThisPage: 'On this page',
    walkthrough: 'Walkthrough',
    walkthroughTitle: 'Story Mode Walkthrough',
    guides: 'Practical Guides',
    news: 'News',
    newsTitle: 'GTA 6 News',
    walkthroughId: 'walkthrough',
    newsId: 'news',
    mainWalkthrough: 'gta-6-walkthrough',
    chapter: (number: number) => `gta-6-chapter-${number}-walkthrough`,
    more: (count: number) => `View ${count} more ${count === 1 ? 'article' : 'articles'}`,
  },
  fr: {
    title: 'GTA 6 : soluce, guides et actualités',
    description: 'La soluce de GTA 6 en français, avec les missions étape par étape, les objets manquables, les véhicules, les activités et les dernières actualités.',
    games: 'Jeux',
    breadcrumb: 'Fil d’Ariane',
    onThisPage: 'Sur cette page',
    walkthrough: 'Soluce',
    walkthroughTitle: 'Soluce du mode Histoire',
    guides: 'Guides pratiques',
    news: 'Actualités',
    newsTitle: 'Actualités GTA 6',
    walkthroughId: 'soluce',
    newsId: 'actualites',
    mainWalkthrough: 'gta-6-soluce',
    chapter: (number: number) => `gta-6-soluce-chapitre-${number}`,
    more: (count: number) => `Voir ${count === 1 ? 'l’autre article' : `les ${count} autres articles`}`,
  },
} as const;

type Locale = keyof typeof gta6HubCopy;
const guideCategory = 'gaming-guide';

function ArticleSection({ id, title, articles, more }: { id: string; title: string; articles: HubArticle[]; more: (count: number) => string }) {
  if (!articles.length) return null;
  const cards = articles.slice(0, 6);
  const rest = articles.slice(cards.length);
  return (
    <section id={id} className="scroll-mt-24" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="mb-5 text-2xl font-bold text-white md:text-3xl">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((article) => (
          <PostRow key={article.id} post={{ ...article, date: article.date || '', excerpt: article.excerpt || '' }} />
        ))}
      </div>
      {rest.length > 0 && (
        <details className="mt-5 rounded-lg border border-white/15 bg-gray-800 p-4">
          <summary className="cursor-pointer font-semibold text-yellow-400">
            {more(rest.length)}
          </summary>
          <ul className="mt-4 grid gap-x-7 gap-y-3 pl-4 sm:grid-cols-2">
            {rest.map((article) => (
              <li key={article.id} className="list-disc">
                <Link href={`/${article.slug}`} className="hover:text-yellow-400 hover:underline">
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

export default function Gta6Hub({ hub, articles, locale }: { hub: GameHub; articles: HubArticle[]; locale: Locale }) {
  const copy = gta6HubCopy[locale];
  const walkthroughSlugs = [copy.mainWalkthrough, ...[1, 2, 3, 4, 5].map(copy.chapter)];
  const entity = hub.entity;
  const cover = entity.imageUrl || igdbImage(entity.attributes?.cover_image_id);
  const bySlug = new Map(articles.map((article) => [article.slug, article]));
  const walkthrough = walkthroughSlugs.flatMap((slug) => {
    const article = bySlug.get(slug);
    return article ? [article] : [];
  });
  const guides = articles.filter((article) => article.categories?.nodes?.some(({ slug }) => slug === guideCategory));
  const news = articles.filter((article) => !article.categories?.nodes?.some(({ slug }) => slug === guideCategory));
  const otherGuides = guides.filter(({ slug }) => !walkthroughSlugs.includes(slug));
  const schema = videoGameJsonLd({
    name: entity.canonicalName,
    path: '/game/gta-6',
    description: copy.description,
    image: cover || undefined,
  });

  return (
    <main className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <TrackViewContent name={entity.canonicalName} category="Games" type="game" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container mx-auto space-y-10 px-4 py-10">
        <nav aria-label={copy.breadcrumb} className="text-sm text-gray-400">
          <Link href="/games" className="hover:text-yellow-400">{copy.games}</Link>
          <span className="px-2">/</span>
          <span aria-current="page">GTA 6</span>
        </nav>
        <header className="flex items-center gap-6 rounded-xl border border-white/15 bg-gray-800 p-5 md:gap-10 md:p-8">
          {cover && <Image src={cover} alt="" width={144} height={204} priority className="hidden rounded-lg sm:block" />}
          <div>
            <h1 className="mb-4 text-3xl font-bold md:text-5xl">GTA 6</h1>
            <p className="max-w-prose text-gray-200">{copy.description}</p>
            <nav aria-label={copy.onThisPage} className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-yellow-400">
              {walkthrough.length > 0 && <a href={`#${copy.walkthroughId}`} className="hover:underline">{copy.walkthrough}</a>}
              {otherGuides.length > 0 && <a href="#guides" className="hover:underline">{copy.guides}</a>}
              {news.length > 0 && <a href={`#${copy.newsId}`} className="hover:underline">{copy.news}</a>}
            </nav>
            <Gta6MapHubLink locale={locale} />
          </div>
        </header>
        <ArticleSection id={copy.walkthroughId} title={copy.walkthroughTitle} articles={walkthrough} more={copy.more} />
        <ArticleSection id="guides" title={copy.guides} articles={otherGuides} more={copy.more} />
        <ArticleSection id={copy.newsId} title={copy.newsTitle} articles={news} more={copy.more} />
      </div>
    </main>
  );
}
