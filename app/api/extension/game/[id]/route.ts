import { NextRequest, NextResponse } from 'next/server';
import { IGDBClient } from '@/app/lib/igdb-client';
import siteConfig from '@/app/lib/siteConfig';

const igdbClient = new IGDBClient(siteConfig.wordpressUrl);

// CORS headers for Chrome extension
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const gameId = parseInt(id, 10);

  if (isNaN(gameId)) {
    return NextResponse.json(
      { success: false, error: 'Invalid game ID' },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const response = await igdbClient.getGameDetails(gameId);

    if (!response.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch game details from IGDB' },
        { status: 500, headers: corsHeaders }
      );
    }

    const game = response.data;

    // Generate slug for finalboss.io link (matches slugifyGameTitle in game page)
    const slug = game.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 200);

    // Transform data for extension
    const gameData = {
      id: game.id,
      name: game.name,
      slug: slug,
      cover_url: game.cover_url,
      description: game.description,
      rating: game.rating ? Math.round(game.rating) : null,
      release_date: game.release_date,
      platforms: game.platforms?.map(p => p.name),
      genres: game.genres,
      themes: game.themes,
      game_modes: game.game_modes,
      companies: game.companies,
      screenshots: game.screenshots?.slice(0, 3),
      // Use IGDB ID as fallback - the game page handles both slug and ID
      finalboss_url: `${siteConfig.url}/game/${slug || game.id}`,
    };

    return NextResponse.json(
      { success: true, data: gameData },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Extension game details error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
