import { NextResponse } from 'next/server';
import { IGDBGame } from '@/app/types/igdb';

// Pre-encode the credentials
const AUTH_TOKEN = 'YWRtaW46RW5weiBvVEtLIFFoM3YgdTFTYyBRUlZlIDZWNWQ=';

export async function POST(request: Request) {
  try {
    const game: IGDBGame = await request.json();
    
    // Create a structured content block that preserves all IGDB data
    const content = `
      <!-- wp:group {"className":"game-details"} -->
      <div class="game-details">
        <!-- wp:group {"className":"game-header"} -->
        <div class="game-header">
          ${game.cover_url ? `<img src="${game.cover_url}" alt="${game.name}" />` : ''}
          <h1>${game.name}</h1>
          ${game.rating ? `<div class="rating">${Math.round(game.rating)}/100</div>` : ''}
        </div>
        <!-- /wp:group -->

        <!-- wp:group {"className":"game-description"} -->
        <div class="game-description">
          ${game.description || ''}
        </div>
        <!-- /wp:group -->

        <!-- wp:group {"className":"game-meta","style":{"display":"none"}} -->
        <div class="game-meta" style="display:none">
          ${JSON.stringify({
            igdb_id: game.id,
            name: game.name,
            cover_url: game.cover_url,
            rating: game.rating,
            release_date: game.release_date,
            platforms: game.platforms,
            genres: game.genres,
            screenshots: game.screenshots,
            videos: game.videos,
            websites: game.websites
          })}
        </div>
        <!-- /wp:group -->
      </div>
      <!-- /wp:group -->
    `;

    // Create WordPress post
    const response = await fetch('https://backend.finalboss.io/wp-json/wp/v2/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${AUTH_TOKEN}`
      },
      body: JSON.stringify({
        title: game.name,
        content: content,
        status: 'publish',
        categories: [8], // Games category
        slug: `${game.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${game.id}`,
        meta: {
          igdb_id: game.id
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`WordPress API error: ${errorText}`);
    }

    const post = await response.json();
    return NextResponse.json({ 
      success: true, 
      slug: post.slug 
    });
  } catch (error: any) {
    console.error('Error creating game:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
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