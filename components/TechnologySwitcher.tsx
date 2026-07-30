import Link from 'next/link'
import { mapTechnologies, type MapTechnologyKey } from '@/lib/map-technologies'

export default function TechnologySwitcher({ active }: { active: MapTechnologyKey }) {
  return <nav className="technology-switcher" aria-label="Map technology demos"><span>COMPARE MAP TECHNOLOGIES</span>{Object.entries(mapTechnologies).map(([key, technology]) => <Link className={key === active ? 'active' : ''} href={`/map-technology/${key}`} key={key}>{technology.name}</Link>)}</nav>
}
