'use client'

import { useEffect, useRef, useState } from 'react'
import type { Facility } from '@/lib/facilities'
import type { SearchedLocation } from '@/components/MapView'
import type { MapTechnologyKey } from '@/lib/map-technologies'

type Props = { technology: Exclude<MapTechnologyKey, 'maplibre'>; facilities: Facility[]; selected: Facility | null; onSelect: (facility: Facility) => void; searchedLocation: SearchedLocation | null }

const labels: Record<Props['technology'], string> = { leaflet: 'Leaflet', mapbox: 'Mapbox GL JS', google: 'Google Maps', openlayers: 'OpenLayers', arcgis: 'ArcGIS Maps SDK' }

export default function TechnologyMap({ technology, facilities, selected, onSelect, searchedLocation }: Props) {
  const mapElement = useRef<HTMLDivElement>(null)
  const [error, setError] = useState('')
  const selectedFacility = selected ?? facilities[0]

  useEffect(() => {
    let cleanup: () => void = () => undefined
    let cancelled = false
    setError('')

    async function createMap() {
      if (!mapElement.current) return
      try {
        if (technology === 'leaflet') {
          const leaflet = await import('leaflet')
          if (cancelled || !mapElement.current) return
          const map = leaflet.map(mapElement.current).setView(searchedLocation ? [searchedLocation.latitude, searchedLocation.longitude] : [29.78, -95.55], searchedLocation ? 13 : 9)
          leaflet.tileLayer(process.env.NEXT_PUBLIC_OSM_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(map)
          facilities.forEach((facility) => leaflet.marker([facility.latitude, facility.longitude], { icon: leaflet.divIcon({ className: `technology-leaflet-pin ${facility.status}`, html: facility.status === 'operational' ? '●' : facility.status === 'construction' ? '◆' : '○' }) }).addTo(map).on('click', () => onSelect(facility)))
          if (searchedLocation) leaflet.circleMarker([searchedLocation.latitude, searchedLocation.longitude], { color: '#2f855a', radius: 8 }).addTo(map)
          cleanup = () => map.remove()
          return
        }

        if (technology === 'openlayers') {
          const [{ default: OlMap }, { default: View }, { default: TileLayer }, { default: VectorLayer }, { default: OSM }, { default: VectorSource }, { default: Feature }, { default: Point }, { fromLonLat }, { default: OlStyle }, { default: CircleStyle }, { default: Fill }, { default: Stroke }] = await Promise.all([import('ol/Map'), import('ol/View'), import('ol/layer/Tile'), import('ol/layer/Vector'), import('ol/source/OSM'), import('ol/source/Vector'), import('ol/Feature'), import('ol/geom/Point'), import('ol/proj'), import('ol/style/Style'), import('ol/style/Circle'), import('ol/style/Fill'), import('ol/style/Stroke')])
          if (cancelled || !mapElement.current) return
          const source = new VectorSource()
          facilities.forEach((facility) => source.addFeature(new Feature({ geometry: new Point(fromLonLat([facility.longitude, facility.latitude])), facility })))
          const layer = new VectorLayer({ source, style: new OlStyle({ image: new CircleStyle({ radius: 8, fill: new Fill({ color: '#bd3030' }), stroke: new Stroke({ color: '#fff', width: 2 }) }) }) })
          const map = new OlMap({ target: mapElement.current, layers: [new TileLayer({ source: new OSM() }), layer], view: new View({ center: fromLonLat(searchedLocation ? [searchedLocation.longitude, searchedLocation.latitude] : [-95.55, 29.78]), zoom: searchedLocation ? 13 : 9 }) })
          map.on('click', (event) => map.forEachFeatureAtPixel(event.pixel, (feature) => { const facility = feature.get('facility') as Facility | undefined; if (facility) onSelect(facility) }))
          cleanup = () => map.setTarget(undefined)
          return
        }

        if (technology === 'mapbox') {
          const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
          if (!token) { setError('Add NEXT_PUBLIC_MAPBOX_TOKEN to load Mapbox GL JS.'); return }
          const mapbox = (await import('mapbox-gl')).default
          if (cancelled || !mapElement.current) return
          mapbox.accessToken = token
          const map = new mapbox.Map({ container: mapElement.current, style: 'mapbox://styles/mapbox/streets-v12', center: searchedLocation ? [searchedLocation.longitude, searchedLocation.latitude] : [-95.55, 29.78], zoom: searchedLocation ? 13 : 9 })
          facilities.forEach((facility) => { const element = document.createElement('button'); element.className = `technology-mapbox-pin ${facility.status}`; element.type = 'button'; element.textContent = '●'; element.ariaLabel = `Select ${facility.name}`; element.onclick = () => onSelect(facility); new mapbox.Marker({ element }).setLngLat([facility.longitude, facility.latitude]).addTo(map) })
          cleanup = () => map.remove()
          return
        }

        if (technology === 'google') {
          const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          if (!key) { setError('Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to load Google Maps.'); return }
          const googleLoader = await import('@googlemaps/js-api-loader')
          googleLoader.setOptions({ key, v: 'weekly' })
          const google = await googleLoader.importLibrary('maps') as unknown as { Map: new (element: HTMLElement, options: object) => { [key: string]: unknown } }
          const markerLibrary = await googleLoader.importLibrary('marker') as unknown as { AdvancedMarkerElement: new (options: object) => { addListener: (event: string, callback: () => void) => void } }
          if (cancelled || !mapElement.current) return
          const map = new google.Map(mapElement.current, { center: searchedLocation ? { lat: searchedLocation.latitude, lng: searchedLocation.longitude } : { lat: 29.78, lng: -95.55 }, zoom: searchedLocation ? 13 : 9, mapTypeControl: false, streetViewControl: false, mapId: 'DEMO_MAP_ID' })
          facilities.forEach((facility) => new markerLibrary.AdvancedMarkerElement({ map, position: { lat: facility.latitude, lng: facility.longitude }, title: facility.name }).addListener('click', () => onSelect(facility)))
          cleanup = () => { mapElement.current?.replaceChildren() }
          return
        }

        const [{ default: ArcGISMap }, { default: ArcGISMapView }, { default: GraphicsLayer }, { default: Graphic }, { default: ArcGISPoint }, { default: SimpleMarkerSymbol }] = await Promise.all([import('@arcgis/core/Map'), import('@arcgis/core/views/MapView'), import('@arcgis/core/layers/GraphicsLayer'), import('@arcgis/core/Graphic'), import('@arcgis/core/geometry/Point'), import('@arcgis/core/symbols/SimpleMarkerSymbol')])
        if (cancelled || !mapElement.current) return
        const layer = new GraphicsLayer()
        const map = new ArcGISMap({ basemap: 'streets-vector', layers: [layer] })
        const view = new ArcGISMapView({ container: mapElement.current, map, center: searchedLocation ? [searchedLocation.longitude, searchedLocation.latitude] : [-95.55, 29.78], zoom: searchedLocation ? 13 : 9 })
        facilities.forEach((facility) => layer.add(new Graphic({ geometry: new ArcGISPoint({ longitude: facility.longitude, latitude: facility.latitude }), attributes: { slug: facility.slug }, symbol: new SimpleMarkerSymbol({ color: '#bd3030', outline: { color: '#fff', width: 2 }, size: 12 }) })))
        view.on('click', async (event) => { const hit = await view.hitTest(event); const graphic = hit.results.find((result) => 'graphic' in result)?.graphic as { attributes?: { slug?: string } } | undefined; const facility = facilities.find((item) => item.slug === graphic?.attributes?.slug); if (facility) onSelect(facility) })
        cleanup = () => view.destroy()
      } catch (caught) {
        if (!cancelled) setError(caught instanceof Error ? caught.message : 'This map technology could not be loaded.')
      }
    }

    createMap()
    return () => { cancelled = true; cleanup() }
  }, [technology, searchedLocation])

  return <div className="map-frame technology-home-map"><div ref={mapElement} className="map technology-real-map" aria-label={`${labels[technology]} map`} role="application">{error && <div className="technology-map-error"><strong>{labels[technology]} is ready for credentials.</strong><small>{error}</small></div>}{selectedFacility && <div className="map-card"><div className="card-kicker"><span className={`dot ${selectedFacility.color}`} />{selectedFacility.statusLabel}<span className="card-distance">{selectedFacility.distanceLabel ?? 'Distance pending'}</span></div><h3>{selectedFacility.name}</h3><p>{selectedFacility.city}, {selectedFacility.county} County · {selectedFacility.classLabel}</p></div>}</div><div className="map-footer"><div className="map-legend"><strong>Map key</strong><span><i className="legend-marker built">●</i> Built</span><span><i className="legend-marker construction">◆</i> Under construction</span><span><i className="legend-marker announced">○</i> Announced</span></div><div className="map-attribution">{labels[technology]}</div></div></div>
}
