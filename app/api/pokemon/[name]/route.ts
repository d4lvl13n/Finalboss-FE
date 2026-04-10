import { NextRequest, NextResponse } from 'next/server';
import { getPokemon } from '@/app/lib/pokemon-client';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  if (!name || name.length > 30) {
    return NextResponse.json(
      { success: false, message: 'Invalid Pokémon name' },
      { status: 400 }
    );
  }

  try {
    const pokemon = await getPokemon(name);
    return NextResponse.json({ success: true, data: pokemon });
  } catch (error) {
    console.error('[api/pokemon]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('404') ? 404 : 502;
    return NextResponse.json(
      { success: false, message },
      { status }
    );
  }
}
