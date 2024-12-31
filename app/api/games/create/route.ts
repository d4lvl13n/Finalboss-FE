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
    
    // Create the game post in WordPress
    const createResult = await client.mutate({
      mutation: CREATE_GAME,
      variables: {
        input: {
          title: game.title,
          status: "PUBLISH",
          slug: slug,
          categories: {
            nodes: [{ name: "Games" }]
          },
          content: `<!-- wp:group -->
<div class="game-details">
  ${game.content}
  <!-- Game Meta Data -->
  <div class="game-meta" style="display:none">
    ${JSON.stringify(game.meta)}
  </div>
</div>
<!-- /wp:group -->`
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      slug: createResult.data.createPost.post.slug 
    });
  } catch (error: any) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { success: false, error: error.message },
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