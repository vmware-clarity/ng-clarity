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
 *   OR
 *   FIGMA_TOKEN=figd_XXXXXXXXXXXXXX FIGMA_FILE_KEY=YYYYYYYYYYYYYY node scripts/figma/index.mjs [options]
 *
 * Options:
 *   --dry-run              Parse and plan the push but make no API calls.
 *   --preview              Fetch the current Figma state, compute a full variable
 *                          diff (new / updated / deleted), print it to the console,
 *                          and exit without pushing. Requires credentials.
 *   --extract [file]       Write the parsed token plan to a JSON file instead
 *                          of pushing. No Figma credentials required.
 *                          Defaults to: figma-tokens.extract.json
 *
 * Required env vars (set in .env.figma) — not needed for --extract:
 *   FIGMA_TOKEN        Personal access token with file_variables:read/write.
 *   FIGMA_FILE_KEY     Figma file key (last path segment of the file URL).
 *                      Full URLs are NOT accepted.
 */

import { parseCliArgs } from './setup/cli.mjs';
import { buildRunContext } from './setup/context.mjs';
import { executeRun, resolveMode } from './controllers/factory.mjs';

async function main() {
  const cli = parseCliArgs();
  const ctx = buildRunContext();
  const mode = resolveMode(cli);
  await executeRun(mode, cli, ctx);
}

main().catch(err => {
  console.error('❌ ', err.message);
  process.exit(1);
});
