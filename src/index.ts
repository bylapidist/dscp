export type {
  DSCPDocument,
  DSCPTokenEntry,
  DSCPTokenGraph,
  DSCPComponentEntry,
  DSCPComponentSummary,
  DSCPDeprecationEntry,
  DSCPViolationPattern,
  DSCPRuleSummary,
  DSCPRuleSeverity,
  DSCPSectionTag,
  DtifFlattenedToken,
  TokenType,
} from './types.js';

export {
  isRecord,
  isDSCPTokenEntry,
  isDSCPTokenGraph,
  isDSCPComponentEntry,
  isDSCPComponentSummary,
  isDSCPDeprecationEntry,
  isDSCPViolationPattern,
  isDSCPRuleSummary,
  isDSCPDocument,
} from './guards.js';

export {
  generateDocument,
  renderMarkdown,
  DSCP_SCHEMA_URI,
  DSCP_SPEC_VERSION,
} from './generator.js';

export type {
  GeneratorInput,
  TokenGraphInput,
  RuleInput,
  ComponentInput,
  DeprecationEntryInput,
  DeprecationLedgerInput,
  ComponentRegistryInput,
  RuleRegistryInput,
  ViolationInput,
} from './generator.js';
