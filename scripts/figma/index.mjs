#!/usr/bin/env node

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Figma token publisher for ng-clarity (entry point).
 *
 * Reads dist/clr-ui/clr-ui.css (the compiled output of `npm run _build:ui`),
 * applies scope/exclusion rules from figma-tokens.config.json, and publishes
 * all CSS custom properties as Figma variables via the Figma Variables REST API.
 *
 * This file is intentionally thin: it parses the CLI, resolves the run mode,
 * builds the shared run context (see setup/context.mjs), and delegates to the
 * mode-specific controller selected by the factory (see controllers/). Each
 * logic branch (dry-run / extract / preview / push) lives in its own controller.
 *
 * Usage:
 *   node --env-file=.env.figma scripts/figma/index.mjs [options]
 *
 * Options:
 *   --dry-run              Parse and plan the push but make no API calls.
 *   --preview              Fetch the current Figma state, compute a full variable
 *                          diff (new / updated / deleted), print it to the console,
 *                          and exit without pushing. Requires credentials.
 *   --extract [file]       Write the parsed token plan to a JSON file instead
 *                          of pushing. No Figma credentials required.
 *                          Defaults to: figma-tokens.extract.json
 *   --branch <name>        Dev branch name; isolates tokens from production.
 *                          With FIGMA_BRANCH_MODE=branch: targets a Figma branch.
 *                          With FIGMA_BRANCH_MODE=collection (default): suffixes
 *                          collection names with " [<branch>]".
 *
 * Required env vars (set in .env.figma) — not needed for --extract:
 *   FIGMA_TOKEN        Personal access token with file_variables:read/write.
 *   FIGMA_FILE_KEY     Figma file key (last path segment of the file URL).
 *
 * Optional env vars:
 *   FIGMA_BRANCH_MODE  "branch" | "collection" (default: "collection")
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseCliArgs } from './setup/cli.mjs';
import { buildRunContext } from './setup/context.mjs';
import { executeRun, resolveMode } from './controllers/factory.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

const paths = {
  root: ROOT,
  configPath: path.join(ROOT, 'figma-tokens.config.json'),
  cssFile: path.join(ROOT, 'dist', 'clr-ui', 'clr-ui.css'),
};

async function main() {
  const cli = parseCliArgs();
  const mode = resolveMode(cli);
  const ctx = await buildRunContext({ cli, paths });
  await executeRun(mode, ctx);
}

main().catch(err => {
  console.error('❌ ', err.message);
  process.exit(1);
});
