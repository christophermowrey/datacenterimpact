import type { MetadataRoute } from 'next'
import { facilities } from '@/lib/facilities'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://datacenterimpact.app'
  const publicFacilities = facilities.filter((facility) => facility.publicationStatus === 'published' || facility.publicationStatus === 'demo')
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/learn`, lastModified: new Date() },
    { url: `${base}/privacy`, lastModified: new Date() },
    ...publicFacilities.map((facility) => ({ url: `${base}/data-centers/${facility.slug}`, lastModified: new Date(facility.verified) })),
  ]
}
