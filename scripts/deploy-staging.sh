#!/usr/bin/env bash
set -Eeuo pipefail

app_dir="/opt/data-center-impact"
env_file="/etc/data-center-impact/app.env"
state_dir="/var/lib/data-center-impact"
state_file="$state_dir/last-good-ref"
compose=(docker compose --project-name data-center-impact --env-file "$env_file" --profile production)

test -f "$env_file"
if ! grep -q '^NEXT_PUBLIC_SHOW_CANDIDATES=' "$env_file"; then
  echo 'NEXT_PUBLIC_SHOW_CANDIDATES=true' | tee -a "$env_file" >/dev/null
fi
if ! grep -q '^ADMIN_DOMAIN=' "$env_file"; then
  echo 'ADMIN_DOMAIN=admin.staging.datacenterimpact.app' | tee -a "$env_file" >/dev/null
fi
if ! grep -q '^ADMIN_ENABLED=' "$env_file"; then
  echo 'ADMIN_ENABLED=false' | tee -a "$env_file" >/dev/null
fi
cd "$app_dir"
mkdir -p "$state_dir"
previous_ref="$(cat "$state_file" 2>/dev/null || true)"
if ! git cat-file -e "$previous_ref^{commit}" 2>/dev/null; then
  previous_ref="f004dab"
fi
rollback() {
  status=$?
  if [ "$status" -eq 0 ]; then return; fi
  echo "Deployment failed with status $status; restoring $previous_ref" >&2
  git reset --hard "$previous_ref" || true
  timeout 5m "${compose[@]}" up -d --no-build --remove-orphans || true
  exit "$status"
}
trap rollback EXIT

git fetch origin main
git reset --hard origin/main
if [ -f "$app_dir/scripts/install-self-healing.sh" ]; then
  bash "$app_dir/scripts/install-self-healing.sh"
fi

# Build before replacing the running containers. A failed build leaves the last image available.
timeout 12m "${compose[@]}" build web
timeout 5m "${compose[@]}" up -d --no-build --remove-orphans

for attempt in $(seq 1 30); do
  if curl --fail --silent --show-error --max-time 3 http://127.0.0.1:3000/api/health >/dev/null; then
    timeout 2m "${compose[@]}" exec -T web npm run db:migrate
    printf '%s\n' "$(git rev-parse HEAD)" > "$state_file"
    trap - EXIT
    "${compose[@]}" ps
    exit 0
  fi
  sleep 2
done

echo 'The web health check did not become ready.' >&2
exit 1
