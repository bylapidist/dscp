import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateDocument,
  renderMarkdown,
  DSCP_SCHEMA_URI,
  DSCP_SPEC_VERSION,
} from '../src/generator.js';
import type { GeneratorInput } from '../src/generator.js';

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const colorToken = {
  pointer: '#/color/primary',
  name: 'color.primary',
  type: 'color' as const,
  value: '#3B82F6',
  deprecated: false,
  description: undefined,
  group: undefined,
  extensions: undefined,
};

const spacingToken = {
  pointer: '#/spacing/4',
  name: 'spacing.4',
  type: 'spacing' as const,
  value: '16px',
  deprecated: false,
  description: undefined,
  group: undefined,
  extensions: undefined,
};

const minimalInput: GeneratorInput = {
  tokenGraph: {
    tokens: new Map(),
    byType: new Map(),
  },
  componentRegistry: {
    components: new Map(),
  },
  deprecationLedger: {
    entries: new Map(),
  },
  ruleRegistry: {
    rules: new Map(),
  },
  violations: [],
  snapshotHash: 'abc123',
};

const fullInput: GeneratorInput = {
  tokenGraph: {
    tokens: new Map([
      ['#/color/primary', colorToken],
      ['#/spacing/4', spacingToken],
    ]),
    byType: new Map([
      ['color', [colorToken]],
      ['spacing', [spacingToken]],
    ]),
  },
  componentRegistry: {
    components: new Map([
      [
        'Button',
        {
          name: 'Button',
          package: '@acme/ui',
          version: '1.2.3',
          deprecated: false,
        },
      ],
      [
        'OldButton',
        {
          name: 'OldButton',
          package: '@acme/ui',
          deprecated: true,
          replacedBy: 'Button',
        },
      ],
    ]),
  },
  deprecationLedger: {
    entries: new Map([
      [
        '#/color/old',
        {
          pointer: '#/color/old',
          replacement: '#/color/primary',
          since: '2026-01-01',
          reason: 'Replaced by new palette',
        },
      ],
    ]),
  },
  ruleRegistry: {
    rules: new Map([
      [
        'no-hardcoded-color',
        {
          id: 'no-hardcoded-color',
          category: 'tokens',
          description: 'No hardcoded color values',
          enabled: true,
          severity: 'error' as const,
          fixable: false,
        },
      ],
      [
        'disabled-rule',
        {
          id: 'disabled-rule',
          category: 'tokens',
          description: 'A disabled rule',
          enabled: false,
          severity: 'off' as const,
          fixable: false,
        },
      ],
    ]),
  },
  violations: [
    {
      property: 'color',
      rawValue: '#3B82F6',
      frequency: 3,
      correctToken: '#/color/primary',
      agentAttributed: false,
    },
    {
      property: 'font-size',
      rawValue: '14px',
      frequency: 1,
      correctToken: null,
      agentAttributed: true,
    },
  ],
  snapshotHash: 'deadbeef',
};

// ---------------------------------------------------------------------------
// generateDocument
// ---------------------------------------------------------------------------

