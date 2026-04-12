# Introduction

`@lapidist/dscp` is the Design System Context Protocol — a versioned specification and
TypeScript type package that defines how design system constraints are communicated to
generative AI models before code generation begins.

## The problem

AI coding agents write statistically likely code. Without explicit design system context,
they produce raw values — `color: #3B82F6`, `padding: 16px` — instead of token references.
The linter catches these after the fact, but the cost is already paid: the agent has
generated bad code, and a human or another agent must correct it.

DSCP solves this by giving agents a machine-readable description of your design system
_before_ code generation begins. With the full token graph, violation patterns, and active
rules in the context window, agents can make the right choice on the first attempt.

## What DSCP defines

| Concept | Description |
|---------|-------------|
| **DSCPDocument** | The top-level versioned JSON envelope |
| **Token graph** | All resolved design tokens, grouped by type |
| **Component registry** | Registered components and their design system metadata |
| **Deprecation ledger** | Deprecated pointers with optional replacements |
| **Violation patterns** | Known bad values and the tokens that should replace them |
| **Active rules** | Lint rules currently enforced in this design system |
| **DESIGN\_SYSTEM.md** | Markdown rendering of a DSCPDocument, with typed comment markers for agent parsing |

## Tool-agnostic by design

DSCP is not tied to any one tool. The specification defines the envelope and the semantics.
Any tool in the Lapidist ecosystem — or any third-party tool — can produce a conforming
`DSCPDocument`:

- **dtifx** emits documents from a completed token build pipeline via `@dtifx/dscp`
- **design-lint** exports documents from a running DSR kernel
- Custom scripts can use the reference generator in this package directly

## Dependency position

DSCP sits downstream of `@lapidist/dtif` (for token types) and is consumed by anything
that needs to communicate design system constraints outward:

```text
dtif → dscp → dtifx (@dtifx/dscp)
            → design-lint (export-design-system-md)
            → AI agents (DESIGN_SYSTEM.md in context window)
```

DSCP has no dependency on `@lapidist/dsr` or `@lapidist/design-lint`.

## Next steps

- [Install the package](/installation)
- [Generate your first document](/quickstart)
- [Read the full specification](/spec)
