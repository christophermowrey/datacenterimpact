#!/usr/bin/env bash
set -Eeuo pipefail

app_dir="/opt/data-center-impact"
env_file="/etc/data-center-impact/app.env"

test -f "$env_file"
if ! grep -q '^NEXT_PUBLIC_SHOW_CANDIDATES=' "$env_file"; then
  echo 'NEXT_PUBLIC_SHOW_CANDIDATES=true' | tee -a "$env_file" >/dev/null
fi
cd "$app_dir"
git -C "$app_dir" fetch origin main
git -C "$app_dir" reset --hard origin/main
docker compose --env-file "$env_file" --profile production up -d --build --remove-orphans
docker compose --env-file "$env_file" --profile production ps
