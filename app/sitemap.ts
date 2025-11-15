import { MetadataRoute } from 'next'
import { youtubeService } from './lib/youtube/service'
import { GET_ALL_POSTS } from './lib/queries/getAllPosts'
import { GET_TECH_ARTICLES } from './lib/queries/getTechArticles'
import { GET_REVIEWS } from './lib/queries/getReviews'
import client from './lib/apolloClient'

// Interfaces
interface WordPressPost {
  id: string
  slug: string
}

interface YouTubeVideo {
  id: string
  publishedAt: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io'
  const ARTICLE_PAGE_SIZE = 24

  // Fetch your dynamic content
  const [videos, articlesData, techData, reviewsData] = await Promise.all([
    youtubeService.getChannelUploads(50),
    client.query({
      query: GET_ALL_POSTS,
      variables: { first: 100 },
    }),
    client.query({
      query: GET_TECH_ARTICLES,
      variables: { first: 100 },
    }),
    client.query({
      query: GET_REVIEWS,
      variables: { first: 100 },
    }),
  ])

  // Aggregate and deduplicate WordPress posts by slug
  const postNodes: WordPressPost[] = [
    ...(articlesData?.data?.posts?.nodes || []),
    ...(techData?.data?.posts?.nodes || []),
    ...(reviewsData?.data?.posts?.nodes || []),
  ]

  const uniquePostsBySlug = new Map<string, WordPressPost>()
  for (const post of postNodes) {
    if (post && post.slug && !uniquePostsBySlug.has(post.slug)) {
      uniquePostsBySlug.set(post.slug, post)
    }
  }
  const uniquePosts = Array.from(uniquePostsBySlug.values())

  // Gather all URLs
  const urls: MetadataRoute.Sitemap = [
    // Static pages
    {
      url: `${baseUrl}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/videos`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/articles`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/technology`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reviews`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/feeds/articles`,
      changeFrequency: 'daily',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/feeds/reviews`,
      changeFrequency: 'daily',
      priority: 0.3,
    },
    // Dynamic videos
    ...(videos.items?.map((video: YouTubeVideo) => ({
      url: `${baseUrl}/videos/${video.id}`,
      lastModified: new Date(video.publishedAt).toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })) || []),
    // Dynamic posts (deduplicated)
    ...uniquePosts.map((post: WordPressPost) => ({
      url: `${baseUrl}/${post.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    // Paginated articles
    ...(() => {
      const total =
        articlesData.data.posts.pageInfo?.offsetPagination?.total ??
        articlesData.data.posts.nodes.length
      const totalPages = Math.max(1, Math.ceil(total / ARTICLE_PAGE_SIZE))
      if (totalPages <= 1) return []
      return Array.from({ length: totalPages - 1 }, (_, idx) => idx + 2).map((pageNumber) => ({
        url: `${baseUrl}/articles/page/${pageNumber}`,
        changeFrequency: 'weekly',
        priority: 0.5,
      }))
    })(),
  ]

  return urls
}
