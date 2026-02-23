import { NextRequest, NextResponse } from 'next/server';
import { searchGames } from '@/app/lib/igdb-server';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('s');
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10', 10);

  if (!query || !query.trim()) {
    return NextResponse.json(
      { success: false, message: 'Missing search query parameter "s"' },
      { status: 400 }
    );
  }

  try {
    const games = await searchGames(query.trim(), Math.min(limit, 50));
    return NextResponse.json({ success: true, data: games });
  } catch (error) {
    console.error('[api/igdb/search]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message },
      { status: 502 }
    );
  }
}
