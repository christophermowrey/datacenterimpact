# Staging Deployment

The staging deployment uses GitHub Actions to run the existing Docker Compose production profile on AWS Lightsail. The repository never contains the SSH private key or the server environment file.

## One-time Lightsail bootstrap

Use the Lightsail browser SSH terminal as `ubuntu` and run this command after the bootstrap script has been pushed to `main`:

```bash
curl -fsSL https://raw.githubusercontent.com/christophermowrey/datacenterimpact/main/scripts/bootstrap-lightsail.sh -o /tmp/bootstrap-lightsail.sh && bash /tmp/bootstrap-lightsail.sh
```

The script installs Docker, clones the repository into `/opt/data-center-impact`, generates a random PostgreSQL password at `/etc/data-center-impact/app.env`, installs the deployment script, and starts the staging stack.

The script expects the staging hostname `staging.datacenterimpact.app`, the Stadia style URL, and enables preliminary candidate records for staging review. Configure the DNS record before relying on Caddy HTTPS:

```text
Type: A
Host: staging
Answer: the Lightsail static IPv4 address
TTL: 600
```

## GitHub secrets

Add these repository secrets under **Settings → Secrets and variables → Actions**:

| Secret | Value |
| --- | --- |
| `LIGHTSAIL_HOST` | The Lightsail static IPv4 address |
| `LIGHTSAIL_USER` | `ubuntu` |
| `LIGHTSAIL_SSH_KEY` | The downloaded Lightsail private key, entered by the owner only |
| `LIGHTSAIL_KNOWN_HOSTS` | Verified `known_hosts` line for the static IP. If Windows `ssh-keyscan` reports an unsupported KEX warning, use the valid `ssh-ed25519` line recorded by a successful SSH connection and do not paste the warning text. |

The private key is consumed by GitHub Actions at runtime and is never committed. Do not print it in workflow logs.

## Local SSH connection

From Windows PowerShell, use the local helper with the staging static IP:

```powershell
.\scripts\connect-staging.ps1
```

The helper uses the local key at `C:\Users\chris\DeprecatedOneDrive\Desktop\datacenter-impact-staging-ssh.pem` and connects as `ubuntu`. Override the host or key when needed:

```powershell
 .\scripts\connect-staging.ps1 -HostAddress 100.62.20.61 -KeyPath "C:\path\to\key.pem"
```

## Deployments

Every push to `main` runs `.github/workflows/deploy-staging.yml`. The workflow connects to Lightsail, fetches `origin/main`, rebuilds the production Compose profile, runs database migrations, and prints service status. It can also be run manually from the Actions tab.

The legacy `lib/facilities.ts` import is intentionally separate and must only be run once after reviewing the migration:

```bash
DATABASE_URL=postgres://... npm run db:import-facilities
```

The staging host also installs `data-center-impact-self-heal.timer`. It checks the local health endpoint every two minutes, restarts Docker when necessary, and brings the existing Compose containers back up without rebuilding. Deployment keeps a last-known-good Git ref and restores it when a build or health check fails.

If the GitHub Actions SSH step cannot connect, host-level self-healing cannot run. Use the Lightsail browser console to restart the instance and verify its static IP and SSH host key. Then rerun `scripts/bootstrap-lightsail.sh` if the self-healing timer was never installed.

## Verification

After DNS and HTTPS are ready, verify:

```text
https://staging.datacenterimpact.app
https://staging.datacenterimpact.app/api/health
```

The health response should report `"status":"ok"`. A missing Stadia style configuration intentionally reports `degraded`.
