import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://proactivsports.com/sitemap.xml',
    host: 'proactivsports.com',
  }
}
