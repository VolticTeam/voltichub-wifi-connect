# WiFi Connect hostapd build

This repository publishes an ARM64 build of
[balena WiFi Connect](https://github.com/balena-os/wifi-connect) v4.11.84 with
VolticHub compatibility patches.

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

Runtime dependencies are `hostapd`, `iproute2`, `network-manager`, `dnsmasq-base`
and `libdbus-1-3`. The program still requires root privileges.

## Contents

- `patches/`: the tested source patch applied to the pinned upstream commit.
- `.github/workflows/release.yml`: the reproducible ARM64 build and Release.
- GitHub Releases: the binary archive and its SHA-256 checksum.

No device configuration or deployment credentials belong in this repository.

## Upstream source

- Project: `balena-os/wifi-connect`
- Commit: `5bd4c1bea548fb5714bedb18bbd12f088d5fa407`
- License: Apache-2.0
