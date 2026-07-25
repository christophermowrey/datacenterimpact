import { notFound } from 'next/navigation'
import { facilities } from '@/lib/facilities'
import FacilityDetail from '@/components/FacilityDetail'

export default async function FacilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const facility = facilities.find((item) => item.slug === slug)
  if (!facility || !['published', 'demo'].includes(facility.publicationStatus)) notFound()
  return <FacilityDetail facility={facility} />
}
