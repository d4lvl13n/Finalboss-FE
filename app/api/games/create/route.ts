import { NextResponse } from 'next/server';
import { createMutationClient } from '@/app/lib/apolloClient';
import { CREATE_GAME } from '@/app/lib/queries/gameQueries';

export async function POST(request: Request) {
  try {
    const { game } = await request.json();
    
    if (!process.env.WP_APP_PASSWORD) {
      throw new Error('WordPress authentication not configured');
    }
    
    const mutationClient = createMutationClient();
    
    // Create slug from game title
    const slug = game.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 200);
    
    // Create the game post in WordPress
    const { data, errors } = await mutationClient.mutate({
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
      },
      // Add context to ensure headers are passed
      context: {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    });

    if (errors?.length) {
      console.error('GraphQL Errors:', errors);
      return NextResponse.json({ 
        success: false, 
        error: errors[0].message,
        details: errors
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      slug: data.createPost.post.slug 
    });
  } catch (error: any) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
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