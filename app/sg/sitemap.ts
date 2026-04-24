import type { MetadataRoute } from 'next'

const SG_ORIGIN = 'https://sg.proactivsports.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SG_ORIGIN}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    // Location
    { url: `${SG_ORIGIN}/katong-point/`, changeFrequency: 'monthly', priority: 0.9 },
    // Weekly classes pillar
    { url: `${SG_ORIGIN}/weekly-classes/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SG_ORIGIN}/weekly-classes/movement/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SG_ORIGIN}/weekly-classes/sports-multiball/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SG_ORIGIN}/weekly-classes/climbing/`, changeFrequency: 'monthly', priority: 0.7 },
    // Prodigy camps pillar
    { url: `${SG_ORIGIN}/prodigy-camps/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SG_ORIGIN}/prodigy-camps/themed/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SG_ORIGIN}/prodigy-camps/multi-activity/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SG_ORIGIN}/prodigy-camps/gymnastics/`, changeFrequency: 'monthly', priority: 0.7 },
    // Supporting content
    { url: `${SG_ORIGIN}/birthday-parties/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SG_ORIGIN}/school-partnerships/`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SG_ORIGIN}/events/`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SG_ORIGIN}/coaches/`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SG_ORIGIN}/blog/`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SG_ORIGIN}/faq/`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SG_ORIGIN}/book-a-trial/`, changeFrequency: 'weekly', priority: 0.6 },
  ]
}
