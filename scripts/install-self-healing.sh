#!/usr/bin/env bash
set -Eeuo pipefail

app_dir="/opt/data-center-impact"
service_dir="/etc/systemd/system"

install -m 0755 "$app_dir/scripts/self-heal-staging.sh" /usr/local/sbin/data-center-impact-self-heal
cat > "$service_dir/data-center-impact-self-heal.service" <<'EOF'
[Unit]
Description=Recover the Data Center Impact staging stack
After=docker.service network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/sbin/data-center-impact-self-heal
EOF
cat > "$service_dir/data-center-impact-self-heal.timer" <<'EOF'
[Unit]
Description=Periodic Data Center Impact staging health recovery

[Timer]
OnBootSec=2min
OnUnitActiveSec=2min
Persistent=true

[Install]
WantedBy=timers.target
EOF
systemctl daemon-reload
systemctl enable --now data-center-impact-self-heal.timer
