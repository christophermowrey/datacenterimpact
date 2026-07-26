# Deployment Modes

Data Center Impact has two supported deployment modes.

## Developer Deployment

Purpose: local development, testing, and content review.

- Runs on the developer computer at `http://localhost:3000`.
- PostgreSQL stays inside Docker and is not published outside localhost.
- Search storage remains disabled.
- Stadia can be used with a local development style when available.
- The OSM raster fallback remains available for local testing only.
- Caddy is not required.

Start it on Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
# Edit .env.local and set POSTGRES_PASSWORD.
docker compose --env-file .env.local up --build
```

To use Stadia locally, set the style URL and disable the OSM fallback:

```dotenv
NEXT_PUBLIC_MAP_STYLE_URL=https://tiles.stadiamaps.com/styles/alidade_smooth.json
NEXT_PUBLIC_USE_OSM_FALLBACK=false
```

Stadia domain-based authentication is intended for the public domain. Local `localhost` testing may require a development key or temporary Stadia development configuration.

## Live AWS Deployment

Purpose: the public site on the Lightsail server.

- Runs Docker Compose on AWS Lightsail.
- Caddy terminates HTTPS on ports 80 and 443.
- The Next.js port is not public.
- PostgreSQL has no public port.
- Production uses Stadia once the account and domain authentication are configured.
- `NEXT_PUBLIC_USE_OSM_FALLBACK=false`.
- `STORE_SEARCHES=false` until the privacy/storage gate is approved.
- Secrets live in `/etc/data-center-impact/app.env`, not Git.
- AWS budgets, backups, health checks, and rollback procedures are required.

Production environment values include:

```dotenv
DOMAIN=datacenterimpact.app
POSTGRES_PASSWORD=long-random-server-password
NEXT_PUBLIC_MAP_STYLE_URL=https://tiles.stadiamaps.com/styles/alidade_smooth.json
NEXT_PUBLIC_USE_OSM_FALLBACK=false
STORE_SEARCHES=false
```

The Stadia free plan is appropriate while the project is genuinely noncommercial. If the project becomes commercial, upgrade Stadia or obtain an appropriate commercial arrangement before continuing public use.

## Deliberate Separation

The same application image can run in both modes. Deployment behavior comes from environment configuration rather than code edits. The OSM path remains wired for recovery and development, but it must not be the live default.
