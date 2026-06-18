<!--
 Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 This software is released under MIT license.
 The full license information can be found in LICENSE in the root directory of this project.
-->

# Figma Token Publisher

Publishes the compiled Clarity design tokens (CSS custom properties in
`dist/clr-ui/clr-ui.css`) to Figma as variables, via the
[Figma Variables REST API](https://www.figma.com/developers/api#variables).

The CSS is the **single source of truth**: this tool only mirrors it into Figma.

## How it works

1. Build the stylesheet (`npm run _build:ui`) to produce `dist/clr-ui/clr-ui.css`.
2. Parse every CSS custom property and resolve its value to a typed Figma payload
   (COLOR / FLOAT / STRING / VARIABLE_ALIAS).
3. Apply scope, exclusion, and code-syntax rules from
   [`figma-tokens.config.json`](../../figma-tokens.config.json).
4. Diff against the variables already in the Figma file and push only the
   create/update/delete operations needed.

### Modules

| File                                 | Responsibility                                                            |
| ------------------------------------ | ------------------------------------------------------------------------- |
| `index.mjs`                          | Entry point: parses CLI, builds context, delegates to a controller.       |
| `setup/cli.mjs`                      | Parses CLI flags (`--dry-run`, `--preview`, `--extract`, `--branch`).     |
| `setup/env.mjs`                      | Reads & validates `FIGMA_TOKEN` / `FIGMA_FILE_KEY` / `FIGMA_BRANCH_MODE`. |
| `setup/config.mjs`                   | Loads and normalizes `figma-tokens.config.json`.                          |
| `setup/css-parser.mjs`               | Parses CSS blocks into root / dark / compact variable maps.               |
| `setup/context.mjs`                  | Builds the shared run context consumed by every controller.               |
| `controllers/factory.mjs`            | Resolves the run mode and selects its controller.                         |
| `controllers/dry-run.controller.mjs` | `--dry-run`: build plan + print summary, no API calls.                    |
| `controllers/extract.controller.mjs` | `--extract`: build plan + write JSON view to disk.                        |
| `controllers/preview.controller.mjs` | `--preview`: fetch state, print diff, no push.                            |
| `controllers/push.controller.mjs`    | Default: push the plan to Figma and print the summary.                    |
| `controllers/plan.mjs`               | Shared plan-building + stats helper for dry-run and extract.              |
| `core/collections.mjs`               | Translates config collections into planner-ready definitions.             |
| `core/token-rules.mjs`               | Exclusion, scope, and code-syntax helpers bound to the config.            |
| `core/value-converters.mjs`          | Pure CSS-value → Figma-payload converters + type inference.               |
| `core/planner.mjs`                   | Builds the create/update/delete push plan by diffing against Figma.       |
| `core/id-map.mjs`                    | CSS-var-name ↔ Figma-variable-id lookup used to resolve aliases.          |
| `api/extract-view.mjs`               | Builds the JSON view written by `--extract`.                              |
| `api/diff-printer.mjs`               | Formats the human-readable change diff.                                   |
| `api/push-executor.mjs`              | Per-collection push loop and idMap refresh between POSTs.                 |
| `api/figma-client.mjs`               | Thin Figma REST client (auth, timeout, 429/5xx retry).                    |

## Collections

The publisher creates **7 collections**, and the order in
`figma-tokens.config.json` is significant — a collection that aliases another
must come **after** the collection it references so the alias resolves to a real
Figma variable ID rather than a stale temp ID:

1. **CDS Global Colors** — primitive color palette.
2. **CDS Global Space** — primitive spacing + object border widths.
3. **CLR Density** — density scale (Regular / Compact) referenced by spacing aliases.
4. **CDS Global Layout** — layout primitives.
5. **CDS Theme** — semantic color aliases (Light / Dark modes).
6. **CDS Spacing** — structural / sizing aliases (radius, width, typography metrics).
7. **Human Readable Tokens** — friendly-named `VARIABLE_ALIAS` entries from the
   top-level `humanReadable` map.

## Running locally

1. Copy the credentials template and fill in real values (never commit secrets):

```bash
cp .env.figma .env.figma.local   # or edit .env.figma directly, keep it out of git
```

`.env.figma` needs:

- `FIGMA_TOKEN` — personal access token with `file_variables:read` and
  `file_variables:write` scopes.
- `FIGMA_FILE_KEY` — the segment after `/file/` or `/design/` in the file URL
  (full URLs are accepted too).
- `FIGMA_BRANCH_MODE` — `collection` (default) or `branch`.

2. Run one of the npm scripts:

```bash
# Dry run — parse and plan, but make no API calls
npm run figma:push:dry-run

# Inspect the parsed token plan as JSON, no credentials required
npm run figma:extract

# Push to Figma (runs the test suite first)
npm run figma:push

# Push from a dev branch into isolated collections
npm run figma:push:branch -- my-branch-name
```

Or invoke the script directly:

```bash
node --env-file=.env.figma scripts/figma/index.mjs [--dry-run] [--branch <name>] [--extract [file]]
```

## Running the tests

```bash
npx vitest --config scripts/figma/vitest.config.mjs
# or
npm run _test:figma
```

## CI

`.github/workflows/figma-publish.yml` publishes tokens to the production Figma
file after a release, and supports a manual `workflow_dispatch` that can publish
a branch into isolated collections for designer review.
