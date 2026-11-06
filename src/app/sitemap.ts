import type { MetadataRoute } from 'next'
import { config } from '@/lib/config'
import { getSite } from '@/lib/sss'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSite()
  return [
    { url: config.siteUrl, changeFrequency: 'weekly', priority: 1 },
    ...site.products.map(product => ({
      url: `${config.siteUrl}/products/${product.id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
