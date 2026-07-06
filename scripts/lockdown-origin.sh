#!/usr/bin/env bash
#
# Locks the origin server so HTTP/HTTPS (80/443) is reachable ONLY from
# Cloudflare's IP ranges. SSH (22) stays open. Includes an automatic
# rollback so you can't lock yourself out.
#
# HOW TO USE (run inside your OWN ssh session on the origin box):
#   1. scp/paste this file to the server, e.g. /home/ubuntu/lockdown-origin.sh
#   2. chmod +x lockdown-origin.sh
#   3. sudo ./lockdown-origin.sh
#   4. From another machine, confirm the site loads (via Cloudflare) AND that
#      the origin IP is NO LONGER directly reachable on 80/443.
#   5. If everything is fine, CANCEL the rollback:
#        sudo kill "$(cat /tmp/ufw_rollback.pid)"
#      If you got locked out or the site broke, DO NOTHING — the firewall
#      auto-resets after 10 minutes and you're back to the previous state.
#
set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "Run with sudo: sudo $0" >&2
  exit 1
fi

echo "==> Arming 10-minute auto-rollback safety net..."
cat > /tmp/ufw_rollback.sh <<'ROLLBACK'
#!/usr/bin/env bash
# Reverts to a permissive baseline if it runs (i.e. you got locked out).
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ROLLBACK
chmod +x /tmp/ufw_rollback.sh

# nohup + sleep instead of `at` so we don't depend on atd being installed.
nohup bash -c 'sleep 600; bash /tmp/ufw_rollback.sh' >/tmp/ufw_rollback.log 2>&1 &
echo $! > /tmp/ufw_rollback.pid
echo "    Rollback PID $(cat /tmp/ufw_rollback.pid) — fires in 10 min unless cancelled."

echo "==> Fetching current Cloudflare IP ranges..."
V4="$(curl -fsS https://www.cloudflare.com/ips-v4)"
V6="$(curl -fsS https://www.cloudflare.com/ips-v6)"
if [[ -z "$V4" || -z "$V6" ]]; then
  echo "ERROR: could not fetch Cloudflare IP lists. Aborting (rollback still armed)." >&2
  exit 1
fi

echo "==> Rebuilding UFW rules..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# Keep management access open. Change 22 if you run SSH on a custom port.
ufw allow 22/tcp

# Allow web traffic ONLY from Cloudflare.
while IFS= read -r ip; do
  [[ -n "$ip" ]] && ufw allow from "$ip" to any port 80,443 proto tcp
done <<< "$V4"
while IFS= read -r ip; do
  [[ -n "$ip" ]] && ufw allow from "$ip" to any port 80,443 proto tcp
done <<< "$V6"

ufw --force enable
echo "==> Done. Current rules:"
ufw status numbered

echo
echo "NEXT: verify from another machine, then cancel rollback with:"
echo "  sudo kill \"\$(cat /tmp/ufw_rollback.pid)\""
