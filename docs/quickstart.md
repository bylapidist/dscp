# Quickstart

This guide walks through generating a `DSCPDocument` and rendering it as a
`DESIGN_SYSTEM.md` file.

## Build the input

The `GeneratorInput` interface mirrors the shape of a DSR kernel state. You populate it
from whatever source holds your design system data — a token build output, a kernel
snapshot, or a hand-crafted fixture for tests.

```ts
import type { GeneratorInput } from '@lapidist/dscp';

const input: GeneratorInput = {
  tokenGraph: {
    tokens: new Map([
      [
        '#/color/brand/primary',
        {
          pointer: '#/color/brand/primary',
          name: 'color.brand.primary',
          type: 'color',
          value: '#3B82F6',
        },
      ],
    ]),
    byType: new Map([
      [
        'color',
        [
          {
            pointer: '#/color/brand/primary',
            name: 'color.brand.primary',
            type: 'color',
            value: '#3B82F6',
          },
        ],
      ],
    ]),
  },
  componentRegistry: {
    components: new Map([
      ['Button', { name: 'Button', package: '@acme/ui', deprecated: false }],
    ]),
  },
  deprecationLedger: { entries: new Map() },
  ruleRegistry: {
    rules: new Map([
      [
        'no-hardcoded-color',
        {
          id: 'no-hardcoded-color',
          category: 'tokens',
          description: 'Disallow hardcoded color values',
          enabled: true,
          severity: 'error',
          fixable: false,
        },
      ],
    ]),
  },
  violations: [
    {
      property: 'color',
      rawValue: '#3B82F6',
      frequency: 4,
      correctToken: '#/color/brand/primary',
      agentAttributed: false,
    },
  ],
  snapshotHash: 'abc123',
};
```

## Generate the document

```ts
import { generateDocument } from '@lapidist/dscp';

const doc = generateDocument(input);

console.log(doc.$schema);       // https://dscp.lapidist.net/schema/v1.json
console.log(doc.specVersion);   // 1.0.0
console.log(doc.generatedAt);   // ISO 8601 timestamp
```

## Render to markdown

```ts
import { renderMarkdown } from '@lapidist/dscp';
import { writeFileSync } from 'node:fs';

const markdown = renderMarkdown(doc);
writeFileSync('DESIGN_SYSTEM.md', markdown, 'utf-8');
```

The resulting file is ready to drop into your repository root. AI coding agents can read
it directly, and humans can read the rendered markdown in any editor or on GitHub.

## Validate an incoming document

Use the type guard to validate a `DSCPDocument` from an external source before passing
it to downstream consumers:

```ts
import { isDSCPDocument } from '@lapidist/dscp';

const raw: unknown = JSON.parse(fs.readFileSync('DESIGN_SYSTEM.json', 'utf-8'));

if (!isDSCPDocument(raw)) {
  throw new Error('Invalid DSCP document');
}

// raw is now typed as DSCPDocument
console.log(raw.tokenGraph.totalCount);
```
