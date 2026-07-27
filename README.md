# Data Center Impact

A noncommercial, map-first public project for checking whether AI and other data centers may affect a home across the Houston area. The current milestone is a self-contained demo with source-backed and clearly labeled records. It is not yet a complete verified public inventory. Houston-area coverage is expanding to surrounding cities and regional locations.

Inspired by works such as Upton Sinclair’s *The Jungle*, Rachel Carson’s *Silent Spring*, and Barry Commoner’s *The Closing Circle*, Data Center Impact aims to be a modern reincarnation of these landmark books, focused on present-day concerns surrounding AI data centers.

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

Local development enables the broader research inventory by default with `NEXT_PUBLIC_SHOW_CANDIDATES=true`. These candidate records are preliminary and remain disabled in the production publication layer.

Other commands: `npm run build`, `npm start`, and `npm test`.

Local health check: `http://localhost:3000/api/health`.

## Product boundaries

- Sample facilities are intentionally labeled demo data and must be replaced by reviewed records before launch.
- Address search uses a server-side, Texas-biased Nominatim adapter for local development. Rate limits and request timeouts are enabled. Search storage is disabled by default; do not enable it until the privacy, access, retention, encryption, and deletion controls are complete.
- If `GOOGLE_MAPS_API_KEY` is configured, Google Places Autocomplete and place confirmation are used first; OSM/Nominatim remains the local fallback. Google keys must be restricted and never committed.
- The map uses MapLibre and OpenStreetMap raster tiles for local development. Production map-tile provider configuration remains the final launch gate and must use a compliant, configurable OSM-derived provider rather than relying on the public OSM tile server.
- The open-source map is also available at `/open-map`.
- The score range is designed to remain transparent and versioned; it is not a property-value, health, or legal prediction.
- The impact score is currently in beta. It is a screening aid, not a final environmental, health, property-value, or legal assessment.
- Distance is not itself an impact category. It changes each category differently: water and electricity retain regional effects, air uses an atmospheric-dispersion screening proxy, and sound/vibration attenuate more quickly. The formulas and literature links are documented in `docs/IMPACT_METHODOLOGY.md`.

## Community data reporting

Every facility profile uses the same community-facing metric categories: electricity and grid, water consumption, air pollution and generation, sound, vibration, construction and traffic, and land/flood context. A metric is never silently omitted. It is reported as one of the following:

- **Reported:** a facility-specific value published by an identified source.
- **Estimated:** a reproducible calculation from reported facility inputs.
- **Proxy:** a numerical benchmark or range based on comparable equipment or facilities, explicitly not a measurement of that site.
- **Not publicly disclosed:** no defensible facility-specific value was found during review.

Metric evidence is available from the information icon on each metric card. Technical specifications such as redundancy, cooling design, carrier count, and rack density remain available below the community summary but are not substituted for community metrics. Preliminary staging candidates may contribute to a preliminary Community Impact range; production publication requires a separate review decision.

## Public deployment status

The repository includes PolyForm licensing, contributor ownership terms, security headers, endpoint rate limiting, Caddy HTTPS scaffolding, separate developer/live deployment modes, and an AWS beginner runbook. The project is currently noncommercial and uses Stadia’s noncommercial terms while that remains true. Before public AWS deployment, use a single Docker host (Lightsail 2 GB target), keep provider credentials server-side, configure cost alerts, complete Stadia domain authentication, and add encrypted nightly PostgreSQL dumps to separate S3 storage with a tested restore procedure.

## Environment

Copy `.env.example` to `.env.local`. Map style and geocoder settings are intentionally configurable; do not commit credentials.
