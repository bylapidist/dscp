# Specification

The normative DSCP v1 specification is maintained at `spec/v1.md` in the repository.
The JSON Schema for `DSCPDocument` is published at `schema/v1.json`.

This page summarises the key conformance requirements. For the full normative text,
read [spec/v1.md](https://github.com/bylapidist/dscp/blob/main/spec/v1.md).

## Document identity

Every conforming `DSCPDocument` must include:

| Field | Type | Description |
|-------|------|-------------|
| `$schema` | `string` | URI of the JSON Schema that validates this document |
| `specVersion` | `string` | Semver of the DSCP spec this document conforms to (currently `"1.0.0"`) |
| `generatedAt` | `string` | ISO 8601 timestamp of document generation |
| `kernelSnapshotHash` | `string` | SHA-256 hash of the kernel snapshot used as the source |

## Token graph

`tokenGraph` contains all resolved design tokens grouped by DTIF type.

```ts
interface DSCPTokenGraph {
  totalCount: number;
  byType: Partial<Record<TokenType, DSCPTokenEntry[]>>;
}

interface DSCPTokenEntry {
  pointer: string;     // DTIF pointer, e.g. "#/color/brand/primary"
  name: string;        // Dot-path name, e.g. "color.brand.primary"
  type: string;        // DTIF token type
  value: string;       // Serialised value (JSON for composite values)
  deprecated: boolean;
  replacement?: string; // Replacement pointer if deprecated
}
```

Only active (non-deprecated) tokens appear in the `DESIGN_SYSTEM.md` rendering.
Deprecated tokens are recorded in the deprecation ledger.

## Violation patterns

`violations` records raw values observed in the codebase that violate the design system.
Agents must not reproduce these values. If `correctToken` is set, agents must use that
token instead.

```ts
interface DSCPViolationPattern {
  property: string;          // CSS property, e.g. "color"
  rawValue: string;          // The bad value, e.g. "#3B82F6"
  frequency: number;         // How many times this was observed
  correctToken: string | null; // Token to use instead, or null if unknown
  agentAttributed: boolean;  // Whether this violation was introduced by an AI agent
}
```

## Rules

`rules` lists the lint rules active in the design system. Agents should assume any code
they generate will be linted against these rules.

```ts
interface DSCPRuleSummary {
  id: string;
  category: string;
  description: string;
  enabled: boolean;
  severity: 'error' | 'warn' | 'off';
  fixable: boolean;
}
```

## Versioning

DSCP uses semver. Breaking changes to the `DSCPDocument` shape increment the major
version of the spec and the `specVersion` field in documents. Consumers should reject
documents whose `specVersion` major is higher than the version they understand.

## Conformance

A conforming producer must:

1. Set `$schema` to the canonical schema URI for the spec version it targets.
2. Set `specVersion` to the exact spec version being conformed to.
3. Set `generatedAt` to a valid ISO 8601 timestamp.
4. Include all required fields defined in the JSON Schema.

A conforming consumer must:

1. Validate the document against the JSON Schema before processing.
2. Ignore unknown fields (forward compatibility).
3. Treat documents with an unknown major `specVersion` as invalid.
