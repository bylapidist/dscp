# Installation

## Requirements

- Node.js 22 or later
- pnpm 10 or later (or npm/yarn)

## Install the package

```sh
pnpm add @lapidist/dscp
```

The package ships TypeScript declarations and is ESM-only. It requires
`"type": "module"` in your `package.json` or a `.mjs` extension on your entry point.

## TypeScript configuration

The package targets ES2022 and uses `NodeNext` module resolution. Your `tsconfig.json`
should include:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}
```

## Verify the installation

```ts
import { DSCP_SCHEMA_URI, DSCP_SPEC_VERSION } from '@lapidist/dscp';

console.log(DSCP_SCHEMA_URI);    // https://dscp.lapidist.net/schema/v1.json
console.log(DSCP_SPEC_VERSION);  // 1.0.0
```
