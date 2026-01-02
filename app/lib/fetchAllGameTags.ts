import { ApolloQueryResult } from '@apollo/client';
import client from './apolloClient';
import { GET_ALL_GAME_TAGS } from './queries/gameQueries';

export interface GameTagNode {
  slug: string;
}

interface GameTagsQueryResult {
  gameTags: {
    nodes: GameTagNode[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

const DEFAULT_BATCH_SIZE = 200;
const MAX_BATCHES = 200;

export async function fetchAllGameTags(
  batchSize = DEFAULT_BATCH_SIZE
): Promise<GameTagNode[]> {
  const tags: GameTagNode[] = [];
  let after: string | null = null;
  let hasNextPage = true;
  let batchCount = 0;

  while (hasNextPage && batchCount < MAX_BATCHES) {
    let data: GameTagsQueryResult | null = null;

    try {
      const response: ApolloQueryResult<GameTagsQueryResult> = await client.query({
        query: GET_ALL_GAME_TAGS,
        variables: { first: batchSize, after },
        fetchPolicy: 'no-cache',
      });
      data = response.data;
    } catch (error) {
      console.error('Failed to fetch game tags for sitemap:', error);
      break;
    }

    const nodes = data?.gameTags?.nodes ?? [];
    tags.push(...nodes);

    hasNextPage = Boolean(data?.gameTags?.pageInfo?.hasNextPage);
    after = data?.gameTags?.pageInfo?.endCursor ?? null;
    batchCount += 1;

    if (!hasNextPage || !after) {
      break;
    }
  }

  return tags;
}
