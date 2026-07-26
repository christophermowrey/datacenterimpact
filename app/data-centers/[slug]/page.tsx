import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { facilities } from '@/lib/facilities'
import FacilityDetail from '@/components/FacilityDetail'

export default async function FacilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const facility = facilities.find((item) => item.slug === slug)
  if (!facility || !['published', 'demo'].includes(facility.publicationStatus)) notFound()
  return <FacilityDetail facility={facility} />
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const facility = facilities.find((item) => item.slug === slug)
  if (!facility || !['published', 'demo'].includes(facility.publicationStatus)) return {}
  return {
    title: `${facility.name} | Data Center Impact`,
    description: `${facility.statusLabel} ${facility.classLabel.toLowerCase()} profile in ${facility.city}, ${facility.county} County, with sources, limitations, and a Community Impact screening range.`,
    alternates: { canonical: `/data-centers/${facility.slug}` },
    openGraph: { title: `${facility.name} | Data Center Impact`, description: facility.summary, type: 'article' },
  }
}
