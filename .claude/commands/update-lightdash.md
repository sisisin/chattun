# update-lightdash - Lightdash Submodule Update

Update the lightdash git submodule one version at a time, verifying build and tests at each step.

## Procedure

Execute the following steps in order:

### 1. Check current version

```bash
git -C lightdash describe --tags --abbrev=0
```

### 2. Fetch latest tags and find next version

```bash
git -C lightdash fetch --tags
CURRENT=$(git -C lightdash describe --tags --abbrev=0)
git -C lightdash tag --sort=v:refname | grep -A1 "^${CURRENT}$" | tail -1
```

If the current version is already the latest, report that and stop.

### 3. Checkout next version

```bash
git -C lightdash checkout <next-version-tag>
```

### 4. Install lightdash dependencies

Use the pnpm version specified in lightdash's `packageManager` field (via corepack):

```bash
(cd lightdash && pnpm install --frozen-lockfile)
```

If `pnpm-lock.yaml` shows a diff, the pnpm version may be mismatched. Check `packageManager` in `lightdash/package.json`.

### 5. Build ldsql

```bash
node tools/build.mjs
```

### 6. Run integration tests

```bash
pnpm test
```

If snapshot tests fail due to SQL output changes (not bugs), update snapshots:

```bash
pnpm exec vitest run --update
```

### 7. Handle failures

- **Build errors**: Check if stub plugins need updating (`tools/lightdash-stubs.mjs`). Module paths or exports may have changed.
- **Test errors**: If SQL output changed intentionally, update snapshots. If behavior changed, investigate the lightdash changelog.
- **Breaking changes**: Check release notes at `https://github.com/lightdash/lightdash/releases/tag/<version>`.

### 8. Commit

If snapshots were updated, include them in the commit:

```bash
git add lightdash test/__snapshots__/
git commit -m "chore: update lightdash to <version>"
```

## Notes

- Always update one version at a time to isolate breakage
- The `--frozen-lockfile` flag prevents accidental lockfile modifications
