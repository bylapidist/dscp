# @lapidist/dscp

**Design System Context Protocol** — a versioned specification and type package for
communicating design system constraints to generative AI models before code generation.

Part of the [Lapidist](https://lapidist.net) ecosystem v8 architecture.

## Overview

DSCP defines a structured `DSCPDocument` that encodes the complete set of information an
AI agent needs to generate design-system-conformant code: tokens, components, deprecations,
violation patterns, and active lint rules.

The protocol is tool-agnostic. DSR, dtifx, and third-party tools can all produce DSCP
documents.

## Installation

```sh
pnpm add @lapidist/dscp
```

## Usage

### Generate a DSCP document

```ts
import { generateDocument } from '@lapidist/dscp';

const doc = generateDocument({
  tokenGraph: { tokens: myTokenMap, byType: myByTypeMap },
  componentRegistry: { components: myComponentMap },
  deprecationLedger: { entries: myDeprecationMap },
  ruleRegistry: { rules: myRuleMap },
  violations: [],
  snapshotHash: 'abc123',
});
```

### Render DESIGN_SYSTEM.md

```ts
import { generateDocument, renderMarkdown } from '@lapidist/dscp';

const doc = generateDocument(input);
const markdown = renderMarkdown(doc);
// Write to ./DESIGN_SYSTEM.md
```

### Validate a document

```ts
import { isDSCPDocument } from '@lapidist/dscp';

const parsed: unknown = JSON.parse(rawJson);
if (isDSCPDocument(parsed)) {
  // parsed is typed as DSCPDocument
}
```

## Specification

See [`spec/v1.md`](./spec/v1.md) for the normative specification.
See [`schema/v1.json`](./schema/v1.json) for the JSON Schema.

## Dependency rules

DSCP depends only on `@lapidist/dtif-parser` for token types. It must never depend on
`@lapidist/dsr` or `@lapidist/design-lint`.

## License

MIT — see [LICENSE](./LICENSE).
