import { MetadataRoute } from 'next'
import { youtubeService } from './lib/youtube/service'
import { fetchAllPosts, WordPressPost } from './lib/fetchAllPosts'

interface YouTubeVideo {
  id: string
  publishedAt: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io'
  const ARTICLE_PAGE_SIZE = 24

  // Fetch dynamic content
  const [videos, { posts: allPosts, total: totalPosts }] = await Promise.all([
    youtubeService.getChannelUploads(50),
    fetchAllPosts(),
  ])

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
      url: `${baseUrl}/feeds/articles`,
      changeFrequency: 'daily' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/feeds/reviews`,
      changeFrequency: 'daily' as const,
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
  ]

  return urls
}
