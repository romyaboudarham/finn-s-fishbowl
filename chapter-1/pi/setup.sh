#!/bin/bash
# One-time setup on the Pi: autostart the pond at login, join the sensor Wi-Fi,
# and stop the screen from blanking. Run from the cloned repo: ./chapter-1/pi/setup.sh
set -e

PI_DIR="$(cd "$(dirname "$0")" && pwd)"
chmod +x "$PI_DIR/start-pond.sh"

# Autostart at login (Pi OS Bookworm uses labwc on the Pi 5)
mkdir -p ~/.config/labwc
AUTOSTART=~/.config/labwc/autostart
LINE="$PI_DIR/start-pond.sh &"
grep -qxF "$LINE" "$AUTOSTART" 2>/dev/null || echo "$LINE" >> "$AUTOSTART"

# Join the Feather's Wi-Fi automatically (matches the ssid/password in the .ino)
if ! nmcli -t -f NAME connection show | grep -qx pond_sensor; then
  sudo nmcli connection add type wifi con-name pond_sensor ssid pond_sensor \
    wifi-sec.key-mgmt wpa-psk wifi-sec.psk pond1234 \
    connection.autoconnect yes connection.autoconnect-priority 100
fi

# Never blank the screen
sudo raspi-config nonint do_blanking 1

echo "Done. Reboot to start the pond."
