import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { IGDBGame, IGDBGameMeta } from '@/app/types/igdb';
import Image from 'next/image';
import { IGDBClient } from '@/app/lib/igdb-client';

// Function to extract game data from WordPress content
function extractGameData(content: string): IGDBGame {
  try {
    const metaMatch = content.match(/<div class="game-meta".*?>(.*?)<\/div>/s);
    if (metaMatch) {
      const cleanJson = metaMatch[1].trim();
      return JSON.parse(cleanJson);
    }
    throw new Error('Game meta data not found in WordPress content');
  } catch (error) {
    console.error('Error parsing game data:', error);
    throw new Error('Failed to parse game data from WordPress');
  }
}

// Helper to format release date
function formatReleaseDate(dateString: string | undefined): string {
  if (!dateString) return 'Release date TBA';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    // First try WordPress
    const wpResponse = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts?slug=${params.slug}`);
    const wpPosts = await wpResponse.json();

    if (wpPosts.length > 0) {
      const gameData = extractGameData(wpPosts[0].content.rendered);
      return {
        title: `${gameData.name} - Game Details | FinalBoss.io`,
        description: gameData.description?.slice(0, 160),
        openGraph: {
          title: gameData.name,
          description: gameData.description?.slice(0, 160),
          images: [gameData.cover_url || ''],
          type: 'article',
        }
      };
    }

    // If not in WordPress, try IGDB
    const idMatch = params.slug.match(/-(\d+)$/);
    if (idMatch) {
      const gameId = parseInt(idMatch[1]);
      const client = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
      const response = await client.getGameDetails(gameId);
      
      if (response.success && response.data) {
        return {
          title: `${response.data.name} - Game Details | FinalBoss.io`,
          description: response.data.description?.slice(0, 160),
          openGraph: {
            title: response.data.name,
            description: response.data.description?.slice(0, 160),
            images: [response.data.cover_url || ''],
            type: 'article',
          }
        };
      }
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

export default async function GamePage({ params }: { params: { slug: string } }) {
  try {
    // First try WordPress
    const wpResponse = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts?slug=${params.slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    const wpPosts = await wpResponse.json();
    let gameData: IGDBGame;

    if (wpPosts.length > 0) {
      // Extract game data from WordPress content
      gameData = extractGameData(wpPosts[0].content.rendered);
    } else {
      // If not in WordPress, try IGDB
      // Assume slug ends with IGDB ID (game-name-12345)
      const idMatch = params.slug.match(/-(\d+)$/);
      if (!idMatch) throw new Error('Invalid game slug');

      const gameId = parseInt(idMatch[1]);
      const client = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
      const response = await client.getGameDetails(gameId);
      
      if (!response.success || !response.data) {
        throw new Error('Game not found');
      }
      
      gameData = response.data;
    }

    return (
      <div className="game-page">
        {/* Hero Section */}
        <div className="hero-section relative h-[60vh] overflow-hidden">
          {gameData.screenshots?.[0] && (
            <Image
              src={gameData.screenshots[0]}
              alt={`${gameData.name} screenshot`}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Game Info */}
        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover Image */}
            {gameData.cover_url && (
              <div className="flex-shrink-0">
                <Image
                  src={gameData.cover_url}
                  alt={gameData.name}
                  width={264}
                  height={352}
                  className="rounded-lg shadow-lg"
                  priority
                />
              </div>
            )}

            {/* Game Details */}
            <div className="flex-grow">
              <h1 className="text-4xl font-bold mb-4">{gameData.name}</h1>
              
              {/* Rating and Release Date */}
              <div className="flex flex-wrap gap-4 mb-6">
                {gameData.rating && (
                  <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full">
                    {Math.round(gameData.rating)}/100
                  </div>
                )}
                <div className="text-muted-foreground">
                  {formatReleaseDate(gameData.release_date)}
                </div>
              </div>

              {/* Platforms */}
              {gameData.platforms && gameData.platforms.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Platforms</h2>
                  <div className="flex flex-wrap gap-2">
                    {gameData.platforms.map((platform) => (
                      <span
                        key={platform.id}
                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                      >
                        {platform.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {gameData.description && (
                <div className="prose prose-invert max-w-none">
                  <p>{gameData.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Screenshots Gallery */}
          {gameData.screenshots && gameData.screenshots.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gameData.screenshots.map((screenshot, index) => (
                  <div key={index} className="relative aspect-video">
                    <Image
                      src={screenshot}
                      alt={`${gameData.name} screenshot ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading game:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-500">
          Error loading game details
        </h1>
        <p className="text-muted-foreground">
          Unable to load game information. Please try again later.
        </p>
      </div>
    );
  }
} 