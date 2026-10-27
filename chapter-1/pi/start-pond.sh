#!/bin/bash
# Serves chapter-1 on localhost:8000 and opens it fullscreen in Chromium.
# Started at login by ~/.config/labwc/autostart (see setup.sh).
cd "$(dirname "$0")/.." || exit 1

python3 -m http.server 8000 --bind 127.0.0.1 >/tmp/pond-server.log 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID' EXIT

# Wait for the server before opening the browser
until curl -sf http://127.0.0.1:8000/ >/dev/null; do sleep 0.5; done

# systemd-inhibit blocks idle-blanking and sleep for as long as Chromium runs
systemd-inhibit --what=idle:sleep --who=pond --why="Installation running" \
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --autoplay-policy=no-user-gesture-required \
  --password-store=basic \
  "http://127.0.0.1:8000/?kiosk"
