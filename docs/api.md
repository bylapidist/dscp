# API Reference

Complete export reference for `@lapidist/dscp`.

## Functions

### `generateDocument(input)`

```ts
import { generateDocument } from '@lapidist/dscp';

function generateDocument(input: GeneratorInput): DSCPDocument
```

Generates a fully-formed `DSCPDocument` from kernel state inputs. See the
[Generator API](/generator) page for full documentation.

### `renderMarkdown(doc)`

```ts
import { renderMarkdown } from '@lapidist/dscp';

function renderMarkdown(doc: DSCPDocument): string
```

Renders a `DSCPDocument` as a `DESIGN_SYSTEM.md` string with typed section markers.
See the [DESIGN\_SYSTEM.md format](/markdown) page for the output format.

## Type guards

All type guards accept `unknown` and return a type predicate.

| Export | Predicate |
|--------|-----------|
| `isRecord` | `value is Record<string, unknown>` |
| `isDSCPDocument` | `value is DSCPDocument` |
| `isDSCPTokenGraph` | `value is DSCPTokenGraph` |
| `isDSCPTokenEntry` | `value is DSCPTokenEntry` |
| `isDSCPComponentSummary` | `value is DSCPComponentSummary` |
| `isDSCPComponentEntry` | `value is DSCPComponentEntry` |
| `isDSCPDeprecationEntry` | `value is DSCPDeprecationEntry` |
| `isDSCPViolationPattern` | `value is DSCPViolationPattern` |
| `isDSCPRuleSummary` | `value is DSCPRuleSummary` |

See the [Type guards](/guards) page for usage examples.

## Constants

```ts
export const DSCP_SCHEMA_URI: string;   // 'https://dscp.lapidist.net/schema/v1.json'
export const DSCP_SPEC_VERSION: string; // '1.0.0'
```

## Interfaces — document types

### `DSCPDocument`

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

### `DSCPTokenGraph`

```ts
interface DSCPTokenGraph {
  readonly totalCount: number;
  readonly byType: Partial<Record<TokenType, DSCPTokenEntry[]>>;
}
```

### `DSCPTokenEntry`

```ts
interface DSCPTokenEntry {
  readonly pointer: string;
  readonly name: string;
  readonly type: string;
  readonly value: string;
  readonly deprecated: boolean;
  readonly replacement?: string;
}
```

### `DSCPComponentSummary`

```ts
interface DSCPComponentSummary {
  readonly totalCount: number;
  readonly components: DSCPComponentEntry[];
}
```

### `DSCPComponentEntry`

```ts
interface DSCPComponentEntry {
  readonly name: string;
  readonly package: string;
  readonly version?: string;
  readonly deprecated: boolean;
  readonly replacedBy?: string;
}
```

### `DSCPDeprecationEntry`

```ts
interface DSCPDeprecationEntry {
  readonly pointer: string;
  readonly replacement?: string;
  readonly since?: string;
  readonly reason?: string;
}
```

### `DSCPViolationPattern`

```ts
interface DSCPViolationPattern {
  readonly property: string;
  readonly rawValue: string;
  readonly frequency: number;
  readonly correctToken: string | null;
  readonly agentAttributed: boolean;
}
```

### `DSCPRuleSummary`

```ts
interface DSCPRuleSummary {
  readonly id: string;
  readonly category: string;
  readonly description: string;
  readonly enabled: boolean;
  readonly severity: 'error' | 'warn' | 'off';
  readonly fixable: boolean;
}
```

## Interfaces — generator input

### `GeneratorInput`

```ts
interface GeneratorInput {
  readonly tokenGraph: TokenGraphInput;
  readonly componentRegistry: ComponentRegistryInput;
  readonly deprecationLedger: DeprecationLedgerInput;
  readonly ruleRegistry: RuleRegistryInput;
  readonly violations: readonly ViolationInput[];
  readonly snapshotHash: string;
}
```

### `TokenGraphInput`

```ts
interface TokenGraphInput {
  readonly tokens: ReadonlyMap<string, DtifFlattenedToken>;
  readonly byType: ReadonlyMap<TokenType, readonly DtifFlattenedToken[]>;
}
```

### `ComponentRegistryInput`

```ts
interface ComponentRegistryInput {
  readonly components: ReadonlyMap<string, ComponentInput>;
}

interface ComponentInput {
  readonly name: string;
  readonly package: string;
  readonly version?: string;
  readonly deprecated?: boolean;
  readonly replacedBy?: string;
}
```

### `DeprecationLedgerInput`

```ts
interface DeprecationLedgerInput {
  readonly entries: ReadonlyMap<string, DeprecationEntryInput>;
}

interface DeprecationEntryInput {
  readonly pointer: string;
  readonly replacement?: string;
  readonly since?: string;
  readonly reason?: string;
}
```

### `RuleRegistryInput`

```ts
interface RuleRegistryInput {
  readonly rules: ReadonlyMap<string, RuleInput>;
}

interface RuleInput {
  readonly id: string;
  readonly category: string;
  readonly description: string;
  readonly enabled: boolean;
  readonly severity: 'error' | 'warn' | 'off';
  readonly fixable: boolean;
}
```

### `ViolationInput`

```ts
interface ViolationInput {
  readonly property: string;
  readonly rawValue: string;
  readonly frequency: number;
  readonly correctToken: string | null;
  readonly agentAttributed: boolean;
}
```

## Type aliases

```ts
type DSCPRuleSeverity = 'error' | 'warn' | 'off';

type DSCPSectionTag =
  | `dscp:tokens:${TokenType}`
  | 'dscp:violations'
  | 'dscp:components'
  | 'dscp:rules';
```
