# Staging Deployment

The staging deployment uses GitHub Actions to run the existing Docker Compose production profile on AWS Lightsail. The repository never contains the SSH private key or the server environment file.

## One-time Lightsail bootstrap

Use the Lightsail browser SSH terminal as `ubuntu` and run this command after the bootstrap script has been pushed to `main`:

```bash
curl -fsSL https://raw.githubusercontent.com/christophermowrey/datacenterimpact/main/scripts/bootstrap-lightsail.sh -o /tmp/bootstrap-lightsail.sh && bash /tmp/bootstrap-lightsail.sh
```

The script installs Docker, clones the repository into `/opt/data-center-impact`, generates a random PostgreSQL password at `/etc/data-center-impact/app.env`, installs the deployment script, and starts the staging stack.

The script expects the staging hostname `staging.datacenterimpact.app` and the Stadia style URL. Configure the DNS record before relying on Caddy HTTPS:

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
| `LIGHTSAIL_KNOWN_HOSTS` | Output from `ssh-keyscan -H <static-ip>` |

The private key is consumed by GitHub Actions at runtime and is never committed. Do not print it in workflow logs.

## Deployments

Every push to `main` runs `.github/workflows/deploy-staging.yml`. The workflow connects to Lightsail, fetches `origin/main`, rebuilds the production Compose profile, and prints service status. It can also be run manually from the Actions tab.

## Verification

After DNS and HTTPS are ready, verify:

```text
https://staging.datacenterimpact.app
https://staging.datacenterimpact.app/api/health
```

The health response should report `"status":"ok"`. A missing Stadia style configuration intentionally reports `degraded`.
