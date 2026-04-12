# DSCPDocument shape

`DSCPDocument` is the top-level envelope. Every field is readonly.

## Top-level fields

```ts
interface DSCPDocument {
  readonly $schema: string;
  readonly specVersion: string;
  readonly generatedAt: string;
  readonly kernelSnapshotHash: string;
  readonly tokenGraph: DSCPTokenGraph;
  readonly componentRegistry: DSCPComponentSummary;
  readonly deprecationLedger: DSCPDeprecationEntry[];
  readonly violations: DSCPViolationPattern[];
  readonly rules: DSCPRuleSummary[];
}
```

## Token graph

```ts
interface DSCPTokenGraph {
  readonly totalCount: number;
  readonly byType: Partial<Record<TokenType, DSCPTokenEntry[]>>;
}

interface DSCPTokenEntry {
  readonly pointer: string;
  readonly name: string;
  readonly type: string;
  readonly value: string;
  readonly deprecated: boolean;
  readonly replacement?: string;
}
```

`totalCount` is the total number of tokens across all types. `byType` groups them by
their DTIF token type (e.g. `color`, `spacing`, `typography`). A type key is present
only when at least one token of that type exists.

## Component registry

```ts
interface DSCPComponentSummary {
  readonly totalCount: number;
  readonly components: DSCPComponentEntry[];
}

interface DSCPComponentEntry {
  readonly name: string;
  readonly package: string;
  readonly version?: string;
  readonly deprecated: boolean;
  readonly replacedBy?: string;
}
```

## Deprecation ledger

```ts
interface DSCPDeprecationEntry {
  readonly pointer: string;
  readonly replacement?: string;
  readonly since?: string;
  readonly reason?: string;
}
```

Each entry records a deprecated token pointer. `replacement` is the pointer of the
token that should be used instead, if one exists. `since` and `reason` are informational.

## Violation patterns

```ts
interface DSCPViolationPattern {
  readonly property: string;
  readonly rawValue: string;
  readonly frequency: number;
  readonly correctToken: string | null;
  readonly agentAttributed: boolean;
}
```

## Rule summaries

```ts
type DSCPRuleSeverity = 'error' | 'warn' | 'off';

interface DSCPRuleSummary {
  readonly id: string;
  readonly category: string;
  readonly description: string;
  readonly enabled: boolean;
  readonly severity: DSCPRuleSeverity;
  readonly fixable: boolean;
}
```

## Section tags

The `DSCPSectionTag` type names the HTML comment markers used in `DESIGN_SYSTEM.md`:

```ts
type DSCPSectionTag =
  | `dscp:tokens:${TokenType}`
  | 'dscp:violations'
  | 'dscp:components'
  | 'dscp:rules';
```
