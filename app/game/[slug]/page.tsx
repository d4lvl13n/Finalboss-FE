import { IGDBClient } from '@/app/lib/igdb-client';
import { GameDetails } from '@/app/components/GameDetails';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import client from '@/app/lib/apolloClient';
import { GET_GAME } from '@/app/lib/queries/gameQueries';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // First try WordPress
    const { data } = await client.query({
      query: GET_GAME,
      variables: { slug: params.slug }
    });

    if (data?.post) {
      return {
        title: `${data.post.title} - Game Details | FinalBoss.io`,
        description: data.post.excerpt || data.post.title,
        openGraph: {
          title: data.post.title,
          description: data.post.excerpt || data.post.title,
          images: [data.post.featuredImage?.node?.sourceUrl || ''],
          type: 'article',
        }
      };
    }

    // Fallback to IGDB if it's an ID
    const igdbId = parseInt(params.slug);
    if (!isNaN(igdbId)) {
      const igdbClient = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
      const game = await igdbClient.getGameDetails(igdbId);
      
      return {
        title: `${game.data.name} - Game Details | FinalBoss.io`,
        description: game.data.description?.slice(0, 160),
        openGraph: {
          title: game.data.name,
          description: game.data.description?.slice(0, 160),
          images: [game.data.cover_url || ''],
          type: 'article',
        }
      };
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
    // First try WordPress
    const { data } = await client.query({
      query: GET_GAME,
      variables: { slug: params.slug }
    });

    if (data?.post) {
      // Extract game meta data from content
      const metaMatch = data.post.content.match(/<div class="game-meta"[^>]*>(.*?)<\/div>/);
      const gameMeta = metaMatch ? JSON.parse(metaMatch[1]) : null;

      return (
        <div className="min-h-screen bg-gray-900">
          <GameDetails 
            game={{
              ...gameMeta,
              name: data.post.title,
              description: data.post.content,
              cover_url: data.post.featuredImage?.node?.sourceUrl
            }} 
          />
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