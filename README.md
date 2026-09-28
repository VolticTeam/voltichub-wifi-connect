# WiFi Connect compatibility build

This repository publishes an ARM64 build of
[balena WiFi Connect](https://github.com/balena-os/wifi-connect) v4.11.84 with
a NetworkManager compatibility patch and the Voltic-branded hotspot UI.

The patch makes stale access-point cleanup non-fatal when NetworkManager
returns a connection profile that the legacy D-Bus client cannot deserialize.
It does not suppress failures while deleting a profile that was successfully
read.

## Contents

- `patches/`: the source patch applied to the pinned upstream commit.
- `ui/`: the Voltic hotspot UI source, with styles, components and fonts kept
  in separate files.
- `.github/workflows/release.yml`: the reproducible ARM64 build and Release.
- GitHub Releases: the binary and UI archives, each with a SHA-256 checksum.

No device configuration or deployment credentials belong in this repository.

The UI archive is published as `wifi-connect-ui.tar.gz` and is installed
separately from the binary by the device provisioning role.

## Upstream source

- Project: `balena-os/wifi-connect`
- Commit: `5bd4c1bea548fb5714bedb18bbd12f088d5fa407`
- License: Apache-2.0
