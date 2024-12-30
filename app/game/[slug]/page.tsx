import { IGDBClient } from '@/app/lib/igdb-client';
import { GameDetails } from '@/app/components/GameDetails';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import client from '@/app/lib/apolloClient';
import { GET_GAME_BY_SLUG, GET_GAME_BY_IGDB_ID } from '@/app/lib/queries/gameQueries';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // First try to get game by slug
    const { data: wpData } = await client.query({
      query: GET_GAME_BY_SLUG,
      variables: { slug: params.slug }
    });

    if (!wpData.game) {
      // If not found by slug, check if it's an ID
      const igdbId = parseInt(params.slug);
      if (!isNaN(igdbId)) {
        // Try to find game by IGDB ID
        const { data: gameData } = await client.query({
          query: GET_GAME_BY_IGDB_ID,
          variables: { igdbId }
        });

        // If found, redirect to slug URL
        if (gameData?.games?.nodes?.[0]) {
          redirect(`/game/${gameData.games.nodes[0].slug}`);
        }

        // If not in WordPress but valid IGDB ID, get from IGDB
        const igdbClient = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
        const game = await igdbClient.getGameDetails(igdbId);
        return {
          title: `${game.data.name} - Game Details | FinalBoss.io`,
          description: game.data.description?.slice(0, 160),
          // ... rest of metadata
        };
      }
      return notFound();
    }

    // Get IGDB data using the stored igdbId
    const igdbClient = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
    const game = await igdbClient.getGameDetails(wpData.game.gameDetails.igdbId);

    return {
      title: `${game.data.name} - Game Details | FinalBoss.io`,
      description: game.data.description?.slice(0, 160),
      openGraph: {
        title: game.data.name,
        description: game.data.description?.slice(0, 160),
        images: [game.data.cover_url || ''],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: game.data.name,
        description: game.data.description?.slice(0, 160),
        images: [game.data.cover_url || ''],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Game Details | FinalBoss.io',
      description: 'Game information not found',
    };
  }
}

export default async function GamePage({ params }: Props) {
  try {
    // Try to get game by slug first
    const { data: wpData } = await client.query({
      query: GET_GAME_BY_SLUG,
      variables: { slug: params.slug }
    });

    let igdbId: number;

    if (!wpData.game) {
      // If not found by slug, check if it's an ID
      igdbId = parseInt(params.slug);
      if (isNaN(igdbId)) {
        return notFound();
      }
      
      // Try to find game by IGDB ID
      const { data: gameData } = await client.query({
        query: GET_GAME_BY_IGDB_ID,
        variables: { igdbId }
      });

      // If found, redirect to slug URL
      if (gameData?.games?.nodes?.[0]) {
        redirect(`/game/${gameData.games.nodes[0].slug}`);
      }
    } else {
      igdbId = wpData.game.gameDetails.igdbId;
    }

    const igdbClient = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
    const game = await igdbClient.getGameDetails(igdbId);

    if (!game || !game.data) {
      return notFound();
    }

    return (
      <div className="min-h-screen bg-gray-900">
        <GameDetails game={game.data} />
      </div>
    );
  } catch (error) {
    console.error('Error loading game details:', error);
    return notFound();
  }
} 