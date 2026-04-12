# Changelog guide

DSCP uses [Changesets](https://github.com/changesets/changesets) for versioning and
changelog generation.

## Writing a changeset

Write changeset files by hand — **do not run `pnpm changeset`**. Create a file under
`.changeset/` with a descriptive kebab-case name:

```text
.changeset/add-violation-agent-attribution.md
```

Format:

```md
---
'@lapidist/dscp': minor
---

Add agentAttributed field to DSCPViolationPattern to distinguish agent-introduced violations.
```

Valid bump levels:

| Level | When to use |
|-------|-------------|
| `patch` | Bug fixes, documentation updates, internal refactors with no API change |
| `minor` | New fields, new type guards, new generator options — backwards compatible |
| `major` | Removing or renaming required fields in `DSCPDocument`; bumping `specVersion` major |

## Spec version vs package version

The DSCP spec version (`specVersion` field in documents) and the npm package version
(`@lapidist/dscp`) are separate:

- **Package version** follows standard semver and is managed by Changesets.
- **Spec version** (`DSCP_SPEC_VERSION`) is bumped manually when the normative document
  shape changes in a way that affects conformance. A spec major bump always requires a
  package major bump, but a package major bump does not always require a spec major bump.

## Commit style

All commits use Conventional Commits (Angular style):

```text
type(scope): description
```

Common types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `build`, `perf`.
