import { NextResponse } from 'next/server';
import client from '@/app/lib/apolloClient';
import { CREATE_GAME } from '@/app/lib/queries/gameQueries';

export async function POST(request: Request) {
  try {
    const { game } = await request.json();
    
    // Create slug from game title (ES2015 compatible)
    const slug = game.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric chars with dash
      .replace(/^-+|-+$/g, '')      // Remove leading/trailing dashes
      .substring(0, 200);           // Limit length
    const meta = game?.meta ?? {};
    
    // Create the game entry in WordPress (custom post type)
    const input: Record<string, unknown> = {
      title: game.title,
      status: "PUBLISH",
      slug: slug,
      content: `<!-- wp:group -->
<div class="game-details">
  ${game.content}
  <!-- Game Meta Data -->
  <div class="game-meta" style="display:none">
    ${JSON.stringify(meta)}
  </div>
</div>
<!-- /wp:group -->`
    };

    if (meta?.igdb_id != null) {
      input.metaData = [{ key: "igdb_id", value: String(meta.igdb_id) }];
    }

    const createResult = await client.mutate({
      mutation: CREATE_GAME,
      variables: {
        input
      }
    });

    return NextResponse.json({ 
      success: true, 
      slug: createResult.data.createGame.game.slug 
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
