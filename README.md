# Gridline Houston

A map-first public MVP for exploring data centers across Harris and Fort Bend counties. The current milestone is a polished, self-contained demo with five clearly labeled sample records. It is not a verified public inventory. The `35+` market figure in the UI is a changing directory estimate, not the number of records currently published here.

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

## Product boundaries

- Sample facilities are intentionally labeled demo data and must be replaced by reviewed records before launch.
- Address search uses a server-side, Texas-biased Nominatim adapter for local development. Suggestions are not stored as leads yet. Production work must add rate limiting, minimized IP handling, restricted lead storage, a compliant provider, and configurable retention before collecting residential searches.
- The map uses MapLibre and OpenStreetMap raster tiles for local development. Production must use a compliant, configurable OSM-derived tile provider rather than relying on the public OSM tile server.
- The score range is designed to remain transparent and versioned; it is not a property-value, health, or legal prediction.

## Next implementation milestone

Add PostgreSQL/PostGIS migrations and seed import, server-side geocoding, a MapLibre adapter, protected admin CRUD, and automated tests for distance, scoring, privacy, and filters. Before public AWS deployment, use a single Docker host (Lightsail 2 GB target), keep provider credentials server-side, configure cost alerts, and add encrypted nightly PostgreSQL dumps to separate S3 storage with a tested restore procedure.

## Environment

Copy `.env.example` to `.env.local`. Map style and geocoder settings are intentionally configurable; do not commit credentials.
