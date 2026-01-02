import { NextResponse } from 'next/server';
import client from '@/app/lib/apolloClient';
import { IGDBClient } from '@/app/lib/igdb-client';
import { CREATE_GAME_TAG_WITH_META, GET_GAME_TAG_BY_SLUG } from '@/app/lib/queries/gameQueries';

export async function POST(request: Request) {
  try {
    const { game } = await request.json();
    
    // Create slug from game title (ES2015 compatible)
    let rawTitle = game?.title || game?.name || '';
    if (!rawTitle) {
      return NextResponse.json({ success: false, error: 'Missing game title' }, { status: 400 });
    }
    let igdbData = game?.igdbData || game?.meta || {};
    const igdbId = igdbData?.igdb_id ?? igdbData?.id ?? game?.igdb_id;

    if (igdbId != null) {
      try {
        const igdbClient = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL || '');
        const fullGame = await igdbClient.getGameDetails(Number(igdbId));
        if (fullGame?.data) {
          igdbData = { ...fullGame.data, igdb_id: igdbId };
          rawTitle = fullGame.data.name || rawTitle;
        }
      } catch (error) {
        console.error('Error fetching full IGDB data:', error);
      }
    }

    const slug = rawTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric chars with dash
      .replace(/^-+|-+$/g, '')      // Remove leading/trailing dashes
      .substring(0, 200);           // Limit length

    const existing = await client.query({
      query: GET_GAME_TAG_BY_SLUG,
      variables: { slug },
      fetchPolicy: 'no-cache',
    });

    if (existing?.data?.gameTag?.slug) {
      return NextResponse.json({ success: true, slug: existing.data.gameTag.slug });
    }
    
    const description = (game?.description || igdbData?.description || '').toString();
    const trimmedDescription = description.length > 160 ? `${description.slice(0, 157).trimEnd()}...` : description;

    // Create the game taxonomy term in WordPress
    const input: Record<string, unknown> = {
      name: rawTitle,
      slug: slug,
      description: trimmedDescription,
    };

    if (igdbId != null) {
      input.igdbId = String(igdbId);
    }
    if (Object.keys(igdbData || {}).length > 0) {
      input.igdbData = JSON.stringify(igdbData);
    }

    const createResult = await client.mutate({
      mutation: CREATE_GAME_TAG_WITH_META,
      variables: {
        input
      }
    });

    return NextResponse.json({ 
      success: true, 
      slug: createResult.data.createGameTagWithMeta.slug 
    });
  } catch (error: unknown) {
    console.error('Error creating game:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
} 
