import { NextRequest, NextResponse } from 'next/server';
import { getGameDetails } from '@/app/lib/igdb-server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const gameId = parseInt(id, 10);

  if (isNaN(gameId)) {
    return NextResponse.json(
      { success: false, message: 'Invalid game ID' },
      { status: 400 }
    );
  }

  try {
    const game = await getGameDetails(gameId);
    return NextResponse.json({ success: true, data: game });
  } catch (error) {
    console.error('[api/igdb/game]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('not found') ? 404 : 502;
    return NextResponse.json(
      { success: false, message },
      { status }
    );
  }
}
