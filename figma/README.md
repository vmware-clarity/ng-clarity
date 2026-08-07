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
   [`figma-tokens.config.json`](./figma-tokens.config.json).
4. Diff against the variables already in the Figma file and push only the
   create/update/delete operations needed.

### Modules

| File                                 | Responsibility                                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `index.mjs`                          | Entry point: parses CLI, builds context, delegates to a controller.                                     |
| `setup/cli.mjs`                      | Parses CLI flags (`--dry-run`, `--preview`, `--extract`).                                               |
| `setup/env.mjs`                      | Reads & validates `FIGMA_TOKEN` / `FIGMA_FILE_KEY`.                                                     |
| `setup/config.mjs`                   | Loads and normalizes `figma-tokens.config.json`.                                                        |
| `setup/css-parser.mjs`               | Parses CSS blocks into root / dark / compact variable maps.                                             |
| `setup/context.mjs`                  | Builds the shared run context consumed by every controller.                                             |
| `controllers/factory.mjs`            | Resolves the run mode and selects its controller.                                                       |
| `controllers/offline.controller.mjs` | `--dry-run` / `--extract`: build plan, print summary, optionally write JSON view to disk. No API calls. |
| `controllers/preview.controller.mjs` | `--preview`: fetch state, print diff, no push.                                                          |
| `controllers/push.controller.mjs`    | Default: push the plan to Figma and print the summary.                                                  |
| `controllers/plan.mjs`               | Shared plan-building + stats helper used by the offline-plan controller.                                |
| `core/collections.mjs`               | Translates config collections into planner-ready definitions.                                           |
| `core/token-rules.mjs`               | Exclusion, scope, and code-syntax helpers bound to the config.                                          |
| `core/value-converters.mjs`          | Pure CSS-value → Figma-payload converters + type inference.                                             |
| `core/planner.mjs`                   | Builds the create/update/delete push plan by diffing against Figma.                                     |
| `core/id-map.mjs`                    | CSS-var-name ↔ Figma-variable-id lookup used to resolve aliases.                                        |
| `api/extract-view.mjs`               | Builds the JSON view written by `--extract`.                                                            |
| `api/diff-printer.mjs`               | Formats the human-readable change diff.                                                                 |
| `api/push-executor.mjs`              | Per-collection push loop and idMap refresh between POSTs.                                               |
| `api/figma-client.mjs`               | Thin Figma REST client (auth, timeout, 429/5xx retry).                                                  |

## Collections

The publisher creates **9 collections**, and the order in
`figma-tokens.config.json` is significant — a collection that aliases another
must come **after** the collection it references so the alias resolves to a real
Figma variable ID rather than a stale temp ID:

1. **CDS Global Colors** — primitive color palette.
2. **CDS Global Space** — primitive spacing + object border widths.
3. **CLR Density** — density scale (Regular / Compact) referenced by spacing aliases.
4. **CDS Global Layout** — layout primitives.
5. **CDS Theme** — semantic color aliases (Light / Dark modes).
6. **CDS Typography** — structural / sizing aliases for typography metrics.
7. **CDS Spacing** — structural / sizing aliases (radius, width, interaction geometry).
8. **Colors**, 9. **Spacings** — friendly-named `VARIABLE_ALIAS` entries from each
   collection's own `humanReadable` map (see `humanReadable` in
   `figma-tokens.config.schema.json` — it's per-collection, not top-level).

## Running locally

1. Set the credentials below as real process environment variables, or put them in a
   local file (e.g. `.env.figma`, never committed) and pass it via
   `node --env-file=.env.figma ...` (see the "invoke directly" examples below).

- `FIGMA_TOKEN` — personal access token with `file_variables:read` and
  `file_variables:write` scopes.
- `FIGMA_FILE_KEY` — the key that identifies the target Figma file. Figma branches
  are independent files with their own key, so the same variable controls whether
  you publish to the main file or to a branch:

  | Target      | URL pattern                                                     | Key to use                                |
  | ----------- | --------------------------------------------------------------- | ----------------------------------------- |
  | Main file   | `https://www.figma.com/design/<FILE_KEY>/…`                     | `<FILE_KEY>` (segment after `/design/`)   |
  | Branch file | `https://www.figma.com/design/<FILE_KEY>/branch/<BRANCH_KEY>/…` | `<BRANCH_KEY>` (segment after `/branch/`) |

  **Example — main file:**

  ```
  URL:            https://www.figma.com/design/xxxxxxxxxxxxxxxxxxxxxx/...
  FIGMA_FILE_KEY: xxxxxxxxxxxxxxxxxxxxxx
  ```

  **Example — branch file:**

  ```
  URL:            https://www.figma.com/design/xxxxxxxxxxxxxxxxxxxxxx/branch/yyyyyyyyyyyyyyyyyyyyyy/...
  FIGMA_FILE_KEY: yyyyyyyyyyyyyyyyyyyyyy
  ```

2. Run one of the npm scripts:

```bash
# Dry run — parse and plan, but make no API calls
npm run figma:push:dry-run

# Inspect the parsed token plan as JSON, no credentials required
npm run figma:extract

# Fetch current Figma state and print the diff, but make no changes (runs the test suite first)
npm run figma:push:preview

# Push to Figma (runs the test suite first)
npm run figma:push
```

Or invoke the script directly:

```bash
# With ENV file
node --env-file=.env.figma figma/index.mjs [--preview] [--dry-run] [--extract [file]]
# OR with process variables
FIGMA_TOKEN=figd_XXXXXXXXXXXXXX FIGMA_FILE_KEY=YYYYYYYYYYYYYY node figma/index.mjs [--preview] [--dry-run] [--extract [file]]
```

## Running the tests

```bash
npx vitest --config figma/vitest.config.mjs
# or
npm run _test:figma
```

## CI

`.github/workflows/figma-publish.yml` publishes tokens to Figma after a release,
and supports a manual `workflow_dispatch` for ad-hoc pushes. To target a specific
Figma file (e.g. a branch file), set `FIGMA_FILE_KEY` to that file's key before
triggering the workflow.
