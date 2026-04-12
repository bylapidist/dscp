# Agent instructions for @lapidist/dscp

## Build

```sh
pnpm install
pnpm run build
```

## Test

```sh
pnpm test
pnpm run test:coverage
```

## Quality gates (run before committing)

```sh
pnpm run lint
pnpm run format:check
pnpm run build
pnpm run test:coverage
pnpm run lint:md
```

## Key constraints

- No dependency on `@lapidist/dsr` or `@lapidist/design-lint`
- Depends only on `@lapidist/dtif-parser` for token types
- No `as` type assertions — use type predicates in `src/guards.ts`
- Spec changes that break backwards compatibility require bumping `DSCP_SPEC_VERSION`
  in `src/generator.ts` and updating `spec/v1.md`
