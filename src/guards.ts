import type {
  DSCPDocument,
  DSCPTokenEntry,
  DSCPTokenGraph,
  DSCPComponentEntry,
  DSCPComponentSummary,
  DSCPDeprecationEntry,
  DSCPViolationPattern,
  DSCPRuleSummary,
  DSCPRuleSeverity,
} from './types.js';

/** Narrows `unknown` to an indexable record without any type assertion. */
export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isDSCPRuleSeverity(v: unknown): v is DSCPRuleSeverity {
  return v === 'error' || v === 'warn' || v === 'off';
}

export function isDSCPTokenEntry(v: unknown): v is DSCPTokenEntry {
  if (!isRecord(v)) return false;
  return (
    typeof v.pointer === 'string' &&
    typeof v.name === 'string' &&
    typeof v.type === 'string' &&
    typeof v.value === 'string' &&
    typeof v.deprecated === 'boolean'
  );
}

export function isDSCPTokenGraph(v: unknown): v is DSCPTokenGraph {
  if (!isRecord(v)) return false;
  return typeof v.totalCount === 'number' && isRecord(v.byType);
}

export function isDSCPComponentEntry(v: unknown): v is DSCPComponentEntry {
  if (!isRecord(v)) return false;
  return (
    typeof v.name === 'string' && typeof v.package === 'string' && typeof v.deprecated === 'boolean'
  );
}

export function isDSCPComponentSummary(v: unknown): v is DSCPComponentSummary {
  if (!isRecord(v)) return false;
  return typeof v.totalCount === 'number' && Array.isArray(v.components);
}

export function isDSCPDeprecationEntry(v: unknown): v is DSCPDeprecationEntry {
  if (!isRecord(v)) return false;
  return typeof v.pointer === 'string';
}

export function isDSCPViolationPattern(v: unknown): v is DSCPViolationPattern {
  if (!isRecord(v)) return false;
  return (
    typeof v.property === 'string' &&
    typeof v.rawValue === 'string' &&
    typeof v.frequency === 'number' &&
    (v.correctToken === null || typeof v.correctToken === 'string') &&
    typeof v.agentAttributed === 'boolean'
  );
}

export function isDSCPRuleSummary(v: unknown): v is DSCPRuleSummary {
  if (!isRecord(v)) return false;
  return (
    typeof v.id === 'string' &&
    typeof v.category === 'string' &&
    typeof v.description === 'string' &&
    typeof v.enabled === 'boolean' &&
    isDSCPRuleSeverity(v.severity) &&
    typeof v.fixable === 'boolean'
  );
}

export function isDSCPDocument(v: unknown): v is DSCPDocument {
  if (!isRecord(v)) return false;
  return (
    typeof v.$schema === 'string' &&
    typeof v.specVersion === 'string' &&
    typeof v.generatedAt === 'string' &&
    typeof v.kernelSnapshotHash === 'string' &&
    isDSCPTokenGraph(v.tokenGraph) &&
    isDSCPComponentSummary(v.componentRegistry) &&
    Array.isArray(v.deprecationLedger) &&
    Array.isArray(v.violations) &&
    Array.isArray(v.rules)
  );
}
