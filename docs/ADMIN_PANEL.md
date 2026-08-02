# Private admin panel

The admin panel is an operational read-only view at `/admin`. It is disabled by default and requires HTTP Basic Auth configured with `ADMIN_USERNAME` and `ADMIN_PASSWORD`.

## Production access

1. Set `ADMIN_ENABLED=true` and choose a unique password in the deployment secret store. Do not commit `.env.local`.
2. Set `ADMIN_DOMAIN` to the hostname you use for the operator panel.
3. Choose a certificate strategy. The simplest option is a public DNS record for `ADMIN_DOMAIN` so Caddy can obtain a normal certificate; the Caddy source restriction still blocks non-Tailscale requests. Alternatively, configure Caddy DNS-01 or use an internal certificate with a trust process for your devices.
4. Confirm Caddy's Tailscale source restriction is active and keep PostgreSQL private. The included configuration allows Tailscale IPv4 addresses (`100.64.0.0/10`) and returns `404` to other sources.
5. Open `https://admin.example.com/admin` from a device connected to the tailnet. The browser will request the configured username and password.

The application performs its own credential check in addition to the private network boundary. A request to the public hostname or directly to the Next.js port is not a substitute for authentication.

## Metrics

The panel reports application health, process uptime, memory, filesystem usage, and selected configuration states. Set `ADMIN_UPTIME_URL`, `ADMIN_COSTS_URL`, and `ADMIN_METRICS_URL` to links for external dashboards when available.

Do not put cloud billing credentials, monitoring API keys, database passwords, logs, or private source data in these variables. Billing and uptime providers should retain their own credentials and access controls.

## Local testing

Copy `.env.example` to `.env.local`, set `ADMIN_ENABLED=true`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD`, then run the app. Visit `http://localhost:3000/admin` and authenticate when prompted. Keep `ADMIN_ENABLED=false` in deployments that do not have a private access path.
