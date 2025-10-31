import type {MetadataRoute} from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.APP_URL ?? 'https://romyseb.ch'
  return [
    { url: `${base}/es`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/fr`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 }
  ]
}
