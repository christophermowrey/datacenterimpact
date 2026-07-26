# AWS Migration Runbook

This document is for the first beginner-friendly AWS deployment. The target is one Amazon Lightsail Linux instance running Docker Compose and Caddy, with a monthly budget of approximately $60. The application code can be staged before the inventory is complete, but do not advertise incomplete demo records as a finished market inventory.

Google Places Autocomplete is optional. If enabled, use a restricted server-side key, configure Google Cloud budget alerts and quotas, and review Google Places storage/display terms before retaining normalized residential search data. Without the key, the application uses its OpenStreetMap/Nominatim fallback.

## 0. What this creates

- One Lightsail Linux server running the web container and PostgreSQL/PostGIS.
- HTTPS through Caddy after DNS is ready.
- No public database port.
- Provider credentials stored only in an environment file on the server.
- Nightly encrypted database backups to a separate S3 bucket before public launch.
- A server-side environment file with restricted permissions; no production secrets in Git.

## 1. Protect the AWS account

1. Sign in at `https://console.aws.amazon.com/`.
2. Open the account menu, then **Security credentials**.
3. Enable MFA on the root account. Do not create daily access keys for root.
4. Open **Billing and Cost Management → Budgets → Create budget**.
5. Create alerts at $20, $40, and $55 monthly. Use an email address you check.
6. Open **IAM → Users → Create user** and create an administrator for setup. Enable MFA for that user. Use the root account only for account-level tasks.

## 2. Create the server

1. Open **Lightsail → Create instance**.
2. Select Linux/Unix and **OS Only → Ubuntu 24.04 LTS**.
3. Start with the 2 GB plan. Use 4 GB only if builds or database imports require it.
4. Name it `data-center-impact-prod`.
5. Create the instance and wait for its state to become **Running**.
6. Create and attach a static IP. Record it privately.
7. In **Networking**, allow TCP ports `22`, `80`, and `443`. Do not open PostgreSQL port `5432`.

## 3. Connect and install Docker

Use the Lightsail browser SSH button for the first connection. After that, use an SSH key from your computer.

```bash
sudo apt-get update
sudo apt-get upgrade -y
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
exit
```

Reconnect, then verify:

```bash
docker --version
docker compose version
```

## 4. Prepare the server environment

Replace the URL below if the repository becomes private or is moved.

```bash
sudo mkdir -p /opt/data-center-impact
sudo chown "$USER":"$USER" /opt/data-center-impact
cd /opt/data-center-impact
git clone https://github.com/christophermowrey/datacenterimpact.git .
sudo mkdir -p /etc/data-center-impact
sudo touch /etc/data-center-impact/app.env
sudo chown "$USER":"$USER" /etc/data-center-impact/app.env
chmod 600 /etc/data-center-impact/app.env
nano /etc/data-center-impact/app.env
```

Put only server configuration in `/etc/data-center-impact/app.env`. Use a long random database password. Never commit this file or put private keys in a `NEXT_PUBLIC_*` variable.

Example values:

```dotenv
POSTGRES_PASSWORD=replace-with-a-long-random-password
DOMAIN=datacenterimpact.app
GEOCODER_PROVIDER=production-provider
GEOCODER_API_KEY=replace-with-server-side-key
GOOGLE_MAPS_API_KEY=replace-with-restricted-server-side-key
STORE_SEARCHES=false
```

The application currently remains in no-storage mode. Do not set `STORE_SEARCHES=true` until the privacy, retention, access, encryption, and deletion controls are implemented and reviewed.

## 5. Run an internal smoke test

Use the local-only web service first:

```bash
docker compose --env-file /etc/data-center-impact/app.env up -d --build
curl -I http://127.0.0.1:3000
docker compose ps
```

Confirm `web` is running and `db` is healthy. PostgreSQL must not have a public port.

## 6. Configure DNS and HTTPS

In the domain registrar DNS panel, create:

- `A` record for `datacenterimpact.app` pointing to the Lightsail static IP.
- `A` record for `www.datacenterimpact.app` pointing to the same IP, or a CNAME to the root domain.

Wait for DNS to resolve before starting Caddy. Then run:

```bash
docker compose --env-file /etc/data-center-impact/app.env --profile production up -d --build
docker compose ps
curl -I http://datacenterimpact.app
curl -I https://datacenterimpact.app
curl -I https://datacenterimpact.app/api/health
```

Caddy obtains and renews the HTTPS certificate automatically. Its certificate and configuration data are stored in Docker volumes.

Do not expose the Next.js port directly to the internet. Only ports 80 and 443 should be public.

## 7. Public launch gate

Do not announce the site publicly until these checks pass:

1. HTTPS works and HTTP redirects to HTTPS.
2. PostgreSQL is not reachable from the internet.
3. `POSTGRES_PASSWORD` is not present in Git or image layers.
4. A production geocoder and compliant production map-tile provider are configured.
5. Rate limiting is working on geocoder endpoints.
6. Search storage is disabled unless the privacy controls are complete.
7. Demo records are clearly labeled or replaced with reviewed inventory.
8. Dependency audit results are reviewed.
9. The correction/admin workflow is protected before accepting private submissions.

The initial UI does not yet use the database. Do not treat the PostGIS container as production-ready until migrations, seed imports, restricted lead storage, and admin authentication exist.

## 8. Updating the application

```bash
cd /opt/data-center-impact
git pull --ff-only origin main
docker compose --env-file /etc/data-center-impact/app.env --profile production up -d --build
docker image prune -f
```

If a release fails, inspect the previous image before removing it. Keep the last known-good commit hash in the deployment log. Never use `git reset --hard` on the server without a documented rollback decision.

## 9. Shutdown and cost control

Stopping the container does not stop Lightsail billing. Stop or delete the instance only when intentionally taking the environment offline. Review AWS Budgets monthly and remove unused static IPs, snapshots, and test resources.

## 10. Backup and restore

Before storing residential search records or other important data:

1. Create a private S3 bucket with public access blocked.
2. Enable bucket encryption and a lifecycle policy.
3. Create a least-privilege backup identity that can write backups but cannot delete them.
4. Run an encrypted nightly `pg_dump` from the server.
5. Restore a backup into a separate temporary database.
6. Record the restore result.
7. Repeat the restore test quarterly.
