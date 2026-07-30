export const mapTechnologies = {
  maplibre: { name: 'MapLibre GL JS', label: 'Current production map', status: 'Live renderer' },
  leaflet: { name: 'Leaflet', label: 'Leaflet comparison', status: 'Prototype adapter' },
  mapbox: { name: 'Mapbox GL JS', label: 'Mapbox comparison', status: 'Prototype adapter' },
  google: { name: 'Google Maps', label: 'Google Maps comparison', status: 'Prototype adapter' },
  openlayers: { name: 'OpenLayers', label: 'OpenLayers comparison', status: 'Prototype adapter' },
  arcgis: { name: 'ArcGIS Maps SDK', label: 'ArcGIS comparison', status: 'Prototype adapter' },
} as const

export type MapTechnologyKey = keyof typeof mapTechnologies
