import { NextResponse } from 'next/server';
import client from '@/app/lib/apolloClient';
import { CREATE_GAME_MAPPING, GET_GAME_BY_IGDB_ID } from '@/app/lib/queries/gameQueries';

export async function POST(request: Request) {
  try {
    const { igdb_id, game_name } = await request.json();
    console.log('Processing request for:', { igdb_id, game_name });

    // Check existing game
    const existingGameResult = await client.query({
      query: GET_GAME_BY_IGDB_ID,
      variables: { igdbId: igdb_id }
    });
    console.log('Existing game query result:', existingGameResult);

    if (existingGameResult?.data?.posts?.nodes?.[0]) {
      return NextResponse.json({ 
        success: true, 
        slug: existingGameResult.data.posts.nodes[0].slug 
      });
    }

    // Create new game
    const createResult = await client.mutate({
      mutation: CREATE_GAME_MAPPING,
      variables: {
        input: {
          title: game_name,
          status: "PUBLISH",
          categories: {
            nodes: [{ name: "Games" }]
          },
          metaInput: [
            {
              key: "igdb_id",
              value: igdb_id.toString()
            }
          ]
        }
      }
    });
    console.log('Create game result:', createResult);

    if (!createResult?.data?.createPost?.post?.slug) {
      throw new Error('Failed to get slug from created post');
    }

    return NextResponse.json({ 
      success: true, 
      slug: createResult.data.createPost.post.slug 
    });
  } catch (error: any) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      graphqlErrors: error.graphQLErrors,
      networkError: error.networkError
    });
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create game mapping',
        details: error.graphQLErrors || error.networkError
      },
      { status: 500 }
    );
  }
} 