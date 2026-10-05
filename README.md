# WiFi Connect hostapd build

This repository publishes an ARM64 build of
[balena WiFi Connect](https://github.com/balena-os/wifi-connect) v4.11.84 with
a NetworkManager compatibility patch and the Voltic-branded hotspot UI.

The build uses `hostapd` instead of NetworkManager/wpa_supplicant for the
captive access point. It keeps the upstream scan, DHCP/DNS, web UI and
NetworkManager client-connection flow. During the access-point window it:

1. releases only the selected Wi-Fi interface from NetworkManager;
2. stops `wpa_supplicant`, starts a WPA2/CCMP `hostapd` access point and assigns
   the configured gateway;
3. restores `wpa_supplicant` and NetworkManager before connecting to the Wi-Fi
   selected in the portal;
4. removes the root-only runtime configuration and gateway address on exit.

The patch also makes stale access-point cleanup non-fatal when the legacy
NetworkManager D-Bus client cannot deserialize an unrelated profile.
It lets `hostapd` receive SIGTERM and waits briefly for a clean stop before
falling back to SIGKILL, so the Wi-Fi radio can scan after portal submission.

Runtime dependencies are `hostapd`, `iproute2`, `network-manager`, `dnsmasq-base`
and `libdbus-1-3`. The program still requires root privileges.

## Contents

- `patches/`: the source patch applied to the pinned upstream commit.
- `ui/`: the Voltic hotspot UI source, with styles, components and fonts kept
  in separate files.
- `.github/workflows/release.yml`: the reproducible ARM64 build and Release.
- GitHub Releases: the binary and UI archives, each with a SHA-256 checksum.

No device configuration or deployment credentials belong in this repository.

The UI archive is published as `wifi-connect-ui.tar.gz` and is installed
separately from the binary by the device provisioning role.

## Configure a Wi-Fi network manually

On the Orange Pi, NetworkManager stores persistent Wi-Fi profiles in
`/etc/NetworkManager/system-connections/`. To provision a hidden WPA/WPA2
Personal network without the portal, create a root-only keyfile (replace the
SSID, password and interface name as appropriate):

```ini
[connection]
id=Example hidden network
type=wifi
interface-name=wlan0
autoconnect=true

[wifi]
ssid=Example hidden network
mode=infrastructure
hidden=true

[wifi-security]
key-mgmt=wpa-psk
psk=REPLACE_WITH_WIFI_PASSWORD

[ipv4]
dns=1.1.1.1;8.8.8.8;
ignore-auto-dns=true
method=auto

[ipv6]
addr-gen-mode=default
method=auto
```

Create the file with restrictive permissions before entering the password,
then load it without restarting NetworkManager:

```sh
profile=$(sudo mktemp --suffix=.nmconnection \
  /etc/NetworkManager/system-connections/example-hidden.XXXXXX)
sudoedit "$profile"
sudo nmcli connection load "$profile"
```

Check that the profile was loaded and marked hidden without displaying its
password:

```sh
nmcli -f NAME,UUID,TYPE connection show
nmcli -g 802-11-wireless.hidden connection show 'Example hidden network'
```

The `psk` is stored in plaintext in this root-only file. Activating the profile
with `sudo nmcli connection up 'Example hidden network'` changes the Wi-Fi
connection and can disconnect the hotspot or a remote session; use another
access path when testing it. For a visible network, omit `hidden=true`.

## Upstream source

- Project: `balena-os/wifi-connect`
- Commit: `5bd4c1bea548fb5714bedb18bbd12f088d5fa407`
- License: Apache-2.0
