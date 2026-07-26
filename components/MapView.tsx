'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { Facility } from '@/lib/facilities'

export type SearchedLocation = { latitude: number; longitude: number; label: string; coverage?: 'supported' | 'outside' | 'unknown'; source?: 'google' | 'openstreetmap'; precision?: 'exact_address' | 'place_label' | 'municipality_boundary' | 'zip_centroid'; fallbackReason?: 'exact_address_not_found' }
type MapViewProps = { facilities: Facility[]; selected: Facility | null; onSelect: (facility: Facility) => void; searchedLocation: SearchedLocation | null }

export default function MapView({ facilities, selected, onSelect, searchedLocation }: MapViewProps) {
  const mapElement = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import('maplibre-gl').Map | null>(null)
  const markersRef = useRef(new Map<string, { marker: import('maplibre-gl').Marker; element: HTMLButtonElement }>())
  const searchedMarkerRef = useRef<import('maplibre-gl').Marker | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let disposed = false
    async function createMap() {
      const maplibregl = await import('maplibre-gl')
      if (disposed || !mapElement.current) return
      const osmFallbackStyle = {
        version: 8 as const,
        sources: { osm: { type: 'raster' as const, tiles: [process.env.NEXT_PUBLIC_OSM_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, attribution: '© OpenStreetMap contributors' } },
        layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
      }
      const configuredStyle = process.env.NEXT_PUBLIC_MAP_STYLE_URL?.trim()
      const useOsmFallback = process.env.NEXT_PUBLIC_USE_OSM_FALLBACK !== 'false'
      const style = configuredStyle || (useOsmFallback ? osmFallbackStyle : { version: 8 as const, sources: {}, layers: [{ id: 'background', type: 'background' as const, paint: { 'background-color': '#eef2ed' } }] })
      const map = new maplibregl.Map({
        container: mapElement.current,
        center: [-95.55, 29.78],
        zoom: 9.2,
        minZoom: 7,
        maxZoom: 16,
        style,
        cooperativeGestures: false,
      })
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
      map.addControl(new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: false }), 'top-right')
      map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right')
      mapRef.current = map
      setReady(true)
    }
    createMap()
    return () => { disposed = true; markersRef.current.clear(); mapRef.current?.remove(); mapRef.current = null }
  }, [])

  useEffect(() => {
    if (!ready || !mapRef.current) return
    if (selected) mapRef.current.flyTo({ center: [selected.longitude, selected.latitude], duration: 700 })
    else if (searchedLocation) mapRef.current.flyTo({ center: [searchedLocation.longitude, searchedLocation.latitude], zoom: 13, duration: 700 })
  }, [ready, selected, searchedLocation])

  useEffect(() => {
    if (!ready || !mapRef.current) return
    let active = true
    import('maplibre-gl').then((maplibregl) => {
      if (!active || !mapRef.current) return
      const visibleSlugs = new Set(facilities.map((facility) => facility.slug))
      markersRef.current.forEach(({ marker }, slug) => {
        if (!visibleSlugs.has(slug)) {
          marker.remove()
          markersRef.current.delete(slug)
        }
      })
      facilities.forEach((facility) => {
        const existing = markersRef.current.get(facility.slug)
        if (existing) {
          existing.element.className = `map-pin ${facility.status} ${selected?.slug === facility.slug ? 'selected' : ''}`
          existing.marker.setLngLat([facility.longitude, facility.latitude])
          return
        }
        const element = document.createElement('button')
        element.type = 'button'
        element.className = `map-pin ${facility.status} ${selected?.slug === facility.slug ? 'selected' : ''}`
        element.setAttribute('aria-label', `Select ${facility.name}`)
        element.innerHTML = `<span>${facility.status === 'operational' ? '●' : facility.status === 'construction' ? '◆' : '○'}</span>`
        element.addEventListener('click', () => { onSelect(facility); mapRef.current?.flyTo({ center: [facility.longitude, facility.latitude], zoom: Math.max(mapRef.current.getZoom(), 12), duration: 700 }) })
        const marker = new maplibregl.Marker({ element: Object.assign(document.createElement('div'), { className: 'map-marker' }), anchor: 'center' }).setLngLat([facility.longitude, facility.latitude]).addTo(mapRef.current!)
        marker.getElement().appendChild(element)
        markersRef.current.set(facility.slug, { marker, element })
      })
    })
    return () => { active = false }
  }, [facilities, selected, onSelect, ready])

  useEffect(() => {
    if (!ready || !mapRef.current) return
    import('maplibre-gl').then((maplibregl) => {
      searchedMarkerRef.current?.remove()
      searchedMarkerRef.current = searchedLocation
        ? new maplibregl.Marker({ color: '#e26e3e' }).setLngLat([searchedLocation.longitude, searchedLocation.latitude]).addTo(mapRef.current!)
        : null
    })
    return () => { searchedMarkerRef.current?.remove() }
  }, [searchedLocation, ready])

  return <div className="map" aria-label="Interactive map of Houston-area data centers" role="application"><div ref={mapElement} className="maplibre-canvas" /><div className="map-legend" aria-label="Map legend"><strong>Map key</strong><span><i className="legend-marker built">●</i> Built</span><span><i className="legend-marker construction">◆</i> Under construction</span><span><i className="legend-marker announced">○</i> Announced</span><span><i className="legend-marker searched">●</i> Address</span></div>{searchedLocation && <div className="searched-location" aria-label={`Searched location: ${searchedLocation.label}`}><span>⌖</span><strong>Address Impact</strong><small>{searchedLocation.label}</small></div>}{selected && <div className="map-card"><div className="card-kicker"><span className={`dot ${selected.color}`} />{selected.status === 'operational' ? 'Built' : selected.statusLabel}<span className="card-distance">{selected.distanceLabel ?? 'Distance pending'}</span></div><h3>{selected.name}</h3><p>{selected.city}, {selected.county} County · {selected.classLabel}</p><div className="card-footer"><Link href={`/data-centers/${selected.slug}`}>View full details <span>→</span></Link></div></div>}</div>
}
