#!/usr/bin/env bash
set -Eeuo pipefail

app_dir="/opt/data-center-impact"
env_file="/etc/data-center-impact/app.env"
compose=(docker compose --env-file "$env_file" --profile production)

if ! systemctl is-active --quiet docker; then
  systemctl restart docker
fi

cd "$app_dir"
if ! curl --fail --silent --show-error --max-time 5 http://127.0.0.1:3000/api/health >/dev/null; then
  "${compose[@]}" up -d --no-build --remove-orphans
fi

curl --fail --silent --show-error --max-time 5 http://127.0.0.1:3000/api/health >/dev/null
