import Link from 'next/link'
import { mapTechnologies } from '@/lib/map-technologies'

export default function MapTechnologyIndex() {
  return <main className="learn-page technology-directory">
    <header className="topbar"><Link href="/" className="brand"><span className="brand-mark">D</span><span>DATA CENTER <i>IMPACT</i></span></Link><Link href="/" className="back">← Back to map</Link></header>
    <article className="article"><p className="eyebrow">MAP TECHNOLOGY LAB</p><h1>Choose a map technology.</h1><p className="article-dek">Each option has its own home-style route so you can open them in separate browser tabs and compare the same inventory and address-first experience.</p><div className="article-meta">One route per technology · MapLibre is the current production choice</div><div className="technology-route-list">{Object.entries(mapTechnologies).map(([key, technology]) => <Link href={`/map-technology/${key}`} className="technology-route-card" key={key}><span>{technology.status}</span><strong>{technology.name}</strong><small>{technology.label} · Open comparison →</small></Link>)}</div></article>
  </main>
}
