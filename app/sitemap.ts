import type { MetadataRoute } from 'next'
import { projects } from './portfolio/projects'

export const dynamic = 'force-static'

const site = 'https://cubovirtual.com.br'

// demos em /app/ são noindex e ficam de fora
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site}/`, priority: 1 },
    { url: `${site}/portfolio/`, priority: 0.8 },
    ...projects.filter((p) => !p.soon).map((p) => ({ url: `${site}/portfolio/${p.slug}/`, priority: 0.6 })),
  ]
}
