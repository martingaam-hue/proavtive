import type { MetadataRoute } from 'next'

const ROOT_ORIGIN = 'https://proactivsports.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${ROOT_ORIGIN}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${ROOT_ORIGIN}/brand/`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${ROOT_ORIGIN}/coaching-philosophy/`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${ROOT_ORIGIN}/news/`,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${ROOT_ORIGIN}/careers/`,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${ROOT_ORIGIN}/contact/`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${ROOT_ORIGIN}/privacy/`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${ROOT_ORIGIN}/terms/`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
