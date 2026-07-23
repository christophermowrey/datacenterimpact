# AWS Migration Runbook

This document is for the first deployment after the local-only milestone. Do not follow it until the app has been reviewed and the demo records have been replaced with reviewed data. The target is one Amazon Lightsail Linux instance running Docker Compose, with a monthly budget of approximately $60.

## 0. What this creates

- One Lightsail Linux server running the web container and PostgreSQL/PostGIS.
- HTTPS through Caddy after a domain is ready.
- No public database port.
- Provider credentials stored only in an environment file on the server.
- Nightly encrypted database backups to a separate S3 bucket before public launch.

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
4. Name it `gridline-houston-prod`.
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

## 4. Deploy the repository

Replace the URL below if the repository becomes private or is moved.

```bash
sudo mkdir -p /opt/gridline
sudo chown "$USER":"$USER" /opt/gridline
cd /opt/gridline
cp .env.example .env.local
nano .env.local
```

For production, set a real server-side geocoder provider. Never put its key in a `NEXT_PUBLIC_*` variable. Before the app is public, add rate limiting, restricted lead storage, HTTPS, and an admin authentication layer.

Start the stack for an internal smoke test:

```bash
curl -I http://127.0.0.1:3000
```

## 5. Add HTTPS before public access

The current Compose file intentionally binds to localhost. For public hosting, add a Caddy service or install Caddy on the host. Point `datacenterimpact.app` and `www.datacenterimpact.app` DNS A records to the Lightsail static IP, wait for DNS propagation, then configure Caddy to reverse proxy to `web:3000` and obtain a certificate.

Do not expose the Next.js port directly to the internet. Only ports 80 and 443 should be public.

## 6. Database and backup gate

The initial UI does not yet use the database. Do not treat the PostGIS container as production-ready until migrations, seed imports, restricted lead storage, and admin authentication exist.

Before public launch:

1. Create a private S3 bucket in the same AWS region with public access blocked.
2. Create a least-privilege IAM role that can write backup objects but cannot delete them.
3. Add encrypted nightly `pg_dump` files with a lifecycle rule.
4. Store the backup key outside the repository.
5. Restore a backup into a separate temporary database and record the result.
6. Repeat the restore test quarterly.

## 7. Updating the application

```bash
cd /opt/gridline
```

If a release fails, inspect the previous image before removing it. Keep the last known-good commit hash in the deployment log. Never use `git reset --hard` on the server without a documented rollback decision.

## 8. Shutdown and cost control

```bash
```

Stopping the container does not stop Lightsail billing. Stop or delete the instance only when intentionally taking the environment offline. Review AWS Budgets monthly and remove unused static IPs, snapshots, and test resources.
