# WiFi Connect compatibility build

This repository publishes an ARM64 build of
[balena WiFi Connect](https://github.com/balena-os/wifi-connect) v4.11.84 with
a small NetworkManager compatibility patch.

The patch makes stale access-point cleanup non-fatal when NetworkManager
returns a connection profile that the legacy D-Bus client cannot deserialize.
It does not suppress failures while deleting a profile that was successfully
read.

## Contents

- `patches/`: the source patch applied to the pinned upstream commit.
- `.github/workflows/release.yml`: the reproducible ARM64 build and Release.
- GitHub Releases: the binary archive and its SHA-256 checksum.

No device configuration or deployment credentials belong in this repository.

## Upstream source

- Project: `balena-os/wifi-connect`
- Commit: `5bd4c1bea548fb5714bedb18bbd12f088d5fa407`
- License: Apache-2.0
