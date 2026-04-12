import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isRecord,
  isDSCPTokenEntry,
  isDSCPTokenGraph,
  isDSCPComponentEntry,
  isDSCPComponentSummary,
  isDSCPDeprecationEntry,
  isDSCPViolationPattern,
  isDSCPRuleSummary,
  isDSCPDocument,
} from '../src/guards.js';

const validTokenEntry = {
  pointer: '#/color/primary',
  name: 'color.primary',
  type: 'color',
  value: '#3B82F6',
  deprecated: false,
};

const validComponentEntry = {
  name: 'Button',
  package: '@acme/ui',
  deprecated: false,
};

const validViolation = {
  property: 'color',
  rawValue: '#3B82F6',
  frequency: 3,
  correctToken: '#/color/primary',
  agentAttributed: false,
};

const validRule = {
  id: 'no-hardcoded-color',
  category: 'tokens',
  description: 'No hardcoded color values',
  enabled: true,
  severity: 'error',
  fixable: false,
};

const validDoc = {
  $schema: 'https://dscp.lapidist.net/schema/v1.json',
  specVersion: '1.0.0',
  generatedAt: '2026-01-01T00:00:00.000Z',
  kernelSnapshotHash: 'abc123',
  tokenGraph: { totalCount: 1, byType: { color: [validTokenEntry] } },
  componentRegistry: { totalCount: 1, components: [validComponentEntry] },
  deprecationLedger: [],
  violations: [validViolation],
  rules: [validRule],
};

describe('isRecord', () => {
  it('returns true for plain objects', () => {
    assert.ok(isRecord({}));
    assert.ok(isRecord({ a: 1 }));
  });

  it('returns false for null, arrays, primitives', () => {
    assert.ok(!isRecord(null));
    assert.ok(!isRecord([]));
    assert.ok(!isRecord('string'));
    assert.ok(!isRecord(42));
  });
});

describe('isDSCPTokenEntry', () => {
  it('accepts a valid token entry', () => {
    assert.ok(isDSCPTokenEntry(validTokenEntry));
  });

  it('accepts a deprecated token entry with replacement', () => {
    assert.ok(
      isDSCPTokenEntry({
        ...validTokenEntry,
        deprecated: true,
        replacement: '#/color/new',
      }),
    );
  });

  it('rejects missing required fields', () => {
    assert.ok(!isDSCPTokenEntry({ pointer: '#/x', name: 'x', type: 'color', value: '#f00' }));
    assert.ok(!isDSCPTokenEntry(null));
  });
});

describe('isDSCPTokenGraph', () => {
  it('accepts a valid token graph', () => {
    assert.ok(isDSCPTokenGraph({ totalCount: 0, byType: {} }));
    assert.ok(isDSCPTokenGraph({ totalCount: 1, byType: { color: [validTokenEntry] } }));
  });

  it('rejects invalid token graphs', () => {
    assert.ok(!isDSCPTokenGraph({ totalCount: 0 }));
    assert.ok(!isDSCPTokenGraph(null));
  });
});

describe('isDSCPComponentEntry', () => {
  it('accepts a valid component entry', () => {
    assert.ok(isDSCPComponentEntry(validComponentEntry));
  });

  it('rejects missing required fields', () => {
    assert.ok(!isDSCPComponentEntry({ name: 'Button', deprecated: false }));
    assert.ok(!isDSCPComponentEntry(null));
  });
});

describe('isDSCPComponentSummary', () => {
  it('accepts a valid component summary', () => {
    assert.ok(isDSCPComponentSummary({ totalCount: 1, components: [validComponentEntry] }));
    assert.ok(isDSCPComponentSummary({ totalCount: 0, components: [] }));
  });

  it('rejects invalid component summaries', () => {
    assert.ok(!isDSCPComponentSummary({ totalCount: 0 }));
    assert.ok(!isDSCPComponentSummary(null));
  });
});

describe('isDSCPDeprecationEntry', () => {
  it('accepts entries with just a pointer', () => {
    assert.ok(isDSCPDeprecationEntry({ pointer: '#/color/old' }));
  });

  it('accepts entries with all optional fields', () => {
    assert.ok(
      isDSCPDeprecationEntry({
        pointer: '#/color/old',
        replacement: '#/color/new',
        since: '2026-01-01',
        reason: 'Replaced by new palette',
      }),
    );
  });

  it('rejects entries without pointer', () => {
    assert.ok(!isDSCPDeprecationEntry({ replacement: '#/color/new' }));
    assert.ok(!isDSCPDeprecationEntry(null));
  });
});

describe('isDSCPViolationPattern', () => {
  it('accepts a valid violation pattern', () => {
    assert.ok(isDSCPViolationPattern(validViolation));
  });

  it('accepts a violation with null correctToken', () => {
    assert.ok(isDSCPViolationPattern({ ...validViolation, correctToken: null }));
  });

  it('rejects missing required fields', () => {
    assert.ok(!isDSCPViolationPattern({ property: 'color', rawValue: '#f00' }));
    assert.ok(!isDSCPViolationPattern(null));
  });
});

describe('isDSCPRuleSummary', () => {
  it('accepts a valid rule summary', () => {
    assert.ok(isDSCPRuleSummary(validRule));
  });

  it('accepts all severity values', () => {
    assert.ok(isDSCPRuleSummary({ ...validRule, severity: 'warn' }));
    assert.ok(isDSCPRuleSummary({ ...validRule, severity: 'off' }));
  });

  it('rejects invalid severity', () => {
    assert.ok(!isDSCPRuleSummary({ ...validRule, severity: 'critical' }));
  });

  it('rejects missing required fields', () => {
    assert.ok(!isDSCPRuleSummary({ id: 'x', category: 'y' }));
    assert.ok(!isDSCPRuleSummary(null));
  });
});

describe('isDSCPDocument', () => {
  it('accepts a valid document', () => {
    assert.ok(isDSCPDocument(validDoc));
  });

  it('rejects missing required fields', () => {
    const docWithoutSchema = {
      specVersion: validDoc.specVersion,
      generatedAt: validDoc.generatedAt,
      kernelSnapshotHash: validDoc.kernelSnapshotHash,
      tokenGraph: validDoc.tokenGraph,
      componentRegistry: validDoc.componentRegistry,
      deprecationLedger: validDoc.deprecationLedger,
      violations: validDoc.violations,
      rules: validDoc.rules,
    };
    assert.ok(!isDSCPDocument(docWithoutSchema));
    assert.ok(!isDSCPDocument(null));
    assert.ok(!isDSCPDocument('string'));
  });
});
