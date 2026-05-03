---
'@lapidist/dscp': patch
---

fix(schema): point DSCP_SCHEMA_URI to GitHub raw URL

`dscp.lapidist.net/schema/v1.json` is not yet live. Point to the GitHub
raw URL (`raw.githubusercontent.com/bylapidist/dscp/main/schema/v1.json`)
so generated DSCP documents reference a resolvable schema immediately.
