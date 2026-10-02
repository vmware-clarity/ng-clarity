# Handoff: Clarity AI enablement layer 

**Jira:** (Story, Critical-P1, component Clarity,
epic VCFUI-15935) — "Add AI skills for all Clarity and AppFX components," integrated into the codebase and
distributed with the Clarity package. AppFX is explicitly **out of scope** for this repo (internal lib).

**Where the work lives:**
- Worktree: `/Users/tsanevd/Desktop/Clarity/ng-clarity/.worktrees/vcfui-15936-clarity-ai`
- Branch: `dtsanevmw/vcfui-15936-clarity-ai-skills` (branched from a clean `origin/main` on 2026-07-14; branch is
  now 76 commits behind `origin/main` — rebase/merge before continuing)
- **Nothing is committed.** Everything below is untracked working-tree state. Do not assume `git log` shows any
  of it.
- Full original design spec: `~/.claude/plans/you-are-a-principal-velvety-hoare.md` (on the machine that did this
  work; ~20KB, written before the pivot described below)
- Source conversation: session `f53563ea-cade-44e6-a105-a98af5f7d987` under the `ng-clarity` project's Claude
  Code history. **Caveat:** that single session file also contains a large, unrelated, later conversation
  (starting ~2026-07-20) about an "AI assist" architecture diagram for embedding AI in the vSphere client — a
  different task. Only the portion from 2026-07-14 (~07:40–11:11) is this work.

## Goal

Give Claude Code (and any MCP client) real, load-on-demand knowledge of how to *use* Clarity components
(`@clr/angular`, `@clr/addons`), aimed at **consumers** of the library (app devs), not at contributors to the
library itself. Tooling is Claude Code-native: nested `CLAUDE.md` + `.claude/agents` + `.claude/skills` +
`.mcp.json` — deliberately not Cursor's `.mdc` format.

## Design pivot (why it looks like this)

The first draft was **dynamic-only**: an MCP tool that searches the live demos on every request. The user
correctly rejected this — there was no persisted per-component knowledge, so a request like "add a button" still
required a big live search with no guarantee of finding the right usage pattern. The fix, and the actual
shipped design, is a **hybrid**:

