import type {MetadataRoute} from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.APP_URL ?? 'https://romyseb.ch'
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: [`${base}/sitemap.xml`]
  }
}
