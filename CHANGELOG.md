# @lapidist/dscp — Changelog

## 0.2.3

### Patch Changes

- e56fe9d: docs(installation): remove incorrect dtif-parser peer dependency claim — dscp has no dependency on dtif-parser
- e56fe9d: fix(schema): point DSCP_SCHEMA_URI to GitHub raw URL

  `dscp.lapidist.net/schema/v1.json` is not yet live. Point to the GitHub
  raw URL (`raw.githubusercontent.com/bylapidist/dscp/main/schema/v1.json`)
  so generated DSCP documents reference a resolvable schema immediately.

## 0.2.2

### Patch Changes

- 16d0fa3: docs(installation): remove incorrect dtif-parser peer dependency claim — dscp has no dependency on dtif-parser
- 16d0fa3: fix(schema): point DSCP_SCHEMA_URI to GitHub raw URL

  `dscp.lapidist.net/schema/v1.json` is not yet live. Point to the GitHub
  raw URL (`raw.githubusercontent.com/bylapidist/dscp/main/schema/v1.json`)
  so generated DSCP documents reference a resolvable schema immediately.

## 0.2.1

### Patch Changes

- 82d3639: docs(installation): remove incorrect dtif-parser peer dependency claim — dscp has no dependency on dtif-parser

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
