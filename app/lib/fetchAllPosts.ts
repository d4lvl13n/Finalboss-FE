import type { ApolloQueryResult } from '@apollo/client'
import client from './apolloClient'
import { GET_ALL_POSTS } from './queries/getAllPosts'

export interface WordPressPost {
  id: string
  slug: string
  modified?: string
  date?: string
}

interface FetchAllPostsResult {
  posts: WordPressPost[]
  total: number
}

interface FetchPostsQuery {
  posts: {
    nodes: WordPressPost[]
    pageInfo: {
      hasNextPage: boolean
      endCursor: string | null
      offsetPagination?: {
        total: number
      }
    }
  }
}

const DEFAULT_BATCH_SIZE = 100
const MAX_BATCHES = 500 // safety guard (200 * 500 = 100k posts)

export async function fetchAllPosts(batchSize = DEFAULT_BATCH_SIZE): Promise<FetchAllPostsResult> {
  const posts: WordPressPost[] = []
  let after: string | null = null
  let hasNextPage = true
  let total = 0
  let batchCount = 0

  while (hasNextPage && batchCount < MAX_BATCHES) {
    let data: FetchPostsQuery | null = null

    try {
      const response: ApolloQueryResult<FetchPostsQuery> = await client.query<FetchPostsQuery>({
        query: GET_ALL_POSTS,
        variables: { first: batchSize, after },
        fetchPolicy: 'no-cache',
      })
      data = response.data
    } catch (error) {
      console.error('Failed to fetch posts batch for sitemap:', error)
      break
    }

    const nodes = data?.posts?.nodes ?? []
    posts.push(
      ...nodes.map((node: WordPressPost) => ({
        id: node.id,
        slug: node.slug,
        modified: node.modified,
        date: node.date,
      }))
    )

    total = data?.posts?.pageInfo?.offsetPagination?.total ?? total
    hasNextPage = Boolean(data?.posts?.pageInfo?.hasNextPage)
    after = data?.posts?.pageInfo?.endCursor ?? null
    batchCount += 1

    if (!hasNextPage || !after) {
      break
    }
  }

  return {
    posts,
    total: total || posts.length,
  }
}

