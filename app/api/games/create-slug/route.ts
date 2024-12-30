import { NextResponse } from 'next/server';
import client from '@/app/lib/apolloClient';
import { CREATE_GAME_MAPPING, GET_GAME_BY_IGDB_ID } from '@/app/lib/queries/gameQueries';

export async function POST(request: Request) {
  try {
    const { igdb_id, game_name } = await request.json();
    
    // First, check if game already exists
    const { data: existingGame } = await client.query({
      query: GET_GAME_BY_IGDB_ID,
      variables: { igdbId: igdb_id }
    });

    if (existingGame?.games?.nodes?.[0]) {
      return NextResponse.json({ 
        success: true, 
        slug: existingGame.games.nodes[0].slug 
      });
    }

    // If game doesn't exist, create it
    const { data } = await client.mutate({
      mutation: CREATE_GAME_MAPPING,
      variables: {
        input: {
          title: game_name,
          status: "PUBLISH",
          gameDetails: {
            igdbId: igdb_id
          }
        }
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      slug: data.createGame.game.slug 
    });
  } catch (error) {
    console.error('Error creating game mapping:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create game mapping' },
      { status: 500 }
    );
  }
} 