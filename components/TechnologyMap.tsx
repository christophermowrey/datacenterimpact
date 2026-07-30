'use client'

import { useState } from 'react'
import type { Facility } from '@/lib/facilities'
import type { SearchedLocation } from '@/components/MapView'
import type { MapTechnologyKey } from '@/lib/map-technologies'

type Props = { technology: MapTechnologyKey; facilities: Facility[]; selected: Facility | null; onSelect: (facility: Facility) => void; searchedLocation: SearchedLocation | null }

export default function TechnologyMap({ technology, facilities, selected, onSelect, searchedLocation }: Props) {
  const [active, setActive] = useState(selected?.slug ?? facilities[0]?.slug)
  const selectedFacility = facilities.find((facility) => facility.slug === active) ?? selected ?? facilities[0]
  return <div className="map-frame technology-home-map"><div className="map technology-prototype" role="application" aria-label={`${technology} map prototype`}>
    <div className="technology-prototype-grid" />
    <div className="technology-map-caption"><span>{technology === 'leaflet' ? 'Leaflet' : technology === 'mapbox' ? 'Mapbox GL JS' : technology === 'google' ? 'Google Maps' : technology === 'openlayers' ? 'OpenLayers' : 'ArcGIS Maps SDK'} prototype</span><small>Same facility inventory · renderer under review</small></div>
    {facilities.slice(0, 8).map((facility, index) => <button type="button" key={facility.slug} className={`technology-home-pin technology-home-pin-${index % 5} ${active === facility.slug ? 'selected' : ''}`} onClick={() => { setActive(facility.slug); onSelect(facility) }} aria-label={`Select ${facility.name}`}><span>{facility.status === 'operational' ? '●' : facility.status === 'construction' ? '◆' : '○'}</span></button>)}
    {searchedLocation && <div className="technology-home-address"><strong>Address Impact</strong><small>{searchedLocation.label}</small></div>}
    {selectedFacility && <div className="map-card"><div className="card-kicker"><span className={`dot ${selectedFacility.color}`} />{selectedFacility.statusLabel}<span className="card-distance">{selectedFacility.distanceLabel ?? 'Distance pending'}</span></div><h3>{selectedFacility.name}</h3><p>{selectedFacility.city}, {selectedFacility.county} County · {selectedFacility.classLabel}</p></div>}
  </div><div className="map-footer"><div className="map-legend"><strong>Map key</strong><span><i className="legend-marker built">●</i> Built</span><span><i className="legend-marker construction">◆</i> Under construction</span><span><i className="legend-marker announced">○</i> Announced</span></div><div className="map-attribution">Prototype only · compare renderer behavior</div></div></div>
}
