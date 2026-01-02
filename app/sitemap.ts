import { MetadataRoute } from 'next'
import { youtubeService } from './lib/youtube/service'
import { fetchAllPosts, WordPressPost } from './lib/fetchAllPosts'
import client from './lib/apolloClient'
import { GET_ALL_AUTHORS } from './lib/queries/getAuthor'
import { GET_GUIDE_CATEGORIES_AND_POSTS } from './lib/queries/getGuideCategories'

interface YouTubeVideo {
  id: string
  publishedAt: string
}

interface AuthorNode {
  slug: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io'
  const ARTICLE_PAGE_SIZE = 24

  // Fetch dynamic content
  const [videos, { posts: allPosts, total: totalPosts }, authorsData, guidesData] = await Promise.all([
    youtubeService.getChannelUploads(50),
    fetchAllPosts(),
    client.query({ query: GET_ALL_AUTHORS }).catch(() => ({ data: { users: { nodes: [] } } })),
    client
      .query({ query: GET_GUIDE_CATEGORIES_AND_POSTS, variables: { first: 1 }, fetchPolicy: 'no-cache' })
      .catch(() => ({ data: { categories: { nodes: [] } } })),
  ])
  
  const authors: AuthorNode[] = authorsData?.data?.users?.nodes || []
  const guideCategories =
    guidesData?.data?.categories?.nodes?.[0]?.children?.nodes?.filter(
      (category: { slug?: string }) => category?.slug
    ) || []

  // Deduplicate posts by slug
  const uniquePostsBySlug = new Map<string, WordPressPost>()
  for (const post of allPosts) {
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
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/videos`,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/articles`,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/technology`,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reviews`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gaming`,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides`,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/games`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/authors`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/write-for-us`,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    },
    // Note: RSS feeds (/feeds/articles, /feeds/reviews) are intentionally excluded
    // from the sitemap as they are data feeds, not HTML pages for indexing.
    // They are linked in <head> via alternate links for feed discovery.
    
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
      lastModified:
        (post.modified && new Date(post.modified).toISOString()) ||
        (post.date && new Date(post.date).toISOString()) ||
        new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    // Paginated articles
    ...(() => {
      const total = totalPosts || uniquePosts.length
      const totalPages = Math.max(1, Math.ceil(total / ARTICLE_PAGE_SIZE))
      if (totalPages <= 1) return []
      return Array.from({ length: totalPages - 1 }, (_, idx) => idx + 2).map((pageNumber) => ({
        url: `${baseUrl}/articles/page/${pageNumber}`,
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      }))
    })(),
    // Author pages
    ...authors.map((author: AuthorNode) => ({
      url: `${baseUrl}/author/${author.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    // Guide category pages
    ...guideCategories.map((category: { slug: string }) => ({
      url: `${baseUrl}/guides/${category.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]

  return urls
}