describe('generateDocument', () => {
  it('returns a document with correct schema and spec version', () => {
    const doc = generateDocument(minimalInput);
    assert.equal(doc.$schema, DSCP_SCHEMA_URI);
    assert.equal(doc.specVersion, DSCP_SPEC_VERSION);
  });

  it('sets kernelSnapshotHash from input', () => {
    const doc = generateDocument(minimalInput);
    assert.equal(doc.kernelSnapshotHash, 'abc123');
  });

  it('generatedAt is a valid ISO 8601 timestamp', () => {
    const doc = generateDocument(minimalInput);
    const parsed = new Date(doc.generatedAt);
    assert.ok(!isNaN(parsed.getTime()));
  });

  it('builds empty tokenGraph for empty input', () => {
    const doc = generateDocument(minimalInput);
    assert.equal(doc.tokenGraph.totalCount, 0);
    assert.deepEqual(doc.tokenGraph.byType, {});
  });

  it('builds tokenGraph with correct totalCount', () => {
    const doc = generateDocument(fullInput);
    assert.equal(doc.tokenGraph.totalCount, 2);
  });

  it('groups tokens by type', () => {
    const doc = generateDocument(fullInput);
    assert.equal(doc.tokenGraph.byType.color?.length, 1);
    assert.equal(doc.tokenGraph.byType.spacing?.length, 1);
  });

  it('serialises token values correctly', () => {
    const doc = generateDocument(fullInput);
    const entries = doc.tokenGraph.byType.color;
    assert.ok(Array.isArray(entries) && entries.length > 0);
    assert.equal(entries[0].pointer, '#/color/primary');
    assert.equal(entries[0].value, '#3B82F6');
    assert.equal(entries[0].deprecated, false);
  });

  it('marks tokens as deprecated when in ledger', () => {
    const inputWithDeprecatedToken: GeneratorInput = {
      ...fullInput,
      tokenGraph: {
        tokens: new Map([
          ['#/color/old', { ...colorToken, pointer: '#/color/old', name: 'color.old' }],
        ]),
        byType: new Map([
          ['color', [{ ...colorToken, pointer: '#/color/old', name: 'color.old' }]],
        ]),
      },
    };
    const doc = generateDocument(inputWithDeprecatedToken);
    const entries = doc.tokenGraph.byType.color;
    assert.ok(Array.isArray(entries) && entries.length > 0);
    assert.equal(entries[0].deprecated, true);
    assert.equal(entries[0].replacement, '#/color/primary');
  });

  it('serialises null token value as empty string', () => {
    const nullValueToken = { ...colorToken, value: null as unknown as string };
    const input: GeneratorInput = {
      ...minimalInput,
      tokenGraph: {
        tokens: new Map([['#/color/x', nullValueToken]]),
        byType: new Map([['color', [nullValueToken]]]),
      },
    };
    const doc = generateDocument(input);
    const entries = doc.tokenGraph.byType.color;
    assert.ok(Array.isArray(entries) && entries.length > 0);
    assert.equal(entries[0].value, '');
  });

  it('serialises numeric token value as string', () => {
    const numericToken = { ...colorToken, value: 16 as unknown as string };
    const input: GeneratorInput = {
      ...minimalInput,
      tokenGraph: {
        tokens: new Map([['#/spacing/x', numericToken]]),
        byType: new Map([['spacing', [numericToken]]]),
      },
    };
    const doc = generateDocument(input);
    const entries = doc.tokenGraph.byType.spacing;
    assert.ok(Array.isArray(entries) && entries.length > 0);
    assert.equal(entries[0].value, '16');
  });

  it('serialises object token value as JSON', () => {
    const objValue = { x: 1, y: 2 };
    const objToken = { ...colorToken, value: objValue as unknown as string };
    const input: GeneratorInput = {
      ...minimalInput,
      tokenGraph: {
        tokens: new Map([['#/x', objToken]]),
        byType: new Map([['color', [objToken]]]),
      },
    };
    const doc = generateDocument(input);
    const entries = doc.tokenGraph.byType.color;
    assert.ok(Array.isArray(entries) && entries.length > 0);
    assert.equal(entries[0].value, JSON.stringify(objValue));
  });

  it('builds component summary', () => {
    const doc = generateDocument(fullInput);
    assert.equal(doc.componentRegistry.totalCount, 2);
    const names = doc.componentRegistry.components.map((c) => c.name);
    assert.ok(names.includes('Button'));
    assert.ok(names.includes('OldButton'));
  });

  it('sets deprecated flag on components', () => {
    const doc = generateDocument(fullInput);
    const oldButton = doc.componentRegistry.components.find((c) => c.name === 'OldButton');
    assert.ok(oldButton !== undefined);
    assert.equal(oldButton.deprecated, true);
    assert.equal(oldButton.replacedBy, 'Button');
  });

  it('sets deprecated: false when component.deprecated is undefined', () => {
    const input: GeneratorInput = {
      ...minimalInput,
      componentRegistry: {
        components: new Map([['Widget', { name: 'Widget', package: '@acme/ui' }]]),
      },
    };
    const doc = generateDocument(input);
    assert.equal(doc.componentRegistry.components[0]?.deprecated, false);
  });

  it('builds deprecation ledger', () => {
    const doc = generateDocument(fullInput);
    assert.equal(doc.deprecationLedger.length, 1);
    const ledgerEntry = doc.deprecationLedger[0];
    assert.equal(ledgerEntry.pointer, '#/color/old');
    assert.equal(ledgerEntry.replacement, '#/color/primary');
    assert.equal(ledgerEntry.since, '2026-01-01');
    assert.equal(ledgerEntry.reason, 'Replaced by new palette');
  });

  it('returns empty deprecation ledger for empty input', () => {
    const doc = generateDocument(minimalInput);
    assert.deepEqual(doc.deprecationLedger, []);
  });

  it('builds violations', () => {
    const doc = generateDocument(fullInput);
    assert.equal(doc.violations.length, 2);
    const v = doc.violations[0];
    assert.equal(v.property, 'color');
    assert.equal(v.rawValue, '#3B82F6');
    assert.equal(v.frequency, 3);
    assert.equal(v.correctToken, '#/color/primary');
    assert.equal(v.agentAttributed, false);
  });

  it('preserves null correctToken in violations', () => {
    const doc = generateDocument(fullInput);
    const v = doc.violations[1];
    assert.equal(v.correctToken, null);
    assert.equal(v.agentAttributed, true);
  });

  it('builds rule summaries', () => {
    const doc = generateDocument(fullInput);
    assert.equal(doc.rules.length, 2);
    const rule = doc.rules.find((r) => r.id === 'no-hardcoded-color');
    assert.ok(rule !== undefined);
    assert.equal(rule.category, 'tokens');
    assert.equal(rule.enabled, true);
    assert.equal(rule.severity, 'error');
    assert.equal(rule.fixable, false);
  });

  it('skips token type entries with no tokens in byType', () => {
    const input: GeneratorInput = {
      ...minimalInput,
      tokenGraph: {
        tokens: new Map(),
        byType: new Map([['color', []]]),
      },
    };
    const doc = generateDocument(input);
    assert.deepEqual(doc.tokenGraph.byType, {});
  });
});

