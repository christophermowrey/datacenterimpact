import { notFound } from 'next/navigation'
import Home from '@/app/page'
import { mapTechnologies, type MapTechnologyKey } from '@/lib/map-technologies'

export function generateStaticParams() {
  return Object.keys(mapTechnologies).map((technology) => ({ technology }))
}

export default async function MapTechnologyHome({ params }: { params: Promise<{ technology: string }> }) {
  const { technology } = await params
  if (!(technology in mapTechnologies)) notFound()
  return <Home technology={technology as MapTechnologyKey} />
}
