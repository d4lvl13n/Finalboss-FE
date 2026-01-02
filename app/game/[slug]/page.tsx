import { IGDBClient } from '@/app/lib/igdb-client';
import { GameDetails } from '@/app/components/GameDetails';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ResponsiveArticleGrid from '@/app/components/ResponsiveArticleGrid';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import client from '@/app/lib/apolloClient';
import { CREATE_GAME_TAG_WITH_META, GET_GAME_TAG_BY_SLUG, GET_GAME_TAG_WITH_POSTS } from '@/app/lib/queries/gameQueries';
import { absoluteUrl, buildPageMetadata } from '@/app/lib/seo';
import { IGDBGame } from '@/app/types/igdb';

interface Props {
  params: {
    slug: string;
  };
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io';

export const revalidate = 3600;
const POSTS_PAGE_SIZE = 12;

function slugifyGameTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 200);
}

function stripHtml(value: string | undefined): string {
  if (!value) return '';
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildDescription(value: string | undefined): string {
  const cleaned = stripHtml(value);
  if (!cleaned) return '';
  return cleaned.length > 160 ? `${cleaned.slice(0, 157).trimEnd()}...` : cleaned;
}

function buildVideoGameJsonLd(game: IGDBGame, canonicalUrl: string) {
  const platforms = game.platforms
    ?.map((platform) => (typeof platform === 'string' ? platform : platform.name))
    .filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.name,
    ...(game.description ? { description: buildDescription(game.description) } : {}),
    ...(game.cover_url ? { image: absoluteUrl(game.cover_url) } : {}),
    url: canonicalUrl,
    ...(game.release_date ? { datePublished: game.release_date } : {}),
    ...(platforms?.length ? { gamePlatform: platforms } : {}),
  };
}

function parseIgdbData(raw: unknown): IGDBGame | null {
  if (!raw || typeof raw !== 'string') {
    return null;
  }

  try {
    return JSON.parse(raw) as IGDBGame;
  } catch {
    return null;
  }
}

function buildGameFromTag(tag: {
  name: string;
  description?: string | null;
  igdbData?: string | null;
}): IGDBGame {
  const parsed = parseIgdbData(tag.igdbData);
  if (parsed && parsed.name) {
    return {
      ...parsed,
      name: parsed.name || tag.name,
      description: parsed.description || tag.description || parsed.name,
    };
  }

  return {
    name: tag.name,
    description: tag.description || tag.name,
  };
}

async function getGameTagBySlug(slug: string) {
  try {
    const { data } = await client.query({
      query: GET_GAME_TAG_BY_SLUG,
      variables: { slug },
      fetchPolicy: 'no-cache',
    });
    return data?.gameTag || null;
  } catch (error) {
    console.error('Error fetching game tag:', error);
    return null;
  }
}

async function getGameTagWithPosts(slug: string) {
  try {
    const { data } = await client.query({
      query: GET_GAME_TAG_WITH_POSTS,
      variables: { slug, first: POSTS_PAGE_SIZE, after: null },
      fetchPolicy: 'no-cache',
    });
    return data?.gameTag || null;
  } catch (error) {
    console.error('Error fetching game tag posts:', error);
    return null;
  }
}

async function createGameTagFromIgdb(game: IGDBGame): Promise<string | null> {
  try {
    const slug = slugifyGameTitle(game.name);
    const description = buildDescription(game.description) || game.name;

    const input: Record<string, unknown> = {
      name: game.name,
      slug,
      description,
    };

    if (game.id != null) {
      input.igdbId = String(game.id);
    }
    input.igdbData = JSON.stringify({ ...game, igdb_id: game.id });

    const { data } = await client.mutate({
      mutation: CREATE_GAME_TAG_WITH_META,
      variables: {
        input,
      },
    });

    return data?.createGameTagWithMeta?.gameTag?.slug || null;
  } catch (error) {
    console.error('Error creating game tag from IGDB:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const canonicalPath = `/game/${params.slug}`;
    const gameTag = await getGameTagBySlug(params.slug);

    if (gameTag) {
      const gameData = buildGameFromTag(gameTag);
      const description = buildDescription(gameTag.description || gameData.description || gameData.name);
      return buildPageMetadata({
        title: `${gameData.name} - Game Details | FinalBoss.io`,
        description: description || gameData.name,
        path: canonicalPath,
        image: gameData.cover_url || undefined,
        type: 'article',
        robots: {
          index: true,
          follow: true,
        },
      });
    }

    // Fallback to IGDB if it's an ID
    const igdbId = parseInt(params.slug);
    if (!isNaN(igdbId)) {
      const igdbClient = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
      const game = await igdbClient.getGameDetails(igdbId);
      const resolvedSlug = slugifyGameTitle(game.data.name);
      const resolvedPath = `/game/${resolvedSlug}`;
      
      const description = buildDescription(game.data.description) || game.data.name;
      return buildPageMetadata({
        title: `${game.data.name} - Game Details | FinalBoss.io`,
        description,
        path: resolvedPath,
        image: game.data.cover_url || undefined,
        type: 'article',
        robots: {
          index: true,
          follow: true,
        },
      });
    }

    return {
      title: 'Game Not Found | FinalBoss.io'
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error | FinalBoss.io'
    };
  }
}

export default async function GamePage({ params }: Props) {
  try {
    const canonicalUrl = `${baseUrl}/game/${params.slug}`;
    const gameTag = await getGameTagWithPosts(params.slug);

    if (gameTag) {
      const gameData = buildGameFromTag(gameTag);
      const relatedArticles = gameTag.posts?.nodes || [];

      return (
        <>
          <Header />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(buildVideoGameJsonLd(gameData, canonicalUrl)) }}
          />
          <GameDetails game={gameData} />
          {relatedArticles.length > 0 && (
            <section className="bg-gray-900 text-white py-12">
              <div className="container mx-auto px-4">
                <div className="flex items-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mr-4">
                    More {gameData.name} Coverage
                  </h2>
                  <div className="flex-grow h-0.5 md:h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full" />
                </div>
                <ResponsiveArticleGrid
                  articles={relatedArticles}
                  showFeatured={false}
                  featuredCount={0}
                />
              </div>
            </section>
          )}
          <Footer />
        </>
      );
    }

    // Fallback to IGDB if it's an ID
    const igdbId = parseInt(params.slug);
    if (!isNaN(igdbId)) {
      const igdbClient = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
      const game = await igdbClient.getGameDetails(igdbId);

      const resolvedSlug = slugifyGameTitle(game.data.name);
      const existingTag = await getGameTagBySlug(resolvedSlug);
      if (existingTag?.slug) {
        redirect(`/game/${resolvedSlug}`);
      }

      const createdSlug = await createGameTagFromIgdb(game.data);
      if (createdSlug) {
        redirect(`/game/${createdSlug}`);
      }

      return (
        <>
          <Header />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(buildVideoGameJsonLd(game.data, canonicalUrl)) }}
          />
          <GameDetails game={game.data} />
          <Footer />
        </>
      );
    }

    return notFound();
  } catch (error) {
    console.error('Error loading game details:', error);
    return notFound();
  }
} 
