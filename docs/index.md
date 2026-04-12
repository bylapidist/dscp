---
layout: home
title: "@lapidist/dscp"
titleTemplate: Design System Context Protocol
description: >-
  @lapidist/dscp is a versioned specification and TypeScript type package that
  defines how design system constraints are communicated to generative AI models
  before code generation begins.
hero:
  name: dscp
  text: Design System Context Protocol
  tagline: "Give AI coding agents a precise, machine-readable description of your design system so they generate token-aware code from the first keystroke."
  actions:
    - theme: brand
      text: Get started
      link: /introduction
    - theme: alt
      text: Specification
      link: /spec
    - theme: minimal
      text: API reference
      link: /api
features:
  - icon: 🤖
    title: Agent-first
    details: DSCP documents are structured for both human reading and LLM parsing. Typed HTML comment markers let agents locate the exact section they need without reading the whole file.
  - icon: 🔒
    title: Violation prevention
    details: Surface known bad values — raw hex colours, hardcoded spacing — directly in the context window so agents avoid them before writing a single character.
  - icon: 🛠️
    title: Tool-agnostic
    details: Any tool can emit a DSCP document — dtifx, design-lint, or a bespoke script. The spec defines the envelope; the generator is a reference implementation.
  - icon: 📐
    title: Versioned spec
    details: The DSCPDocument shape is pinned to a semver spec version and validated by a JSON Schema. Consumers can detect breaking changes before parsing.
---

<!-- markdownlint-disable MD033 -->

<section class="home-section" aria-labelledby="what-is-dscp">

## What is DSCP? {#what-is-dscp}

The Design System Context Protocol defines a versioned JSON envelope — `DSCPDocument`
— that captures the constraints of a design system in a form AI coding agents can act on:

- **Token graph** — every resolved design token, grouped by type, with values and deprecation status
- **Component registry** — registered components, their packages, and their deprecation replacements
- **Deprecation ledger** — a full log of deprecated pointers with optional replacement pointers
- **Violation patterns** — known bad values observed in the codebase, with the correct token to use instead
- **Active rules** — the lint rules currently enforced, so agents know what will be flagged

</section>

<section class="home-section" aria-labelledby="design-system-md">

## DESIGN\_SYSTEM.md {#design-system-md}

The reference generator can render a `DSCPDocument` as a `DESIGN_SYSTEM.md` file at the
repo root. The file is structured for both human reading and agent parsing using typed
HTML comment markers:

```markdown
<!-- dscp:tokens:color -->
## Tokens: color

| Token | Value | Deprecated |
|-------|-------|------------|
| `#/color/brand/primary` | `#3B82F6` | No |
<!-- /dscp:tokens:color -->

<!-- dscp:violations -->
## Known violations
- **DO NOT use** `color: #3B82F6` → use `#/color/brand/primary` (seen 12 times)
<!-- /dscp:violations -->
```

Agents can locate any section with a simple string search on the marker comment.

</section>

<section class="home-section" aria-labelledby="generate">

## Generate a document {#generate}

```ts
import { generateDocument, renderMarkdown } from '@lapidist/dscp';

const doc = generateDocument({
  tokenGraph: { tokens, byType },
  componentRegistry: { components },
  deprecationLedger: { entries },
  ruleRegistry: { rules },
  violations,
  snapshotHash: 'abc123',
});

const markdown = renderMarkdown(doc);
// Write markdown to DESIGN_SYSTEM.md
```

</section>

<!-- markdownlint-enable MD033 -->
