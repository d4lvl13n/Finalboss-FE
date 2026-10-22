import { MetadataRoute } from 'next'
import siteConfig from './lib/siteConfig'
import { blockedCollectors } from '../cloudflare/bot-policy'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url

  return {
    rules: [{
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/private/'],
    }, ...blockedCollectors.map(userAgent => ({ userAgent, disallow: '/' }))],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/game/sitemap.xml`,
      `${baseUrl}/gaming-laptops/sitemap.xml`,
      `${baseUrl}/handhelds/sitemap.xml`,
    ],
  }
}
