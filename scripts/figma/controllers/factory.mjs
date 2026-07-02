/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Controller factory for the Figma token publisher.
 *
 * Maps the parsed CLI flags to a single run mode and resolves the controller
 * that owns that logic branch. Centralizing the mode precedence here keeps the
 * entry point free of branching.
 */

import { runOfflinePlan } from './offline-plan.controller.mjs';
import { runPreview } from './preview.controller.mjs';
import { runPush } from './push.controller.mjs';

/**
 * @typedef {'dry-run' | 'extract' | 'preview' | 'push'} RunMode
 */

/**
 * Resolve the single run mode from the parsed CLI flags.
 *
 * Precedence (highest first): dry-run → extract → preview → push. This mirrors
 * the original orchestrator ordering, where dry-run short-circuits before the
 * extract write and preview only runs when neither dry-run nor extract is set.
 *
 * @param {ReturnType<import('../setup/cli.mjs').parseCliArgs>} cli
 * @returns {RunMode}
 */
export function resolveMode({ dryRun, extractMode, previewMode }) {
  if (dryRun) {
    return 'dry-run';
  }
  if (extractMode) {
    return 'extract';
  }
  if (previewMode) {
    return 'preview';
  }
  return 'push';
}

/**
 * Resolve the controller function for a given run mode.
 *
 * @param {RunMode} mode
 * @param {ReturnType<import('../setup/cli.mjs').parseCliArgs>} cli
 * @param {import('../setup/context.mjs').RunContext} ctx
 */
export async function executeRun(mode, cli, ctx) {
  switch (mode) {
    case 'dry-run':
    case 'extract':
      runOfflinePlan(cli, ctx);
      break;
    case 'preview':
      await runPreview(ctx);
      break;
    case 'push':
      await runPush(ctx);
      break;
    default:
      throw new Error(`Unknown run mode: ${mode}`);
  }
}
