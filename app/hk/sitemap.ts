import type { MetadataRoute } from 'next'

const HK_ORIGIN = 'https://hk.proactivsports.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${HK_ORIGIN}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    // Location pages
    { url: `${HK_ORIGIN}/wan-chai/`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${HK_ORIGIN}/cyberport/`, changeFrequency: 'monthly', priority: 0.9 },
    // Gymnastics pillar
    { url: `${HK_ORIGIN}/gymnastics/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${HK_ORIGIN}/gymnastics/toddlers/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${HK_ORIGIN}/gymnastics/beginner/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${HK_ORIGIN}/gymnastics/intermediate/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${HK_ORIGIN}/gymnastics/advanced/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${HK_ORIGIN}/gymnastics/competitive/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${HK_ORIGIN}/gymnastics/rhythmic/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${HK_ORIGIN}/gymnastics/adult/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${HK_ORIGIN}/gymnastics/private/`, changeFrequency: 'monthly', priority: 0.7 },
    // Supporting content
    { url: `${HK_ORIGIN}/holiday-camps/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${HK_ORIGIN}/birthday-parties/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${HK_ORIGIN}/school-partnerships/`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${HK_ORIGIN}/competitions-events/`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${HK_ORIGIN}/coaches/`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${HK_ORIGIN}/blog/`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${HK_ORIGIN}/faq/`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${HK_ORIGIN}/book-a-trial/`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${HK_ORIGIN}/book-a-trial/free-assessment/`, changeFrequency: 'weekly', priority: 0.6 },
  ]
}
