import type { MetadataRoute } from 'next'
import { facilities } from '@/lib/facilities'
import { mapTechnologies } from '@/lib/map-technologies'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://datacenterimpact.app'
  const publicFacilities = facilities.filter((facility) => facility.publicationStatus === 'published' || facility.publicationStatus === 'demo')
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/calculator`, lastModified: new Date() },
    ...Object.keys(mapTechnologies).map((technology) => ({ url: `${base}/map-technology/${technology}`, lastModified: new Date() })),
    { url: `${base}/learn`, lastModified: new Date() },
    { url: `${base}/privacy`, lastModified: new Date() },
    ...publicFacilities.map((facility) => ({ url: `${base}/data-centers/${facility.slug}`, lastModified: new Date(facility.verified) })),
  ]
}
