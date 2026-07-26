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

Docker is optional. Create a local environment file before starting Compose. It is ignored by Git and must contain a local-only database password.

```bash
copy .env.example .env.local
# Edit .env.local and set POSTGRES_PASSWORD to a local-only value.
docker compose --env-file .env.local up --build
```

Open `http://localhost:3000`. Stop it with `Ctrl+C`, or use `docker compose --env-file .env.local down` from another terminal.

Other commands: `npm run build`, `npm start`, and `npm test`.

Local health check: `http://localhost:3000/api/health`.

## Product boundaries

- Sample facilities are intentionally labeled demo data and must be replaced by reviewed records before launch.
- Address search uses a server-side, Texas-biased Nominatim adapter for local development. Rate limits and request timeouts are enabled. Search storage is disabled by default; do not enable it until the privacy, access, retention, encryption, and deletion controls are complete.
- If `GOOGLE_MAPS_API_KEY` is configured, Google Places Autocomplete and place confirmation are used first; OSM/Nominatim remains the local fallback. Google keys must be restricted and never committed.
- The map uses MapLibre and OpenStreetMap raster tiles for local development. Production map-tile provider configuration remains the final launch gate and must use a compliant, configurable OSM-derived provider rather than relying on the public OSM tile server.
- The open-source map is also available at `/open-map`.
- The score range is designed to remain transparent and versioned; it is not a property-value, health, or legal prediction.

## Public deployment status

The repository includes PolyForm licensing, contributor ownership terms, security headers, endpoint rate limiting, Caddy HTTPS scaffolding, and an AWS beginner runbook. Before public AWS deployment, use a single Docker host (Lightsail 2 GB target), keep provider credentials server-side, configure cost alerts, complete the production tile-provider choice, and add encrypted nightly PostgreSQL dumps to separate S3 storage with a tested restore procedure.

## Environment

Copy `.env.example` to `.env.local`. Map style and geocoder settings are intentionally configurable; do not commit credentials.
