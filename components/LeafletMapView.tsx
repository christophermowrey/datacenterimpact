'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { Facility } from '@/lib/facilities'
import type { SearchedLocation } from '@/components/MapView'

type Props = { facilities: Facility[]; selected: Facility | null; onSelect: (facility: Facility) => void; searchedLocation: SearchedLocation | null }

export default function LeafletMapView({ facilities, selected, onSelect, searchedLocation }: Props) {
  const mapElement = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import('leaflet').Map | null>(null)
  const markersRef = useRef(new Map<string, import('leaflet').Marker>())
  const searchedMarkerRef = useRef<import('leaflet').Marker | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let disposed = false
    async function createMap() {
      const leaflet = await import('leaflet')
      if (disposed || !mapElement.current) return
      const map = leaflet.map(mapElement.current, { minZoom: 7, maxZoom: 16 }).setView([29.78, -95.55], 9.2)
      leaflet.tileLayer(process.env.NEXT_PUBLIC_OSM_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', maxZoom: 19 }).addTo(map)
      mapRef.current = map
      setReady(true)
    }
    createMap()
    return () => { disposed = true; markersRef.current.clear(); mapRef.current?.remove(); mapRef.current = null }
  }, [])

  useEffect(() => {
    if (!ready || !mapRef.current) return
    if (selected) mapRef.current.flyTo([selected.latitude, selected.longitude], Math.max(mapRef.current.getZoom(), 12), { duration: 0.7 })
    else if (searchedLocation) mapRef.current.flyTo([searchedLocation.latitude, searchedLocation.longitude], 13, { duration: 0.7 })
  }, [ready, selected, searchedLocation])

  useEffect(() => {
    if (!ready || !mapRef.current) return
    let active = true
    import('leaflet').then((leaflet) => {
      if (!active || !mapRef.current) return
      const visibleSlugs = new Set(facilities.map((facility) => facility.slug))
      markersRef.current.forEach((marker, slug) => { if (!visibleSlugs.has(slug)) { marker.remove(); markersRef.current.delete(slug) } })
      facilities.forEach((facility) => {
        const html = `<button type="button" class="map-pin ${facility.status} ${selected?.slug === facility.slug ? 'selected' : ''}" aria-label="Select ${facility.name}"><span>${facility.status === 'operational' ? '●' : facility.status === 'construction' ? '◆' : '○'}</span></button>`
        const icon = leaflet.divIcon({ className: 'facility-marker', html, iconSize: [75, 75], iconAnchor: [37.5, 37.5] })
        const existing = markersRef.current.get(facility.slug)
        if (existing) { existing.setIcon(icon); existing.setLatLng([facility.latitude, facility.longitude]); return }
        const marker = leaflet.marker([facility.latitude, facility.longitude], { icon }).addTo(mapRef.current!)
        marker.on('click', () => { onSelect(facility); mapRef.current?.flyTo([facility.latitude, facility.longitude], Math.max(mapRef.current.getZoom(), 12), { duration: 0.7 }) })
        markersRef.current.set(facility.slug, marker)
      })
    })
    return () => { active = false }
  }, [facilities, selected, onSelect, ready])

  useEffect(() => {
    if (!ready || !mapRef.current) return
    import('leaflet').then((leaflet) => {
      searchedMarkerRef.current?.remove()
      searchedMarkerRef.current = searchedLocation ? leaflet.marker([searchedLocation.latitude, searchedLocation.longitude], { icon: leaflet.divIcon({ className: 'searched-marker', html: '<span>●</span>', iconSize: [22, 22], iconAnchor: [11, 11] }) }).addTo(mapRef.current!) : null
    })
    return () => { searchedMarkerRef.current?.remove() }
  }, [searchedLocation, ready])

  return <div className="map-frame"><div className="map" aria-label="Interactive Leaflet map of Houston-area data centers" role="application"><div ref={mapElement} className="leaflet-map-canvas" />{searchedLocation && <div className="searched-location" aria-label={`Searched location: ${searchedLocation.label}`}><span className="address-marker-icon" aria-hidden="true">●</span><strong>Address Impact</strong><small>{searchedLocation.label}</small></div>}{selected && <div className="map-card"><div className="card-kicker"><span className={`dot ${selected.status === 'operational' ? 'green' : selected.status === 'construction' ? 'red' : selected.color}`} />{selected.status === 'operational' ? 'Built' : selected.statusLabel}<span className="card-distance">{selected.distanceLabel ?? 'Distance pending'}</span></div><h3>{selected.name}</h3><p>{selected.city}, {selected.county} County · {selected.classLabel}</p><div className="card-footer"><Link href={`/data-centers/${selected.slug}`}>View full details <span>→</span></Link></div></div>}</div><div className="map-footer"><div className="map-legend" aria-label="Map key"><strong>Map key</strong><span><i className="legend-marker built">●</i> Built</span><span><i className="legend-marker construction">◆</i> Under construction</span><span><i className="legend-marker announced">○</i> Announced</span><span><i className="legend-marker searched">●</i> Address</span></div><div className="map-attribution"><a href="https://leafletjs.com/" target="_blank" rel="noreferrer">Leaflet</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a></div></div></div>
}
