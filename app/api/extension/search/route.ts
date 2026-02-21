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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '5', 10);

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: 'Query parameter "q" is required' },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const response = await igdbClient.searchGames(query.trim(), limit);

    if (!response.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch games from IGDB' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Transform data for extension (minimal payload)
    const games = response.data.map(game => ({
      id: game.id,
      name: game.name,
      cover_url: game.cover_url,
      rating: game.rating ? Math.round(game.rating) : null,
      release_date: game.release_date,
      platforms: game.platforms?.map(p => p.name).slice(0, 4),
      genres: game.genres?.slice(0, 3),
    }));

    return NextResponse.json(
      { success: true, data: games },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Extension search error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
