# Type guards

`@lapidist/dscp` exports a type predicate for every type in the package. Use them to
validate `unknown` values from JSON parsing, IPC messages, or external APIs before
passing them to typed code.

## `isRecord(value)`

```ts
function isRecord(value: unknown): value is Record<string, unknown>
```

Returns `true` if `value` is a non-null plain object (not an array). This is the base
guard used internally by all other predicates.

## `isDSCPDocument(value)`

```ts
function isDSCPDocument(value: unknown): value is DSCPDocument
```

Validates the full document envelope, including nested sub-structures.

## `isDSCPTokenGraph(value)`

```ts
function isDSCPTokenGraph(value: unknown): value is DSCPTokenGraph
```

## `isDSCPTokenEntry(value)`

```ts
function isDSCPTokenEntry(value: unknown): value is DSCPTokenEntry
```

A valid token entry requires `pointer`, `name`, `type`, `value`, and `deprecated`. The
optional `replacement` field is accepted when present.

## `isDSCPComponentSummary(value)`

```ts
function isDSCPComponentSummary(value: unknown): value is DSCPComponentSummary
```

## `isDSCPComponentEntry(value)`

```ts
function isDSCPComponentEntry(value: unknown): value is DSCPComponentEntry
```

## `isDSCPDeprecationEntry(value)`

```ts
function isDSCPDeprecationEntry(value: unknown): value is DSCPDeprecationEntry
```

Only `pointer` is required. `replacement`, `since`, and `reason` are optional.

## `isDSCPViolationPattern(value)`

```ts
function isDSCPViolationPattern(value: unknown): value is DSCPViolationPattern
```

`correctToken` may be `string` or `null`.

## `isDSCPRuleSummary(value)`

```ts
function isDSCPRuleSummary(value: unknown): value is DSCPRuleSummary
```

`severity` must be one of `"error"`, `"warn"`, or `"off"`. Any other value causes the
predicate to return `false`.

## Usage pattern

```ts
import { isDSCPDocument } from '@lapidist/dscp';

const raw: unknown = JSON.parse(text);

if (!isDSCPDocument(raw)) {
  throw new Error(`Invalid DSCP document: specVersion=${
    typeof raw === 'object' && raw !== null && 'specVersion' in raw
      ? String((raw as Record<string, unknown>).specVersion)
      : 'unknown'
  }`);
}

// raw is now DSCPDocument
console.log(raw.tokenGraph.totalCount);
```
