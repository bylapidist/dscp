---
'@lapidist/dscp': minor
---

Introduce `TokenInput` interface and decouple generator from `@lapidist/dtif-parser`.

`buildDocument` / `generateDocument` now accept a minimal `TokenInput` shape (`pointer`, `name`, `type?`, `value?`) instead of requiring `DtifFlattenedToken`. Any object that satisfies `TokenInput` works — including `DtifFlattenedToken` structurally — so existing DSR-backed callers continue without changes.

Breaking changes:
- `DtifFlattenedToken` and `TokenType` are no longer re-exported from `@lapidist/dscp`; import them from `@lapidist/dtif-parser` directly if needed
- `DSCPTokenGraph.byType` widened to `Partial<Record<string, DSCPTokenEntry[]>>` (string keys instead of `TokenType`)
- `DSCPSectionTag` now uses a template literal `dscp:tokens:${string}` instead of the fixed union
