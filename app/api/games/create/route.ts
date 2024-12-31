import { NextResponse } from 'next/server';
import { createMutationClient } from '@/app/lib/apolloClient';
import { CREATE_GAME } from '@/app/lib/queries/gameQueries';

export async function POST(request: Request) {
  try {
    const { game } = await request.json();
    
    const mutationClient = createMutationClient();
    
    // Create slug from game title
    const slug = game.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 200);
    
    // Create the game post in WordPress
    const createResult = await mutationClient.mutate({
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