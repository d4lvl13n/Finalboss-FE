import { IGDBClient } from '@/app/lib/igdb-client';
import { GameDetails } from '@/app/components/GameDetails';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const client = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
  const game = await client.getGameDetails(parseInt(params.id));
  
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
}

export default async function GamePage({ params }: Props) {
  try {
    console.log('Attempting to fetch game with ID:', params.id);
    
    if (!params.id || isNaN(parseInt(params.id))) {
      console.log('Invalid ID:', params.id);
      notFound();
    }

    const client = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
    const game = await client.getGameDetails(parseInt(params.id));
    
    console.log('Game data received:', game);
    
    if (!game || !game.data) {
      console.log('No game data found');
      notFound();
    }
    
    return (
      <div className="min-h-screen bg-gray-900">
        <GameDetails game={game.data} />
      </div>
    );
  } catch (error) {
    console.error('Error loading game details:', error);
    notFound();
  }
}