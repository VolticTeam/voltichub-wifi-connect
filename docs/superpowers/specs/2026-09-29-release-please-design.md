# Release Please design

## Goal

Replace the manually dispatched fixed-tag release with a Release Please flow for
Voltic's patched WiFi Connect binary and branded UI. Preserve the upstream
version in the tag and number successive Voltic releases.

## Approved version policy

Use Conventional Commits as in VolticHub and a Release Please manifest for the
single repository artifact. Seed the current version as `4.11.84-voltic.1`;
the Git tag and GitHub release name are `v` plus that version.

Use Release Please's `prerelease` versioning strategy. Its planned results are:

| Commit change | Next version |
| --- | --- |
| `fix:` or other patch-level release | `4.11.84-voltic.2` |
| `feat:` | `4.12.0-voltic.1` |
| Breaking change | `5.0.0-voltic.1` |

The sequence advances within each SemVer base. A minor or major bump starts a
new sequence at `.1`, matching the approved behavior that the commit type can
advance the base version.

## Flow

1. On pushes to `master`, Release Please opens or updates its release PR from
   Conventional Commits. Do not create release PRs from feature branches.
2. When that PR is merged and Release Please creates a release, use its
   `tag_name` output to build and attach the existing ARM64 binary, UI archive,
   and SHA-256 files to that release.
3. Keep the upstream commit pinned and keep the existing Rust/UI build and
   artifact verification steps. Replace `gh release create` with an upload to
   the Release Please-created release.

The Release Please manifest is the source of the current version. Configure
the component to use tags without an extra component prefix so the tag remains
`v4.11.84-voltic.1`.

The `prerelease` strategy requires Release Please's `prerelease` setting. That
also marks the GitHub release as a prerelease. Assets remain attached to the
exact tag, but the release will not be GitHub's latest stable release.

## Scope

- Add Release Please manifest/configuration for the root artifact.
- Update the release workflow to run Release Please on `master` and build only
  when it creates a release.
- Use the tag emitted by Release Please for the build and asset upload.
- Remove the hard-coded release tag and manual release creation.

No source-code, upstream patch, UI, or downstream Ansible changes are included.

## Risks and checks

- Verify that `v4.11.84-voltic.1` exists on the remote before bootstrapping; the
  local clone currently has only the earlier `compat` and `hostapd` tags. Use
  the confirmed release as the starting point so those tags are not treated as
  this component's release history.
- The GitHub prerelease status is an intentional consequence of the approved
  prerelease versioning strategy. Confirm downstream consumers select by exact
  tag or asset name, not by GitHub's latest-stable-release pointer.
- Confirm the action token can create the release PR and release. Build assets
  only after Release Please reports `release_created == 'true'`.
- Validate the config JSON and workflow YAML, inspect the resulting diff, and
  verify tag/release/asset names. No CI run or external release is part of this
  local change.
