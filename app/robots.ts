import { MetadataRoute } from 'next'
import siteConfig from './lib/siteConfig'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/private/'],
    },
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/game/sitemap.xml`,
      `${baseUrl}/gaming-laptops/sitemap.xml`,
      `${baseUrl}/handhelds/sitemap.xml`,
    ],
  }
}
