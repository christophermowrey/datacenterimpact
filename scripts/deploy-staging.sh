#!/usr/bin/env bash
set -Eeuo pipefail

app_dir="/opt/data-center-impact"
env_file="/etc/data-center-impact/app.env"

test -f "$env_file"
git -C "$app_dir" fetch origin main
git -C "$app_dir" reset --hard origin/main
docker compose --env-file "$env_file" --profile production up -d --build --remove-orphans
docker compose --env-file "$env_file" --profile production ps
