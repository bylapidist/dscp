import type {
  DSCPDocument,
  DSCPTokenEntry,
  DSCPTokenGraph,
  DSCPComponentEntry,
  DSCPComponentSummary,
  DSCPDeprecationEntry,
  DSCPViolationPattern,
  DSCPRuleSummary,
} from './types.js';

// ---------------------------------------------------------------------------
// Generator input — tool-agnostic; no dependency on @lapidist/dtif-parser
// ---------------------------------------------------------------------------

/**
 * Minimal token shape required by the DSCP generator.
 * Both @lapidist/dtif-parser DtifFlattenedToken objects and simpler
 * representations (e.g. dtifx build output) satisfy this interface.
 */
export interface TokenInput {
  readonly pointer: string;
  readonly name: string;
  readonly type?: string;
  readonly value?: unknown;
}

export interface TokenGraphInput {
  /** All tokens keyed by pointer. `.size` is used for `totalCount`. */
  readonly tokens: ReadonlyMap<string, TokenInput>;
  /** Tokens pre-grouped by type string. */
  readonly byType: ReadonlyMap<string, readonly TokenInput[]>;
}

export interface RuleInput {
  readonly id: string;
  readonly category: string;
  readonly description: string;
  readonly enabled: boolean;
  readonly severity: 'error' | 'warn' | 'off';
  readonly fixable: boolean;
}

export interface ComponentInput {
  readonly name: string;
  readonly package: string;
  readonly version?: string;
  readonly deprecated?: boolean;
  readonly replacedBy?: string;
}

export interface DeprecationEntryInput {
  readonly pointer: string;
  readonly replacement?: string;
  readonly since?: string;
  readonly reason?: string;
}

export interface DeprecationLedgerInput {
  readonly entries: ReadonlyMap<string, DeprecationEntryInput>;
}

export interface ComponentRegistryInput {
  readonly components: ReadonlyMap<string, ComponentInput>;
}

export interface RuleRegistryInput {
  readonly rules: ReadonlyMap<string, RuleInput>;
}

export interface ViolationInput {
  readonly property: string;
  readonly rawValue: string;
  readonly frequency: number;
  readonly correctToken: string | null;
  readonly agentAttributed: boolean;
}

