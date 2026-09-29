# Release Please design

## Goal

Replace the manually dispatched fixed-tag release with a Release Please flow
for Voltic's patched WiFi Connect binary and branded UI. Keep the upstream
base `4.11.84-voltic` fixed and increment only the final release counter.

## Version policy

Use Conventional Commits as in VolticHub to detect releasable changes and build
release notes. Do not apply SemVer major/minor/patch changes to the upstream
base. Every release-worthy change increments one global counter, regardless of
whether it is `fix`, `feat`, or breaking:

`v4.11.84-voltic.1` → `v4.11.84-voltic.2` → `v4.11.84-voltic.3`.

Use the Release Please manifest for the current version and its `release-as`
action input for the calculated next version. Derive the next counter from the
latest tag matching `v4.11.84-voltic.<N>`. The manifest starts at the current
`4.11.84-voltic.1` version, so the next generated release is `.2`. If there is
no tag yet, allow only that initial `.1` baseline or the pending `.2` release;
afterward, fail closed if the manifest and latest tag are not sequential.
Configure tags without a component prefix. Do not enable
GitHub prerelease mode; preserve the current workflow's published release
status.

## Flow

1. On pushes to `master`, fetch tags and derive the next fixed-base version.
   Release Please opens or updates the release PR using Conventional Commits
   and the `release-as` value.
2. When the release PR is merged and Release Please creates a release, use its
   `tag_name` output to build and attach the existing ARM64 binary, UI archive,
   and SHA-256 files to that release.
3. Keep `workflow_dispatch` as a recovery path requiring an existing Voltic
   release tag. It rebuilds and uploads assets to that release without running
   Release Please or creating a new release.
4. Keep the upstream commit pinned and retain the existing Rust/UI build and
   artifact verification steps. Replace `gh release create` with an upload to
   the Release Please-created or manually selected existing release.

## Scope

- Add root Release Please manifest/configuration initialized at the current
  `4.11.84-voltic.1` version.
- Update the release workflow to calculate the counter, run Release Please on
  pushes to `master`, and build only when it creates a release.
- Use the action's emitted tag for the release build and asset upload.
- Keep a manual dispatch for rebuilding assets on an existing Voltic release;
  remove manual release creation.

No source-code, upstream patch, UI, or downstream Ansible changes are included.

## Risks and checks

- The local clone has no `v4.11.84-voltic.N` tag, so use manifest `.1` as the
  current-version baseline and generate `.2` next. Fail closed if the manifest
  later gets ahead of the latest tag by more than one.
- Validate that non-releasable commit types do not create release PRs when the
  dynamic `release-as` value is supplied, and that each releasable type uses
  the same next global counter.
- Confirm the action token can create the release PR and release. Build assets
  only after Release Please reports `release_created == 'true'`.
- Confirm manual dispatch accepts only an existing tag with `N >= 1` and only
  uploads to that release.
- Validate the config JSON and workflow YAML, inspect the diff, and verify tag,
  release, and asset names. Do not publish a release during local validation.
