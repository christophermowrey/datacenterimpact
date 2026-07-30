# Technology Review

This is a technical review for Data Center Impact, not public product copy. The central conclusion is that **map rendering and address search must remain separate decisions**. A map library can display custom facility pins very well and still provide no address autocomplete at all.

## Executive Recommendation

Keep **MapLibre GL JS** as the map renderer.

Use a provider-agnostic server-side geocoding interface with:

1. A high-quality primary address provider for residential autocomplete.
2. A documented fallback for exact-address resolution.
3. A normalized internal result format so the UI does not depend on provider-specific fields.
4. Explicit confidence and precision states so a street, ZIP centroid, municipality, and exact home address are never presented as equivalent.

MapLibre is not the reason the current autocomplete has been inconsistent. MapLibre renders the map after coordinates have been obtained. The current address-quality problem belongs to the geocoder pipeline: Nominatim/OpenStreetMap search is useful but not a complete residential address autocomplete service.

## Our Actual Requirements

### Custom facility pins

The application needs to display:

- Built, construction, announced, and additional facility records.
- Custom visual status markers.
- Selected-state markers and a searched-address marker.
- Clickable markers with accessible labels.
- Facility cards and links to detail pages.
- Future layers such as community reports, power plants, fiber routes, watersheds, land, heat, and light pollution.
- Approximate or candidate locations without implying parcel-level precision.

MapLibre supports this directly. The current implementation creates accessible DOM-backed custom markers with `maplibregl.Marker`, changes their classes for status and selection, and flies to selected facilities. For a larger inventory, we should eventually move the facility layer from one DOM marker per record to a GeoJSON source with symbol/circle layers. That would improve performance while preserving custom styling and click interaction.

### Residential address search

The user expectation is stronger than “find a nearby street.” They expect:

- Partial address input to produce a plausible exact address.
- City, state, and ZIP completion.
- Residential addresses to rank above street or neighborhood features.
- A first suggestion that can be accepted with Enter.
- Clicking a suggestion to immediately run the search.
- Clear handling when the result is only approximate.
- No accidental search for the wrong state or a similarly named road.

This is primarily a geocoder and autocomplete-provider requirement, not a map-library requirement.

### Privacy and operational boundaries

Residential searches should remain server-side. Provider keys must not reach the browser. Search storage is currently disabled, which should remain the default until retention, deletion, access control, and privacy notices are complete.

Any hosted provider also introduces:

- Per-request cost or quotas.
- Provider terms for residential search and storing results.
- Attribution requirements.
- Vendor outage and rate-limit behavior.
- Possible restrictions on displaying or caching normalized addresses.

## Map Renderer Comparison

| Technology | Custom pins and layers | Residential search | Performance and scale | Lock-in / cost | Assessment for this project | Observed site/reference |
| --- | --- | --- | --- | --- | --- | --- |
| **MapLibre GL JS** | Excellent. DOM markers, GeoJSON layers, vector styling, popups, custom controls, and WebGL rendering. | None built in. Must connect a separate geocoder. | Strong for vector layers and interactive maps. | Open-source renderer. Tile/style hosting and geocoding are separate costs and terms. | **Recommended. Current implementation.** Best balance of control, openness, and future layers. | **Data Center Impact** uses MapLibre GL JS. |
| **Leaflet** | Excellent for simple DOM markers, raster layers, and plugins. | None built in. Requires a separate provider. | Very good for modest marker counts; more manual work for large vector datasets. | Open-source and familiar. Plugin/provider choices vary. | Good simple fallback. Brockovich uses Leaflet successfully, but our future layer needs are broader. | **Brockovich Data Center Reporting** uses Leaflet 1.9.4, Leaflet.heat, and Carto-hosted basemap resources. |
| **Mapbox GL JS** | Excellent vector maps, symbols, sources, interactions, and tooling. | Usually paired with Mapbox Search. | Strong and mature. | More proprietary platform coupling, pricing, and account dependency. | Technically capable, but less aligned with our lock-in and licensing goals. | No confirmed use documented in the reviewed sites. |
| **Google Maps JavaScript API** | Good markers, overlays, controls, and familiar map behavior. | Strong when paired with Google Places. | Mature global address/place coverage. | Strong provider coupling, API billing, display/storage terms, and less control over basemap styling. | Strong address-first option, but the renderer is not necessary if we keep MapLibre. | No confirmed use documented in the reviewed sites. |
| **OpenLayers** | Excellent GIS layers, projections, vector sources, and standards-heavy work. | None built in. Requires a separate provider. | Strong for complex GIS applications. | Open-source; more application complexity than we currently need. | Viable if analysis/GIS requirements become dominant. Not the smallest fit today. | No confirmed use documented in the reviewed sites. |
| **ArcGIS Maps SDK** | Excellent hosted GIS layers, analysis, feature services, and government data integration. | Strong when paired with ArcGIS World Geocoding. | Strong platform and GIS ecosystem. | Platform commitment, service quotas, and licensing/terms review. | Useful provider and data ecosystem; heavier than needed as our primary renderer. | ArcGIS Experience was observed as the source application for one downloaded public dataset; the primary map SDK for the reviewed sites is not confirmed. |