export interface GeneratorInput {
  readonly tokenGraph: TokenGraphInput;
  readonly componentRegistry: ComponentRegistryInput;
  readonly deprecationLedger: DeprecationLedgerInput;
  readonly ruleRegistry: RuleRegistryInput;
  readonly violations: readonly ViolationInput[];
  readonly snapshotHash: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const DSCP_SCHEMA_URI = 'https://dscp.lapidist.net/schema/v1.json';

export const DSCP_SPEC_VERSION = '1.0.0';

// ---------------------------------------------------------------------------
// Token serialisation
// ---------------------------------------------------------------------------

function tokenValueString(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return JSON.stringify(value);
}

function toTokenEntry(
  token: TokenInput,
  deprecationLedger: DeprecationLedgerInput,
): DSCPTokenEntry {
  const entry = deprecationLedger.entries.get(token.pointer);
  return {
    pointer: token.pointer,
    name: token.name,
    type: token.type ?? 'unknown',
    value: tokenValueString(token.value),
    deprecated: entry !== undefined,
    replacement: entry?.replacement,
  };
}

function buildTokenGraph(
  input: TokenGraphInput,
  deprecationLedger: DeprecationLedgerInput,
): DSCPTokenGraph {
  const byType: Record<string, DSCPTokenEntry[]> = {};

  for (const [type, tokens] of input.byType) {
    const entries = tokens.map((t) => toTokenEntry(t, deprecationLedger));
    if (entries.length > 0) {
      byType[type] = entries;
    }
  }

  return {
    totalCount: input.tokens.size,
    byType,
  };
}

// ---------------------------------------------------------------------------
// Component registry
// ---------------------------------------------------------------------------

function buildComponentSummary(input: ComponentRegistryInput): DSCPComponentSummary {
  const components: DSCPComponentEntry[] = [...input.components.values()].map((c) => ({
    name: c.name,
    package: c.package,
    version: c.version,
    deprecated: c.deprecated === true,
    replacedBy: c.replacedBy,
  }));

  return { totalCount: components.length, components };
}

// ---------------------------------------------------------------------------
// Deprecation ledger
// ---------------------------------------------------------------------------

function buildDeprecationLedger(input: DeprecationLedgerInput): DSCPDeprecationEntry[] {
  return [...input.entries.values()].map((e) => ({
    pointer: e.pointer,
    replacement: e.replacement,
    since: e.since,
    reason: e.reason,
  }));
}

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

function buildRuleSummaries(input: RuleRegistryInput): DSCPRuleSummary[] {
  return [...input.rules.values()].map((r) => ({
    id: r.id,
    category: r.category,
    description: r.description,
    enabled: r.enabled,
    severity: r.severity,
    fixable: r.fixable,
  }));
}

// ---------------------------------------------------------------------------
// Violations
// ---------------------------------------------------------------------------

function buildViolations(violations: readonly ViolationInput[]): DSCPViolationPattern[] {
  return violations.map((v) => ({
    property: v.property,
    rawValue: v.rawValue,
    frequency: v.frequency,
    correctToken: v.correctToken,
    agentAttributed: v.agentAttributed,
  }));
}

// ---------------------------------------------------------------------------
// Public: generateDocument
// ---------------------------------------------------------------------------

/**
 * Generates a DSCPDocument from the provided kernel state inputs.
 * This is the primary entry point for DSCP document generation.
 */
export function generateDocument(input: GeneratorInput): DSCPDocument {
  return {
    $schema: DSCP_SCHEMA_URI,
    specVersion: DSCP_SPEC_VERSION,
    generatedAt: new Date().toISOString(),
    kernelSnapshotHash: input.snapshotHash,
    tokenGraph: buildTokenGraph(input.tokenGraph, input.deprecationLedger),
    componentRegistry: buildComponentSummary(input.componentRegistry),
    deprecationLedger: buildDeprecationLedger(input.deprecationLedger),
    violations: buildViolations(input.violations),
    rules: buildRuleSummaries(input.ruleRegistry),
  };
}

// ---------------------------------------------------------------------------
// Public: renderMarkdown
// ---------------------------------------------------------------------------

/**
 * Renders a DSCPDocument as a DESIGN_SYSTEM.md string.
 *
 * Structured for both human reading and agent parsing via typed fenced blocks:
 *   <!-- dscp:tokens:color -->
 *   | Token | Value | Use for |
 *   ...
 *   <!-- /dscp:tokens:color -->
 */
export function renderMarkdown(doc: DSCPDocument): string {
  const lines: string[] = [];

  lines.push('# DESIGN_SYSTEM.md');
  lines.push('');
  lines.push(`> Generated by @lapidist/dscp v${doc.specVersion} at ${doc.generatedAt}`);
  lines.push(`> Kernel snapshot: \`${doc.kernelSnapshotHash || 'none'}\``);
  lines.push('');

  // Token sections per type
  for (const [type, entries] of Object.entries(doc.tokenGraph.byType)) {
    if (!entries || entries.length === 0) continue;
    const activeEntries = entries.filter((e) => !e.deprecated);
    if (activeEntries.length === 0) continue;

    lines.push(`<!-- dscp:tokens:${type} -->`);
    lines.push(`## Tokens: ${type}`);
    lines.push('');
    lines.push('| Token | Value | Deprecated |');
    lines.push('|-------|-------|------------|');
    for (const entry of activeEntries) {
      lines.push(`| \`${entry.pointer}\` | \`${entry.value}\` | No |`);
    }
    lines.push('');
    lines.push(`<!-- /dscp:tokens:${type} -->`);
    lines.push('');
  }

  // Violations
  if (doc.violations.length > 0) {
    lines.push('<!-- dscp:violations -->');
    lines.push('## Known violations');
    lines.push('');
    lines.push(
      'The following raw values have been observed in the codebase. Use the corresponding token instead.',
    );
    lines.push('');
    for (const v of doc.violations) {
      const correction =
        v.correctToken !== null ? `→ use \`${v.correctToken}\`` : '(no token found)';
      const agent = v.agentAttributed ? ' [agent]' : '';
      lines.push(
        `- **DO NOT use** \`${v.property}: ${v.rawValue}\` ${correction}${agent} (seen ${v.frequency.toString()} times)`,
      );
    }
    lines.push('');
    lines.push('<!-- /dscp:violations -->');
    lines.push('');
  }

  // Components
  if (doc.componentRegistry.totalCount > 0) {
    lines.push('<!-- dscp:components -->');
    lines.push('## Components');
    lines.push('');
    lines.push('| Component | Package | Deprecated |');
    lines.push('|-----------|---------|------------|');
    for (const c of doc.componentRegistry.components) {
      const deprecated = c.deprecated ? `Yes${c.replacedBy ? ` → \`${c.replacedBy}\`` : ''}` : 'No';
      lines.push(`| \`${c.name}\` | \`${c.package}\` | ${deprecated} |`);
    }
    lines.push('');
    lines.push('<!-- /dscp:components -->');
    lines.push('');
  }

  // Rules
  if (doc.rules.length > 0) {
    const enabledRules = doc.rules.filter((r) => r.enabled);
    if (enabledRules.length > 0) {
      lines.push('<!-- dscp:rules -->');
      lines.push('## Active rules');
      lines.push('');
      lines.push('| Rule | Category | Severity | Fixable |');
      lines.push('|------|----------|----------|---------|');
      for (const r of enabledRules) {
        lines.push(`| \`${r.id}\` | ${r.category} | ${r.severity} | ${r.fixable ? 'Yes' : 'No'} |`);
      }
      lines.push('');
      lines.push('<!-- /dscp:rules -->');
      lines.push('');
    }
  }

  return lines.join('\n');
}
