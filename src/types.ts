import type { DtifFlattenedToken, TokenType } from '@lapidist/dtif-parser';

export type { DtifFlattenedToken, TokenType };

// ---------------------------------------------------------------------------
// DSCP document — top-level envelope
// ---------------------------------------------------------------------------

export interface DSCPDocument {
  /** JSON Schema URI for this document. */
  readonly $schema: string;
  /** Semver of the DSCP spec this document conforms to. */
  readonly specVersion: string;
  /** ISO 8601 timestamp of when the document was generated. */
  readonly generatedAt: string;
  /** SHA-256 hash of the kernel snapshot this document was derived from. */
  readonly kernelSnapshotHash: string;
  readonly tokenGraph: DSCPTokenGraph;
  readonly componentRegistry: DSCPComponentSummary;
  readonly deprecationLedger: DSCPDeprecationEntry[];
  readonly violations: DSCPViolationPattern[];
  readonly rules: DSCPRuleSummary[];
}

// ---------------------------------------------------------------------------
// Token graph
// ---------------------------------------------------------------------------

export interface DSCPTokenEntry {
  readonly pointer: string;
  readonly name: string;
  readonly type: string;
  /** Serialised token value (JSON string for complex values). */
  readonly value: string;
  readonly deprecated: boolean;
  readonly replacement?: string;
}

export interface DSCPTokenGraph {
  /** Total number of tokens in the design system. */
  readonly totalCount: number;
  /** Tokens grouped by DTIF type. */
  readonly byType: Partial<Record<TokenType, DSCPTokenEntry[]>>;
}

// ---------------------------------------------------------------------------
// Component registry
// ---------------------------------------------------------------------------

export interface DSCPComponentEntry {
  readonly name: string;
  readonly package: string;
  readonly version?: string;
  readonly deprecated: boolean;
  readonly replacedBy?: string;
}

export interface DSCPComponentSummary {
  readonly totalCount: number;
  readonly components: DSCPComponentEntry[];
}

// ---------------------------------------------------------------------------
// Deprecation ledger
// ---------------------------------------------------------------------------

export interface DSCPDeprecationEntry {
  readonly pointer: string;
  readonly replacement?: string;
  readonly since?: string;
  readonly reason?: string;
}

// ---------------------------------------------------------------------------
// Violation patterns
// ---------------------------------------------------------------------------

export interface DSCPViolationPattern {
  /** CSS property where the violation occurs (e.g. "color", "font-size"). */
  readonly property: string;
  /** The raw value that was used instead of a token. */
  readonly rawValue: string;
  /** How many times this pattern has been observed. */
  readonly frequency: number;
  /** The token pointer that should have been used, or null if unknown. */
  readonly correctToken: string | null;
  /** Whether this violation was introduced by an AI agent. */
  readonly agentAttributed: boolean;
}

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

export type DSCPRuleSeverity = 'error' | 'warn' | 'off';

export interface DSCPRuleSummary {
  readonly id: string;
  readonly category: string;
  readonly description: string;
  readonly enabled: boolean;
  readonly severity: DSCPRuleSeverity;
  readonly fixable: boolean;
}

// ---------------------------------------------------------------------------
// Markdown section markers used in DESIGN_SYSTEM.md
// ---------------------------------------------------------------------------

export type DSCPSectionTag =
  | `dscp:tokens:${TokenType}`
  | 'dscp:violations'
  | 'dscp:components'
  | 'dscp:rules';
