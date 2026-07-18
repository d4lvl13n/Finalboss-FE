import { MetadataRoute } from 'next'
import { youtubeService } from './lib/youtube/service'
import { fetchAllPosts, WordPressPost } from './lib/fetchAllPosts'
import { fetchAllGameTags } from './lib/fetchAllGameTags'
import client from './lib/apolloClient'
import { GET_ALL_AUTHORS } from './lib/queries/getAuthor'
import { GET_GUIDE_CATEGORIES_AND_POSTS } from './lib/queries/getGuideCategories'
import siteConfig from './lib/siteConfig'

// Regenerate the sitemap via ISR once a day, so it reflects new AND deleted
// posts without needing a manual rebuild (we rarely redeploy). One deploy
// activates this; after that the sitemap self-refreshes every 24h.
export const revalidate = 86400 // 24 hours
// Headroom for (re)generation: building the full sitemap fans out to WP/YouTube.
// Default serverless limit is too low and caused Googlebot 504s on cold regenerations.
export const maxDuration = 60

interface YouTubeVideo {
  id: string
  publishedAt: string
}

interface AuthorNode {
  slug: string
}

// Game slugs that 301 to a canonical hub (see redirects() in next.config.js).
// WP auto-creates tags for these via the IGDB search bar, so without this filter
// the sitemap would list URLs that redirect. Keep in sync with next.config.js.
const REDIRECTED_GAME_SLUGS = new Set(['grand-theft-auto-vi', 'diablo-iv'])

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url
  const ARTICLE_PAGE_SIZE = 24

  // Fetch dynamic content
  const [videos, { posts: allPosts, total: totalPosts }, authorsData, guidesData, gameTags] = await Promise.all([
    youtubeService.getChannelUploads(50).catch(() => ({ items: [] })),
    fetchAllPosts(),
    client.query({ query: GET_ALL_AUTHORS }).catch(() => ({ data: { users: { nodes: [] } } })),
    client
      .query({ query: GET_GUIDE_CATEGORIES_AND_POSTS, variables: { first: 1 }, fetchPolicy: 'no-cache' })
      .catch(() => ({ data: { categories: { nodes: [] } } })),
    fetchAllGameTags(),
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

  // Homepage lastmod: the newest post's date, not the sitemap regeneration time —
  // a synthetic daily-churning lastmod is a false freshness signal.
  const newestPostDate = uniquePosts.reduce<string | undefined>((newest, post) => {
    const candidate = post.modified || post.date
    if (!candidate) return newest
    return !newest || candidate > newest ? candidate : newest
  }, undefined)

  // Gather all URLs
  const urls: MetadataRoute.Sitemap = [
    // Static pages
    {
      url: `${baseUrl}/`,
      ...(newestPostDate ? { lastModified: new Date(newestPostDate).toISOString() } : {}),
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
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/features`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
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
    // Dynamic posts (deduplicated). Posts with no date at all get no lastmod
    // rather than a synthetic "now".
    ...uniquePosts.map((post: WordPressPost) => {
      const postDate = post.modified || post.date
      return {
        url: `${baseUrl}/${post.slug}`,
        ...(postDate ? { lastModified: new Date(postDate).toISOString() } : {}),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }
    }),
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
    // Game hub pages: only include hubs that have at least one related article,
    // and never slugs that 301 to a canonical hub.
    ...gameTags.filter((tag) => tag.hasPosts && !REDIRECTED_GAME_SLUGS.has(tag.slug)).map((tag) => ({
      url: `${baseUrl}/game/${tag.slug}`,
      changeFrequency: 'weekly' as const,
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