// ---------------------------------------------------------------------------
// renderMarkdown
// ---------------------------------------------------------------------------

describe('renderMarkdown', () => {
  it('starts with the DESIGN_SYSTEM.md heading', () => {
    const doc = generateDocument(minimalInput);
    const md = renderMarkdown(doc);
    assert.ok(md.startsWith('# DESIGN_SYSTEM.md'));
  });

  it('includes specVersion and generatedAt in preamble', () => {
    const doc = generateDocument(minimalInput);
    const md = renderMarkdown(doc);
    assert.ok(md.includes(`v${DSCP_SPEC_VERSION}`));
    assert.ok(md.includes(doc.generatedAt));
  });

  it('includes kernelSnapshotHash in preamble', () => {
    const doc = generateDocument(minimalInput);
    const md = renderMarkdown(doc);
    assert.ok(md.includes('abc123'));
  });

  it('uses "none" when snapshotHash is empty', () => {
    const doc = generateDocument({ ...minimalInput, snapshotHash: '' });
    const md = renderMarkdown(doc);
    assert.ok(md.includes('`none`'));
  });

  it('renders token section with typed marker comments', () => {
    const doc = generateDocument(fullInput);
    const md = renderMarkdown(doc);
    assert.ok(md.includes('<!-- dscp:tokens:color -->'));
    assert.ok(md.includes('<!-- /dscp:tokens:color -->'));
    assert.ok(md.includes('## Tokens: color'));
  });

  it('renders token table rows', () => {
    const doc = generateDocument(fullInput);
    const md = renderMarkdown(doc);
    assert.ok(md.includes('`#/color/primary`'));
    assert.ok(md.includes('`#3B82F6`'));
  });

  it('omits deprecated tokens from token sections', () => {
    const inputWithDeprecatedToken: GeneratorInput = {
      ...minimalInput,
      tokenGraph: {
        tokens: new Map([
          ['#/color/old', { ...colorToken, pointer: '#/color/old', name: 'color.old' }],
        ]),
        byType: new Map([
          ['color', [{ ...colorToken, pointer: '#/color/old', name: 'color.old' }]],
        ]),
      },
      deprecationLedger: {
        entries: new Map([['#/color/old', { pointer: '#/color/old' }]]),
      },
    };
    const doc = generateDocument(inputWithDeprecatedToken);
    const md = renderMarkdown(doc);
    assert.ok(!md.includes('<!-- dscp:tokens:color -->'));
  });

  it('renders violations section', () => {
    const doc = generateDocument(fullInput);
    const md = renderMarkdown(doc);
    assert.ok(md.includes('<!-- dscp:violations -->'));
    assert.ok(md.includes('<!-- /dscp:violations -->'));
    assert.ok(md.includes('## Known violations'));
    assert.ok(md.includes('`color: #3B82F6`'));
    assert.ok(md.includes('→ use `#/color/primary`'));
  });

  it('renders "(no token found)" for null correctToken violations', () => {
    const doc = generateDocument(fullInput);
    const md = renderMarkdown(doc);
    assert.ok(md.includes('(no token found)'));
  });

  it('appends [agent] for agent-attributed violations', () => {
    const doc = generateDocument(fullInput);
    const md = renderMarkdown(doc);
    assert.ok(md.includes('[agent]'));
  });

  it('omits violations section when there are no violations', () => {
    const doc = generateDocument(minimalInput);
    const md = renderMarkdown(doc);
    assert.ok(!md.includes('<!-- dscp:violations -->'));
  });

  it('renders components section', () => {
    const doc = generateDocument(fullInput);
    const md = renderMarkdown(doc);
    assert.ok(md.includes('<!-- dscp:components -->'));
    assert.ok(md.includes('<!-- /dscp:components -->'));
    assert.ok(md.includes('## Components'));
    assert.ok(md.includes('`Button`'));
  });

  it('renders deprecated component with replacement', () => {
    const doc = generateDocument(fullInput);
    const md = renderMarkdown(doc);
    assert.ok(md.includes('Yes → `Button`'));
  });

  it('renders deprecated component without replacement', () => {
    const input: GeneratorInput = {
      ...minimalInput,
      componentRegistry: {
        components: new Map([['Old', { name: 'Old', package: '@acme/ui', deprecated: true }]]),
      },
    };
    const doc = generateDocument(input);
    const md = renderMarkdown(doc);
    assert.ok(md.includes('Yes'));
    assert.ok(!md.includes('Yes →'));
  });

  it('omits components section when registry is empty', () => {
    const doc = generateDocument(minimalInput);
    const md = renderMarkdown(doc);
    assert.ok(!md.includes('<!-- dscp:components -->'));
  });

  it('renders rules section with only enabled rules', () => {
    const doc = generateDocument(fullInput);
    const md = renderMarkdown(doc);
    assert.ok(md.includes('<!-- dscp:rules -->'));
    assert.ok(md.includes('<!-- /dscp:rules -->'));
    assert.ok(md.includes('## Active rules'));
    assert.ok(md.includes('`no-hardcoded-color`'));
    assert.ok(!md.includes('`disabled-rule`'));
  });

  it('omits rules section when all rules are disabled', () => {
    const input: GeneratorInput = {
      ...minimalInput,
      ruleRegistry: {
        rules: new Map([
          [
            'off-rule',
            {
              id: 'off-rule',
              category: 'tokens',
              description: 'Off',
              enabled: false,
              severity: 'off' as const,
              fixable: false,
            },
          ],
        ]),
      },
    };
    const doc = generateDocument(input);
    const md = renderMarkdown(doc);
    assert.ok(!md.includes('<!-- dscp:rules -->'));
  });

  it('renders fixable Yes/No correctly', () => {
    const input: GeneratorInput = {
      ...minimalInput,
      ruleRegistry: {
        rules: new Map([
          [
            'fixable-rule',
            {
              id: 'fixable-rule',
              category: 'tokens',
              description: 'Fixable',
              enabled: true,
              severity: 'warn' as const,
              fixable: true,
            },
          ],
        ]),
      },
    };
    const doc = generateDocument(input);
    const md = renderMarkdown(doc);
    assert.ok(md.includes('Yes'));
  });
});
