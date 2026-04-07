import { NextRequest, NextResponse } from 'next/server';
import { getUpcomingGames } from '@/app/lib/igdb-server';

export async function GET(request: NextRequest) {
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20', 10);

  try {
    const games = await getUpcomingGames(Math.min(limit, 50));
    return NextResponse.json({ success: true, data: games });
  } catch (error) {
    console.error('[api/igdb/upcoming]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message }, { status: 502 });
  }
}
