# Data Center Impact

A map-first public MVP for checking whether AI and other data centers may affect a home across the Houston area. The current milestone is a self-contained demo with source-backed and clearly labeled records. It is not yet a complete verified public inventory. Houston-area coverage is expanding to surrounding cities and regional locations.

## Run locally

Requirements: Node.js 20+.

```bash
npm install
npm run dev
```

Open `http://localhost:3000` when using Docker Compose. The service is bound to the local computer only and is not exposed to the public internet or your tailnet.

## Docker-only local run

Docker is optional. This project is intended to remain local and is not configured for GitHub Pages or a public web deployment.

```bash
docker compose up --build
```

Open `http://localhost:3000`. Stop it with `Ctrl+C`, or use `docker compose down` from another terminal.

Other commands: `npm run build`, `npm start`, and `npm test`.

Local health check: `http://localhost:3000/api/health`.

## Product boundaries

- Sample facilities are intentionally labeled demo data and must be replaced by reviewed records before launch.
- Address search uses a server-side, Texas-biased Nominatim adapter for local development. Suggestions are not stored as leads yet. Production work must add rate limiting, minimized IP handling, restricted lead storage, a compliant provider, and configurable retention before collecting residential searches.
- If `GOOGLE_MAPS_API_KEY` is configured, Google Places Autocomplete and place confirmation are used first; OSM/Nominatim remains the local fallback. Google keys must be restricted and never committed.
- The map uses MapLibre and OpenStreetMap raster tiles for local development. Production must use a compliant, configurable OSM-derived tile provider rather than relying on the public OSM tile server.
- The open-source map is also available at `/open-map`.
- The score range is designed to remain transparent and versioned; it is not a property-value, health, or legal prediction.

## Next implementation milestone

Add PostgreSQL/PostGIS migrations and seed import, server-side geocoding, a MapLibre adapter, protected admin CRUD, and automated tests for distance, scoring, privacy, and filters. Before public AWS deployment, use a single Docker host (Lightsail 2 GB target), keep provider credentials server-side, configure cost alerts, and add encrypted nightly PostgreSQL dumps to separate S3 storage with a tested restore procedure.

## Environment

Copy `.env.example` to `.env.local`. Map style and geocoder settings are intentionally configurable; do not commit credentials.