### Where MapLibre fits

MapLibre is the rendering layer currently used in `components/MapView.tsx`. It is responsible for:

- Creating the interactive map.
- Loading either a configured vector style or the local raster fallback.
- Showing navigation and geolocation controls.
- Positioning facility and searched-location markers.
- Flying to selected facilities or searched coordinates.
- Displaying attribution.

It is **not** responsible for:

- Understanding a typed street address.
- Completing a city, state, or ZIP.
- Deciding whether a result is an exact house or merely a road.
- Resolving ambiguous residential locations.
- Storing or protecting address searches.

Changing from MapLibre to Leaflet would not solve the address problem. Changing from MapLibre to Google Maps could improve address search only because Google Places would replace the geocoder, not because Google’s map canvas is intrinsically better at custom pins.

### What the reviewed sites establish

- Brockovich is the only reviewed comparison site for which the map implementation was directly documented: Leaflet 1.9.4, Leaflet.heat, and Carto basemap resources.
- Data Center Impact is confirmed to use MapLibre GL JS.
- Data Center Map and Baxtel were reviewed as data-center directories and discovery sources. Their underlying map renderer and autocomplete provider were not confirmed in this review.
- The Texas Comptroller list is a government data source, not a comparable interactive map product.
- An ArcGIS Experience application was observed as a public source for downloaded research data, but that does not establish that every related site or source uses the ArcGIS Maps SDK.

## Address Provider Comparison

| Provider | Exact residential coverage | Autocomplete quality | Customization | Privacy/cost considerations | Role to consider |
| --- | --- | --- | --- | --- | --- |
| **Nominatim / OpenStreetMap** | Uneven. Excellent where OSM has address points; incomplete where it does not. | Search-oriented rather than polished typeahead. Can return a road when the user expects a house. | High control over request flow; self-hosting is possible. | Public endpoint has strict usage expectations. Public Nominatim is not a production-scale service we control. | Local fallback, discovery, and transparent open-data option. |
| **Google Places / Geocoding** | Generally strong for U.S. residential addresses and place disambiguation. | Strong consumer autocomplete and place ranking. | Good search controls, less control over provider ecosystem. | Requires restricted key, billing, quotas, and review of Places storage/display terms. | Strong primary provider when address success is the top priority. |
| **ArcGIS World Geocoding** | Strong U.S. address candidate coverage; recently demonstrated better exact-address recovery than Nominatim for a partial input. | Candidate search is useful, though not the same consumer UX as Google Places. | Good server-side candidate controls and address metadata. | Public service terms, quotas, attribution, and production suitability must be confirmed. | Precision fallback or possible primary provider after review. |
| **Amazon Location Service** | Hosted commercial geocoder intended for AWS deployments. | Depends on the configured Places provider and integration. | Good fit for server-side AWS architecture. | Usage-based cost, AWS account, data retention/storage mode, and provider terms. | Strong production candidate for an AWS-first deployment. |
| **Self-hosted Pelias/Nominatim** | Depends on imported data, update cadence, and tuning. | Full control, but ranking and operations become our responsibility. | Maximum control and privacy. | Significant disk, RAM, imports, monitoring, and maintenance. | Later option if traffic or privacy needs justify the operational cost. |

## Current Autocomplete Process

The current browser and server flow is:

