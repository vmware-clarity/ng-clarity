/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Builds the shared run context consumed by every controller.
 *
 * This is the wiring layer that all logic branches (dry-run / extract / preview /
 * push) depend on: it loads env + config, constructs the rules and Figma client,
 * fetches the existing Figma state (push only), resolves branch isolation, and
 * parses the CSS source into planner-ready collection definitions.
 *
 * The mode-specific behavior lives in the controllers; everything they share is
 * computed here exactly once and handed over as a plain context object.
 */

import fs from 'node:fs';
import path from 'node:path';

import { loadEnv } from './env.mjs';
import { loadConfig } from './config.mjs';
import { parseCssBlocks, resolveModeVars } from './css-parser.mjs';
import { createTokenRules } from '../core/token-rules.mjs';
import { buildCollectionDefs } from '../core/collections.mjs';
import { createFigmaClient } from '../api/figma-client.mjs';
import { parseFigmaVarsResponse } from '../util/figma-response.mjs';

/**
 * @typedef {Object} RunPaths
 * @property {string} root      Absolute repo root.
 * @property {string} configPath Absolute path to figma-tokens.config.json.
 * @property {string} cssFile    Absolute path to the compiled clr-ui.css.
 */

/**
 * @typedef {Object} RunContext
 * @property {ReturnType<import('../api/figma-client.mjs').createFigmaClient>} figma
 * @property {import('./config.mjs').FigmaTokensConfig} config
 * @property {ReturnType<import('../core/token-rules.mjs').createTokenRules>} rules
 * @property {(name: string) => string | undefined} varLookup
 * @property {import('../core/collections.mjs').ModeVars} modeVars
 * @property {import('../core/collections.mjs').CollectionDef[]} collectionDefs
 * @property {string} collectionSuffix
 * @property {string} effectiveFileKey
 * @property {any[]} existingCollections
 * @property {any[]} existingVars
 * @property {Array<{modeId: string, name: string, collectionId: string}>} existingModes
 * @property {string | undefined} branchName
 * @property {string | null} extractFile
 * @property {number} humanReadableCount
 * @property {string} source  CSS source path relative to the repo root.
 * @property {string} root
 */

/**
 * Build the shared context object used by the selected controller.
 *
 * @param {Object} params
 * @param {ReturnType<import('./cli.mjs').parseCliArgs>} params.cli Parsed CLI options.
 * @param {'dry-run' | 'extract' | 'preview' | 'push'} params.mode Resolved run mode.
 * @param {RunPaths} params.paths Absolute filesystem paths resolved by the entry point.
 * @returns {Promise<RunContext>}
 */
export async function buildRunContext({ cli, mode, paths }) {
  const { dryRun, previewMode, extractMode, extractFile, branchName } = cli;

  // ── CLI + environment ─────────────────────────────────────────────────────
  const { figmaToken, figmaFileKey, figmaBranchMode } = loadEnv({ extractMode });
  const config = loadConfig(paths.configPath);
  const rules = createTokenRules(config);
  const figma = createFigmaClient(figmaToken);

  const modeLabel = dryRun ? ' (DRY RUN)' : previewMode ? ' (PREVIEW)' : '';
  console.log(
    `\n🎨  Figma token push — file: ${figmaFileKey}${branchName ? ` [branch: ${branchName}]` : ''}${modeLabel}\n`
  );

  // ── Fetch existing Figma variables ──────────────────────────────────────────
  // Preview fetches its own state (after branch isolation resolves the file key)
  // and dry-run/extract never touch the network, so only push fetches up front.
  let existingCollections = [];
  let existingVars = [];
  let existingModes = [];
  let effectiveFileKey = figmaFileKey;

  if (mode === 'push') {
    console.log('⬇️   Fetching existing Figma variables…');
    const existing = await figma.getVariables(figmaFileKey);
    ({ collections: existingCollections, vars: existingVars, modes: existingModes } = parseFigmaVarsResponse(existing));
  }

  // ── Branch isolation ────────────────────────────────────────────────────────
  let collectionSuffix = '';
  if (branchName) {
    if (figmaBranchMode === 'branch' && !dryRun) {
      // Target the Figma branch file key
      const branches = await figma.getBranches(figmaFileKey);
      const branch = branches.branches?.find(b => b.name.toLowerCase().includes(branchName.toLowerCase()));
      if (branch) {
        effectiveFileKey = branch.key;
        console.log(`🌿  Targeting Figma branch: ${branch.name} (${branch.key})`);
      } else {
        console.warn(`⚠️   No Figma branch found matching "${branchName}". Using collection suffix instead.`);
        collectionSuffix = ` [${branchName}]`;
      }
    } else {
      collectionSuffix = ` [${branchName}]`;
    }
  }

  // ── Parse CSS ──────────────────────────────────────────────────────────────
  if (!fs.existsSync(paths.cssFile)) {
    console.error(`❌  ${paths.cssFile} not found. Run: npm run _build:ui`);
    process.exit(1);
  }
  const cssText = fs.readFileSync(paths.cssFile, 'utf8');
  const modeVars = resolveModeVars(parseCssBlocks(cssText));
  const collectionDefs = buildCollectionDefs(config.collections, modeVars);

  const humanReadableCount = config.collections.reduce(
    (n, col) => n + (col.humanReadable ? Object.keys(col.humanReadable).length : 0),
    0
  );

  return {
    figma,
    config,
    rules,
    varLookup: name => modeVars.rootVars.get(name),
    modeVars,
    collectionDefs,
    collectionSuffix,
    effectiveFileKey,
    existingCollections,
    existingVars,
    existingModes,
    branchName,
    extractFile,
    humanReadableCount,
    source: path.relative(paths.root, paths.cssFile),
    root: paths.root,
  };
}
