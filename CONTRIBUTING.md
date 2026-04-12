# Contributing to @lapidist/dscp

## Development setup

```sh
pnpm install
pnpm run build
pnpm test
```

## Quality gates

Before submitting a PR, all of the following must pass:

```sh
pnpm run lint
pnpm run format:check
pnpm run build
pnpm run test:coverage
pnpm run lint:md
```

## Changesets

Write changeset files by hand under `.changeset/`. See the
[changelog guide](./docs/changelog-guide.md) for format details.

## Spec changes

Changes to `spec/v1.md` or `schema/v1.json` that are not backwards compatible require
a major changeset and must update the `specVersion` in `src/generator.ts`.

## Commit style

Angular/Conventional Commits: `type(scope): description`.
