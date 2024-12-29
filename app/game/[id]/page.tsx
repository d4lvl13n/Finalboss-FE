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
  try {
    const client = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
    const game = await client.getGameDetails(parseInt(params.id));
    
    return {
      title: `${game.data.name} - Game Details | FinalBoss.io`,
      description: game.data.description?.slice(0, 160) || `Details about ${game.data.name}`,
    };
  } catch (error) {
    return {
      title: 'Game Not Found | FinalBoss.io',
      description: 'The requested game could not be found.',
    };
  }
}

export default async function GamePage({ params }: Props) {
  try {
    if (!params.id || isNaN(parseInt(params.id))) {
      notFound();
    }

    const client = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
    const game = await client.getGameDetails(parseInt(params.id));
    
    if (!game || !game.data) {
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