import { IGDBClient } from '@/app/lib/igdb-client';
import { GameDetails } from '@/app/components/GameDetails';
import { Metadata } from 'next';

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const client = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
  const game = await client.getGameDetails(parseInt(params.id));
  
  return {
    title: `${game.data.name} - Game Details`,
    description: game.data.description?.slice(0, 160) || `Details about ${game.data.name}`,
  };
}

export default async function GamePage({ params }: Props) {
  const client = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
  const game = await client.getGameDetails(parseInt(params.id));
  
  return <GameDetails game={game.data} />;
}