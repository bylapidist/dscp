# @lapidist/dscp — Changelog

## 0.2.0

### Minor Changes

- 0f2cebf: Introduce `TokenInput` interface and decouple generator from `@lapidist/dtif-parser`.

  `buildDocument` / `generateDocument` now accept a minimal `TokenInput` shape (`pointer`, `name`, `type?`, `value?`) instead of requiring `DtifFlattenedToken`. Any object that satisfies `TokenInput` works — including `DtifFlattenedToken` structurally — so existing DSR-backed callers continue without changes.

  Breaking changes:
  - `DtifFlattenedToken` and `TokenType` are no longer re-exported from `@lapidist/dscp`; import them from `@lapidist/dtif-parser` directly if needed
  - `DSCPTokenGraph.byType` widened to `Partial<Record<string, DSCPTokenEntry[]>>` (string keys instead of `TokenType`)
  - `DSCPSectionTag` now uses a template literal `dscp:tokens:${string}` instead of the fixed union

## 0.1.0

### Minor Changes

- 3e24a78: initial release of the Design System Context Protocol spec, schema, types, and reference generator

## 0.1.0

Initial scaffold.

- `DSCPDocument` type and JSON Schema v1
- `generateDocument()` reference generator
- `renderMarkdown()` for DESIGN_SYSTEM.md output
- Type guards for all DSCP types
- Normative specification at `spec/v1.md`
