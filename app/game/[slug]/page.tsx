import { IGDBClient } from '@/app/lib/igdb-client';
import { GameDetails } from '@/app/components/GameDetails';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import client from '@/app/lib/apolloClient';
import { CREATE_GAME, GET_GAME, GET_GAME_BY_IGDB_ID } from '@/app/lib/queries/gameQueries';
import { absoluteUrl, buildPageMetadata } from '@/app/lib/seo';
import { IGDBGame } from '@/app/types/igdb';

interface Props {
  params: {
    slug: string;
  };
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io';

export const revalidate = 3600;

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

function stripGameMetaBlock(content: string | undefined): string {
  if (!content) return '';
  return content.replace(/<div class="game-meta"[^>]*>[\s\S]*?<\/div>/, '');
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

function buildGameMetaFromIgdb(game: IGDBGame) {
  return {
    igdb_id: game.id,
    rating: game.rating,
    release_date: game.release_date,
    platforms: game.platforms,
    screenshots: game.screenshots,
    videos: game.videos,
    websites: game.websites,
  };
}

function buildGameContent(content: string, meta: Record<string, unknown>) {
  return `<!-- wp:group -->
<div class="game-details">
  ${content}
  <!-- Game Meta Data -->
  <div class="game-meta" style="display:none">
    ${JSON.stringify(meta)}
  </div>
</div>
<!-- /wp:group -->`;
}

async function findGameSlugByIgdbId(igdbId: number): Promise<string | null> {
  try {
    const { data } = await client.query({
      query: GET_GAME_BY_IGDB_ID,
      variables: { igdbId: String(igdbId) },
      fetchPolicy: 'no-cache',
    });

    const node = data?.games?.nodes?.[0];
    return node?.slug || null;
  } catch (error) {
    console.error('Error resolving game by IGDB id:', error);
    return null;
  }
}

async function createGameFromIgdb(game: IGDBGame): Promise<string | null> {
  try {
    const meta = buildGameMetaFromIgdb(game);
    const slug = slugifyGameTitle(game.name);
    const content = buildGameContent(game.description || '', meta);

    const input: Record<string, unknown> = {
      title: game.name,
      status: 'PUBLISH',
      slug,
      content,
    };

    if (game.id != null) {
      input.metaData = [{ key: 'igdb_id', value: String(game.id) }];
    }

    const { data } = await client.mutate({
      mutation: CREATE_GAME,
      variables: {
        input,
      },
    });

    return data?.createGame?.game?.slug || null;
  } catch (error) {
    console.error('Error creating game from IGDB:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const canonicalPath = `/game/${params.slug}`;
    // First try WordPress
    const { data } = await client.query({
      query: GET_GAME,
      variables: { slug: params.slug }
    });

    if (data?.game) {
      const contentSansMeta = stripGameMetaBlock(data.game.content);
      const description = buildDescription(data.game.excerpt || contentSansMeta || data.game.title);
      return buildPageMetadata({
        title: `${data.game.title} - Game Details | FinalBoss.io`,
        description: description || data.game.title,
        path: canonicalPath,
        image: data.game.featuredImage?.node?.sourceUrl || undefined,
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
      const resolvedSlug = await findGameSlugByIgdbId(igdbId);
      const resolvedPath = resolvedSlug ? `/game/${resolvedSlug}` : canonicalPath;
      const igdbClient = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
      const game = await igdbClient.getGameDetails(igdbId);
      
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
    // First try WordPress
    const { data } = await client.query({
      query: GET_GAME,
      variables: { slug: params.slug }
    });

    if (data?.game) {
      // Extract game meta data from content
      const metaMatch = data.game.content.match(/<div class="game-meta"[^>]*>(.*?)<\/div>/);
      const gameMeta = metaMatch ? JSON.parse(metaMatch[1]) : null;
      const contentSansMeta = stripGameMetaBlock(data.game.content);
      const gameData: IGDBGame = {
        ...(gameMeta || {}),
        name: data.game.title,
        description: gameMeta?.description || stripHtml(contentSansMeta),
        cover_url: gameMeta?.cover_url || data.game.featuredImage?.node?.sourceUrl,
      };

      return (
        <div className="min-h-screen bg-gray-900">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(buildVideoGameJsonLd(gameData, canonicalUrl)) }}
          />
          <GameDetails game={gameData} />
        </div>
      );
    }

    // Fallback to IGDB if it's an ID
    const igdbId = parseInt(params.slug);
    if (!isNaN(igdbId)) {
      const resolvedSlug = await findGameSlugByIgdbId(igdbId);
      if (resolvedSlug) {
        redirect(`/game/${resolvedSlug}`);
      }

      const igdbClient = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
      const game = await igdbClient.getGameDetails(igdbId);

      const createdSlug = await createGameFromIgdb(game.data);
      if (createdSlug) {
        redirect(`/game/${createdSlug}`);
      }

      return (
        <div className="min-h-screen bg-gray-900">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(buildVideoGameJsonLd(game.data, canonicalUrl)) }}
          />
          <GameDetails game={game.data} />
        </div>
      );
    }

    return notFound();
  } catch (error) {
    console.error('Error loading game details:', error);
    return notFound();
  }
} 
