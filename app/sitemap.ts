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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

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
    // Dynamic videos
    ...(videos.items?.map((video: YouTubeVideo) => ({
      url: `${baseUrl}/videos/${video.id}`,
      lastModified: new Date(video.publishedAt).toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })) || []),
    // Dynamic articles
    ...articlesData.data.posts.nodes.map((post: WordPressPost) => ({
      url: `${baseUrl}/articles/${post.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
    // Dynamic tech articles
    ...techData.data.posts.nodes.map((post: WordPressPost) => ({
      url: `${baseUrl}/technology/${post.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
    // Dynamic reviews
    ...reviewsData.data.posts.nodes.map((post: WordPressPost) => ({
      url: `${baseUrl}/reviews/${post.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
  ]

  return urls
}