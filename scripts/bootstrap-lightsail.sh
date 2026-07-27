#!/usr/bin/env bash
set -Eeuo pipefail

repo_url="https://github.com/christophermowrey/datacenterimpact.git"
app_dir="/opt/data-center-impact"
env_dir="/etc/data-center-impact"
env_file="$env_dir/app.env"

sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y docker.io docker-compose-v2 git curl openssl
sudo systemctl enable --now docker

sudo install -d -m 0755 "$app_dir" "$env_dir"
if [ ! -d "$app_dir/.git" ]; then
  sudo git clone "$repo_url" "$app_dir"
else
  sudo git -C "$app_dir" fetch origin main
  sudo git -C "$app_dir" reset --hard origin/main
fi

sudo chown -R ubuntu:ubuntu "$app_dir"
sudo install -m 0755 "$app_dir/scripts/deploy-staging.sh" /usr/local/sbin/data-center-impact-deploy

if [ ! -f "$env_file" ]; then
  postgres_password="$(openssl rand -hex 32)"
  sudo tee "$env_file" >/dev/null <<EOF
DOMAIN=staging.datacenterimpact.app
POSTGRES_PASSWORD=$postgres_password
STORE_SEARCHES=false
GEOCODER_PROVIDER=nominatim
NEXT_PUBLIC_MAP_STYLE_URL=https://tiles.stadiamaps.com/styles/alidade_smooth.json
NEXT_PUBLIC_USE_OSM_FALLBACK=false
NEXT_PUBLIC_OSM_TILE_URL=https://tile.openstreetmap.org/{z}/{x}/{y}.png
NEXT_PUBLIC_SHOW_CANDIDATES=true
GOOGLE_MAPS_API_KEY=
EOF
  sudo chmod 0600 "$env_file"
fi
if ! sudo grep -q '^NEXT_PUBLIC_SHOW_CANDIDATES=' "$env_file"; then
  echo 'NEXT_PUBLIC_SHOW_CANDIDATES=true' | sudo tee -a "$env_file" >/dev/null
fi

sudo /usr/local/sbin/data-center-impact-deploy
echo "Lightsail staging bootstrap complete. Environment: $env_file"