1. A **generator** produces one distilled markdown file per component from the real demo sources (persisted,
   cheap to load, source of truth is the demos so it can't drift into fiction).
2. A **skill** (`clarity`) loads the relevant generated file on demand based on intent.
3. The **MCP tool** (`scaffold_clarity_component`) remains as the deep/live fallback for features not covered by
   the generated reference, plus a couple of repo-check tools (lint/test/public-api).

## What's built (all untracked)

```
.mcp.json                                    # registers the "clarity" MCP server (node ./tools/clarity-mcp/dist/index.js)
.claude/agents/clarity-research.md           # hop 1 of the /clarity pipeline: demos+API -> compact JSON UsageSpec, read-only
.claude/agents/clarity-developer.md          # hop 2: UsageSpec + blueprint -> ready-to-use Angular 21 consumer example
.claude/skills/clarity/SKILL.md              # loads docs/clarity-ai/components/<name>.md on demand; broad auto-trigger description
tools/clarity-mcp/                           # TS MCP server, package "@clr/clarity-mcp"
  src/index.ts                               # MCP server entrypoint, registers the 4 tools
  src/scaffold.ts                            # scaffold_clarity_component: reads demos/demo-module/storybook, writes nothing
  src/resolve.ts                             # component name -> demo/story path resolution (name map is NOT 1:1, see below)
  src/references.ts + src/generate.ts        # the reference GENERATOR (npm run generate:references)
  dist/                                      # already built (tsc output present); tools/clarity-mcp/node_modules is currently ABSENT
docs/clarity-ai/components/*.md              # 63 generated per-component reference files + index.md (prettier-ignored)
.prettierignore                              # +/docs/clarity-ai
projects/angular/CLAUDE.md                   # core library conventions (NgModule, decorator inputs, ctor DI, default CD, strictTemplates, license header)
projects/addons/CLAUDE.md                    # micro-bundle / tree-shaking rules for @clr/addons
projects/angular/data/datagrid/CLAUDE.md     # datagrid-specific complexity exceptions, loads only under **/datagrid/**
```

The 4 MCP tools: `scaffold_clarity_component` (componentName, features[], library: angular|addons, appStyle:
standalone|ngmodule, includeStorybook), `clarity_lint` (`eslint .`), `clarity_test`
(`ng test clr-angular --configuration=ci`), `clarity_public_api_check` (`node scripts/api-extractor.js`).

Full usage/design rationale for all of the above is written out in `tools/clarity-mcp/README.md` and
`.claude/skills/clarity/SKILL.md` — read those before changing behavior, they're the living docs for this
feature, not just this handoff.

## Key repo facts baked into the generated content (don't relitigate these)

- ng-clarity uses `projects/**`, not `packages/**`.
- `@clr/angular` is a **legacy-pattern** Angular 21 library: NgModule-based, no Signals, mostly default change
  detection, `strict: false` + `strictTemplates`. The "modern" standalone/OnPush/Signals guidance applies only
  to the generated **consumer** example code (what `clarity-developer` emits) — Clarity's own APIs stay
  decorator-based (`[clrDgLoading]`, `(clrDgRefresh)`, `*clrDgItems`, etc.), and icons use `cds-icon`, not the
  legacy `clr-icon`.
- Demos import the umbrella `ClarityModule`; the tool/agents should still suggest the granular `Clr<Name>Module`
  for a lean bundle.
- Website demo path: `projects/website/src/app/documentation/demos/<name>/<feature>/`.
- The component-name → demo-folder map is **not 1:1** — e.g. `datagrid` maps to `datagrid` *and*
  `advanced-datagrid`, `badge` → `badges`, `button` → `buttons`. This mapping lives in
  `projects/website/src/app/documentation/documentation-routes.ts` and in `src/resolve.ts`; if you add
  components, extend the map there, don't hardcode a 1:1 assumption anywhere else.

## Verification state — what has and hasn't been checked

- ✅ MCP server: `tsc` builds clean; smoke-tested end-to-end (initialize → tools/list → tools/call → produced a
  valid datagrid blueprint).
- ✅ Reference generator: ran offline, produced correct output — checked `button.md` (real
  `<button class="btn btn-primary">`, `[clrLoading]`, clean class list) and `datagrid.md` (full `clr-dg-*` +
  `clrDg*` surface) by hand.
- ❌ **Full `npm run lint` and `npm test` have never been run.** `npm ci` failed with `ECONNRESET` (registry
  unreachable on the WiFi network in use at the time — a known local network issue, not a repo problem). Do not
  spin on retrying `npm ci` if it fails again the same way — it usually means switch networks first.
- ⚠️ `tools/clarity-mcp/node_modules` is currently **absent** even though `tools/clarity-mcp/dist/` is already
  built from a prior `npm install && npm run build`. Running `npm run generate:references` again, or rebuilding,
  will need `npm install` first.
- ⚠️ Background `npm` invocations previously hit `EPERM uv_cwd` in this environment — run npm in the
  **foreground** with an explicit `cd <absolute-path> && npm ...`, not `run_in_background`.
- Not yet run: `prettier --write` over the new non-ignored files (the `CLAUDE.md` files and anything else not
  covered by the `.prettierignore` addition).

## Suggested next steps for whoever picks this up

1. Rebase the branch onto current `origin/main` (76 commits behind) — check for conflicts, especially around
   `.prettierignore` and any new `projects/website/documentation-routes.ts` demos added upstream since.
2. `cd tools/clarity-mcp && npm install && npm run build && npm run generate:references` (from repo root for the
   generate step — see README) once network access to the npm registry is confirmed.
3. Run `npm run lint` and `npm test` at the repo root for the first time on this branch; fix whatever the new
   untracked files surface (license headers, prettier formatting, eslint on the new `tools/clarity-mcp` TS).
4. Spot-check a handful more generated `docs/clarity-ai/components/*.md` files against their real demos for
   accuracy, not just `button.md`/`datagrid.md`.
5. Decide whether to commit as one feature commit or split (server / skill+agents / generated docs / CLAUDE.md
   conventions) — **do not commit without explicit user approval** (standing rule, not specific to this task).
6. Only after the above: consider the optional `PreToolUse` hook idea in the README for exact
   `**/datagrid/**` triggering (explicitly left out of scope for v1).
