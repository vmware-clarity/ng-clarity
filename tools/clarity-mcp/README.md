# clarity-mcp — local MCP server for Clarity AI enablement

Part of the Clarity AI enablement layer (VCFUI-15936). A lightweight, repo-local
[Model Context Protocol](https://modelcontextprotocol.io) server that exposes Clarity component
scaffolding and a few repo checks to AI coding agents (Claude Code and any other MCP client).

## What it exposes

| Tool | Purpose |
| --- | --- |
| `scaffold_clarity_component` | Assemble a live usage blueprint for a component by reading its demos, demo module, and Storybook stories from `projects/website`. Reads only; writes nothing. |
| `clarity_lint` | Run `eslint .` |
| `clarity_test` | Run `ng test clr-angular --configuration=ci` |
| `clarity_public_api_check` | Run `node scripts/api-extractor.js` |

`scaffold_clarity_component` inputs: `componentName` (required), `features[]`, `library`
(`angular`\|`addons`), `appStyle` (`standalone`\|`ngmodule`), `includeStorybook`.

## Per-component knowledge corpus (primary mechanism)

The everyday "how do I use this component" knowledge is **persisted**, not searched live. `npm run
generate:references` reads every component's demos and writes one distilled file per component to
`docs/clarity-ai/components/<name>.md` (index: `index.md`) — the correct module to import, the real
selectors/classes/directives, and copy-paste example snippets. The `clarity` skill loads the relevant
file on demand, so a request like "add some buttons" gets accurate, ready knowledge with no big search.

This is **generated, not hand-maintained**: you maintain one generator; it emits all ~63 references
from the source-of-truth demos. Regenerate when the demos change (a CI job can diff to flag drift).
The `scaffold_clarity_component` tool remains for deep/live examples and edge features.

## Build, generate & register

```bash
cd tools/clarity-mcp
npm install
npm run build                 # tsc -> dist/
npm run generate:references   # writes docs/clarity-ai/components/*.md (run from repo root cwd)
```

The repo root `.mcp.json` already registers it:

```json
{
  "mcpServers": {
    "clarity": {
      "command": "node",
      "args": ["./tools/clarity-mcp/dist/index.js"],
      "env": { "CLARITY_REPO_ROOT": "." }
    }
  }
}
```

Restart Claude Code (or your MCP client) from the repo root and confirm the tools appear via `/mcp`.
The server resolves repo paths from `CLARITY_REPO_ROOT` (defaults to the process cwd, which is the
repo root when launched by the MCP client).

## How the /clarity pipeline uses it

```
/clarity datagrid --features pagination,virtual-scroll
        │
        ├─ clarity-research subagent  → compact UsageSpec (isolated context)
        ├─ scaffold_clarity_component → live demo blueprint (this server)
        └─ clarity-developer subagent → ready-to-use Angular 21 example (isolated context)
```

Heavy documentation reads happen inside the subagents and this server, so the supervisor session's
context stays small. See `.claude/skills/clarity/SKILL.md` and `.claude/agents/clarity-*.md`.

## Path-scoped rules

Contributor guidance is delivered as nested `CLAUDE.md` files (auto-loaded by directory, so they only
enter context when relevant):

- `projects/angular/CLAUDE.md` — core library conventions (NgModule, decorator inputs, constructor DI,
  default change detection, strict templates, license header).
- `projects/addons/CLAUDE.md` — micro-bundle / tree-shaking rules.
- `projects/angular/data/datagrid/CLAUDE.md` — datagrid complexity exceptions (loads only under
  `**/datagrid/**`).

### Optional: exact glob-trigger hook (Cursor parity)

Nested `CLAUDE.md` covers the common case. For editor-independent, strict `**/datagrid/**` triggering,
add a `PreToolUse` hook in `.claude/settings.json` that inspects the edited path and prints the
datagrid guidance to stdout. Left out by default to avoid running a hook on every edit.

## Note on standards

`@clr/angular` is a legacy-pattern Angular 21 library (NgModule, no Signals, mostly default change
detection, `strict: false` with `strictTemplates`). The generated **consumer** example code may use
modern app patterns (standalone, `OnPush`, Signals), but always imports Clarity as an NgModule and
uses `cds-icon` for icons. AppFX component skills are out of scope for this repo.
