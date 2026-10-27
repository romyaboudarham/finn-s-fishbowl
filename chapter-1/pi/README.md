# Raspberry Pi 5 install

The Pi replaces the laptop: it joins the Feather's `pond_sensor` Wi-Fi, serves this
folder on localhost, and shows the page fullscreen in Chromium. No Node needed.

## First-time setup (needs internet)

1. Flash **Raspberry Pi OS (64-bit) with desktop** to a dedicated SD card with Raspberry Pi Imager.
   In the Imager's settings, set a username, enable SSH, and add your home Wi-Fi.
2. Boot, then `sudo apt update && sudo apt full-upgrade -y`.
3. `git clone <this repo> ~/finn-s-fishbowl`
4. `~/finn-s-fishbowl/chapter-1/pi/setup.sh`
5. In `raspi-config` > Display Options, set the projector's resolution if it isn't detected.
6. Reboot.

After this the Pi joins `pond_sensor` (priority 100) whenever it's in range, so it
will have no internet there. Use Ethernet or SSH over the home Wi-Fi for maintenance.

## Staying awake

`setup.sh` blocks sleep four ways: screen blanking off in `raspi-config`, the
systemd sleep targets masked, an idle/sleep inhibitor held while Chromium runs, and
Wi-Fi power saving off. Before an install, leave it running for 30 minutes with no
input and confirm the projection is still on and the sensor still responds.

## Calibrating the projection

1. Plug in a keyboard and mouse. Click the page once so it receives key presses.
2. Press `c`, drag the corners until the pond lines up, press `c` again.
3. Press `s`. Chromium downloads `map.json` to `~/Downloads`.
4. `mkdir -p ~/finn-s-fishbowl/chapter-1/maps && mv ~/Downloads/map.json ~/finn-s-fishbowl/chapter-1/maps/`
5. Reboot. The mapping loads on its own. (`maps/map.json` is not ignored by git, so you can commit it.)

## Backup

With the SD card working, make an image of it on your Mac (Raspberry Pi Imager, or
`sudo dd if=/dev/rdiskN of=pond.img bs=4m`). If the card dies, flash the image to a spare.

## Debugging

- Page log: `/tmp/pond-server.log`
- Black screen: the header is hidden in kiosk mode. Open `http://127.0.0.1:8000/` in a normal Chromium window to see the sensor status line.
- Stop the kiosk: `Alt+F4`, or SSH in and `pkill chromium`.
