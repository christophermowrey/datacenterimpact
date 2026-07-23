'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { Facility } from '@/lib/facilities'

type MapViewProps = { facilities: Facility[]; selected: Facility | null; onSelect: (facility: Facility) => void }

export default function MapView({ facilities, selected, onSelect }: MapViewProps) {
  const mapElement = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import('maplibre-gl').Map | null>(null)
  const markersRef = useRef<import('maplibre-gl').Marker[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let disposed = false
    async function createMap() {
      const maplibregl = await import('maplibre-gl')
      if (disposed || !mapElement.current) return
      const map = new maplibregl.Map({
        container: mapElement.current,
        center: [-95.55, 29.78],
        zoom: 9.2,
        minZoom: 7,
        maxZoom: 16,
        style: {
          version: 8,
          sources: { osm: { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, attribution: '© OpenStreetMap contributors' } },
          layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
        },
        cooperativeGestures: false,
      })
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
      map.addControl(new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: false }), 'top-right')
      mapRef.current = map
      setReady(true)
    }
    createMap()
    return () => { disposed = true; mapRef.current?.remove(); mapRef.current = null }
  }, [])

  useEffect(() => {
    if (!ready || !mapRef.current) return
    let active = true
    import('maplibre-gl').then((maplibregl) => {
      if (!active || !mapRef.current) return
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = facilities.map((facility) => {
        const element = document.createElement('button')
        element.type = 'button'
        element.className = `map-pin ${facility.status} ${selected?.slug === facility.slug ? 'selected' : ''}`
        element.setAttribute('aria-label', `Select ${facility.name}`)
        element.innerHTML = `<span>${facility.status === 'operational' ? '●' : facility.status === 'construction' ? '◆' : '○'}</span>`
        element.addEventListener('click', () => onSelect(facility))
        return new maplibregl.Marker({ element, anchor: 'center' }).setLngLat([facility.longitude, facility.latitude]).addTo(mapRef.current!)
      })
    })
    return () => { active = false }
  }, [facilities, selected, onSelect, ready])

  return <div className="map" aria-label="Interactive map of Greater Houston data centers" role="application"><div ref={mapElement} className="maplibre-canvas" />{selected && <div className="map-card"><div className="card-kicker"><span className={`dot ${selected.color}`} />{selected.statusLabel}<span className="card-distance">{selected.distance} mi away</span></div><h3>{selected.name}</h3><p>{selected.city}, {selected.county} County · {selected.classLabel}</p><div className="card-footer"><span className="confidence">{selected.confidence} confidence</span><Link href={`/data-centers/${selected.slug}`}>View full details <span>→</span></Link></div></div>}</div>
}
