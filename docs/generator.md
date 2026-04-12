# Generator API

The generator module exports two public functions and the input interfaces needed to
call them.

## `generateDocument(input)`

Generates a `DSCPDocument` from the provided kernel state inputs.

```ts
function generateDocument(input: GeneratorInput): DSCPDocument
```

### Input interface

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

The input interfaces mirror the shape of a DSR `KernelState` without importing DSR
directly, preserving the dependency boundary.

### Sub-interfaces

```ts
interface TokenGraphInput {
  readonly tokens: ReadonlyMap<string, DtifFlattenedToken>;
  readonly byType: ReadonlyMap<TokenType, readonly DtifFlattenedToken[]>;
}

interface ComponentRegistryInput {
  readonly components: ReadonlyMap<string, ComponentInput>;
}

interface DeprecationLedgerInput {
  readonly entries: ReadonlyMap<string, DeprecationEntryInput>;
}

interface RuleRegistryInput {
  readonly rules: ReadonlyMap<string, RuleInput>;
}
```

### Return value

A fully-formed `DSCPDocument` with:

- `$schema` set to `DSCP_SCHEMA_URI`
- `specVersion` set to `DSCP_SPEC_VERSION`
- `generatedAt` set to `new Date().toISOString()`
- `kernelSnapshotHash` set to `input.snapshotHash`
- All sections populated from the corresponding input fields

### Token value serialisation

| Token value type | Serialised as |
|-----------------|---------------|
| `string` | Value as-is |
| `number` | `String(value)` |
| `boolean` | `String(value)` |
| `null` / `undefined` | Empty string `""` |
| Object / array | `JSON.stringify(value)` |

## `renderMarkdown(doc)`

Renders a `DSCPDocument` as a `DESIGN_SYSTEM.md` string.

```ts
function renderMarkdown(doc: DSCPDocument): string
```

### Output format

The rendered markdown includes:

1. A `# DESIGN_SYSTEM.md` heading
2. A preamble with the spec version, generation timestamp, and snapshot hash
3. One token section per token type (only active, non-deprecated tokens)
4. A violations section (only if violations exist)
5. A components section (only if components exist)
6. An active rules section (only if enabled rules exist)

Each section is wrapped in typed HTML comment markers for agent parsing:

```markdown
<!-- dscp:tokens:color -->
## Tokens: color
...
<!-- /dscp:tokens:color -->
```

### Omission rules

- Token types with no active (non-deprecated) tokens are omitted entirely.
- The violations section is omitted if `doc.violations` is empty.
- The components section is omitted if `doc.componentRegistry.totalCount === 0`.
- The rules section is omitted if no rules have `enabled: true`.

## Constants

```ts
export const DSCP_SCHEMA_URI = 'https://dscp.lapidist.net/schema/v1.json';
export const DSCP_SPEC_VERSION = '1.0.0';
```
