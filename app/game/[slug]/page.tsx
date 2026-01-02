import { IGDBClient } from '@/app/lib/igdb-client';
import { GameDetails } from '@/app/components/GameDetails';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import client from '@/app/lib/apolloClient';
import { GET_GAME } from '@/app/lib/queries/gameQueries';
import { absoluteUrl, buildPageMetadata } from '@/app/lib/seo';
import { IGDBGame } from '@/app/types/igdb';

interface Props {
  params: {
    slug: string;
  };
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io';

export const revalidate = 3600;

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const canonicalPath = `/game/${params.slug}`;
    // First try WordPress
    const { data } = await client.query({
      query: GET_GAME,
      variables: { slug: params.slug }
    });

    if (data?.post) {
      const description = buildDescription(data.post.excerpt || data.post.content || data.post.title);
      return buildPageMetadata({
        title: `${data.post.title} - Game Details | FinalBoss.io`,
        description: description || data.post.title,
        path: canonicalPath,
        image: data.post.featuredImage?.node?.sourceUrl || undefined,
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
      
      const description = buildDescription(game.data.description) || game.data.name;
      return buildPageMetadata({
        title: `${game.data.name} - Game Details | FinalBoss.io`,
        description,
        path: canonicalPath,
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

    if (data?.post) {
      // Extract game meta data from content
      const metaMatch = data.post.content.match(/<div class="game-meta"[^>]*>(.*?)<\/div>/);
      const gameMeta = metaMatch ? JSON.parse(metaMatch[1]) : null;
      const gameData: IGDBGame = {
        ...(gameMeta || {}),
        name: data.post.title,
        description: gameMeta?.description || stripHtml(data.post.content),
        cover_url: gameMeta?.cover_url || data.post.featuredImage?.node?.sourceUrl,
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
      const igdbClient = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
      const game = await igdbClient.getGameDetails(igdbId);
      
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