1. The user types at least three characters.
2. The browser waits 280 milliseconds after the last keystroke.
3. A previous request is aborted when new text arrives.
4. The browser calls `/api/geocode/suggest`.
5. The server applies a request rate limit and selects the configured provider.
6. Google mode uses Places Autocomplete and then server-side Place Details when coordinates are not included.
7. Nominatim mode uses a U.S.-filtered search with a Houston-area preference box.
8. Address-like queries without a state receive a Texas bias.
9. If Nominatim returns only a road or locality, ArcGIS World Geocoding is used as an exact-address fallback.
10. The first suggestion is now accepted automatically when the user presses Enter.
11. Clicking a suggestion immediately applies the resolved location and updates the map.
12. Direct `/api/geocode` searches use the same provider and precision logic.

The important distinction is between a **candidate** and a **confirmed location**. A candidate should not update the map until it has coordinates and a precision classification. A road result should not be silently treated as the user’s home.

## Recommended Address UX

The input should eventually show provider-independent result labels with a precision cue:

- Exact address: `Address, City, State ZIP`
- Street or road: `Street name, City, State`
- ZIP centroid: `ZIP code area`
- Municipality: `City, State`
- Outside coverage: clearly labeled, not silently rejected

The first result should be a real address candidate whenever the input contains a house number. If no exact candidate is available, the interface should say that it found a street or approximate area and ask the user to add city or ZIP rather than pretending the result is exact.

## Competitors and Related Sites Reviewed

These are the sites and sources already documented in the repository:

### Brockovich Data Center Reporting

URL: <https://brockovichdatacenter.com/>

This is the strongest communications and advocacy reference. It uses Leaflet, Leaflet.heat, and Carto-hosted basemap resources. Its map has hard-coded marker data, lifecycle layers, a community-report heat layer, and a visible legend. It does not provide the address-first, normalized local impact workflow we are building.

Useful lessons:

- Stronger emotional framing and plain-language education.
- Separate content paths for map, statistics, legislation, news, FAQs, facts and myths, noise, and reporting.
- Community reporting and heat visualization.

What not to copy:

- Hard-coded inventory as the source of truth.
- Mixing community reports and facility facts without distinct evidence states.
- Treating heat maps as measured health or property-risk maps.

### Data Center Map

URL: <https://www.datacentermap.com/usa/texas/houston/>

This was reviewed as a high-value discovery and address source. It is a business directory, not our evidence model. It may separate campuses, operators, buildings, and phases differently from other sources. We should preserve it as a cited source record rather than treating its count as the complete market inventory.

### Baxtel

URL: <https://baxtel.com/data-center/houston>

This was reviewed as another high-value data-center discovery source. The Houston market page provides facility and provider listings, including construction context, but it is still a directory with its own boundaries and normalization choices. It should inform research, not replace our source-backed inventory.

### Texas Comptroller data-center list

URL: <https://comptroller.texas.gov/economy/local/ch313/data-centers.php>

This is a government/source reference useful for qualifying large facilities and projects. It is not a complete colocation or residential-impact directory, but it can strengthen lifecycle, tax, and project evidence.

### Other reference sources

The project also uses ERCOT, CenterPoint Energy, EPA air-dispersion material, ISO 9613-2, FTA noise/vibration material, Uptime Institute water-use research, operator pages, permits, and reputable reporting. These are evidence and methodology references rather than direct product competitors.

## Decision to Review

The current recommendation is:

- Keep MapLibre GL JS for rendering and custom pins.
- Keep the map data model provider-independent.
- Treat Google Places, ArcGIS, Amazon Location, and self-hosted options as replaceable geocoding providers.
- Do not expect a renderer change to fix address quality.
- Select a production geocoder based on residential accuracy, terms, cost, privacy, and Houston-area test results.
- Build a small provider benchmark using anonymized or synthetic address cases covering exact homes, partial addresses, street-only inputs, ZIP codes, neighborhoods, ambiguous street names, and out-of-area locations.

The benchmark should measure first-result exactness, correct city/state/ZIP, precision classification, response time, failure behavior, cost, and whether results may legally be cached or displayed.

## Open Questions

- Confirm ArcGIS public geocoder terms, quotas, attribution, and production suitability.
- Decide whether Google, ArcGIS, Amazon Location, or another hosted provider is the primary production geocoder.
- Add browser-level tests for keyboard selection, first-suggestion Enter behavior, provider failures, and exact-address fallback.
- Decide whether facility pins should remain DOM markers or move to GeoJSON layers as the inventory grows.
- Confirm the production vector style/tile provider separately from the geocoder decision.
