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

  try {
    // Fetch your dynamic content with error handling
    const [videos, articlesData, techData, reviewsData] = await Promise.allSettled([
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
      ...(videos.status === 'fulfilled' && videos.value?.items
        ? videos.value.items.map((video: YouTubeVideo) => ({
            url: `${baseUrl}/videos/${video.id}`,
            lastModified: new Date(video.publishedAt).toISOString(),
            changeFrequency: 'monthly',
            priority: 0.8,
          }))
        : []),
      // Dynamic articles
      ...(articlesData.status === 'fulfilled' && articlesData.value?.data?.posts?.nodes
        ? articlesData.value.data.posts.nodes.map((post: WordPressPost) => ({
            url: `${baseUrl}/${post.slug}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.7,
          }))
        : []),
      // Dynamic tech articles
      ...(techData.status === 'fulfilled' && techData.value?.data?.posts?.nodes
        ? techData.value.data.posts.nodes.map((post: WordPressPost) => ({
            url: `${baseUrl}/${post.slug}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.7,
          }))
        : []),
      // Dynamic reviews
      ...(reviewsData.status === 'fulfilled' && reviewsData.value?.data?.posts?.nodes
        ? reviewsData.value.data.posts.nodes.map((post: WordPressPost) => ({
            url: `${baseUrl}/${post.slug}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.7,
          }))
        : []),
    ]

    return urls
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static URLs if there's an error
    return [
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
    ]
  }
}
