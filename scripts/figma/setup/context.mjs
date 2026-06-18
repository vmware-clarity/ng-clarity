/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Builds the shared run context consumed by every controller.
 *
 * Contains only what is truly needed by all four modes (dry-run / extract /
 * preview / push): credential loading, config, token rules, and CSS parsing.
 * Mode-specific concerns — logging, Figma client creation, branch isolation,
 * and fetching existing variables — live in the controllers themselves.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadEnv } from './env.mjs';
import { loadConfig } from './config.mjs';
import { parseCssBlocks, resolveModeVars } from './css-parser.mjs';
import { createTokenRules } from '../core/token-rules.mjs';
import { buildCollectionDefs } from '../core/collections.mjs';

/**
 * @typedef {Object} RunPaths
 * @property {string} root       Absolute repo root.
 * @property {string} configPath Absolute path to figma-tokens.config.json.
 * @property {string} cssFile    Absolute path to the compiled clr-ui.css.
 */

/**
 * @typedef {Object} RunContext
 * @property {string | undefined} figmaToken     Figma personal access token.
 * @property {string} figmaFileKey               Figma file key (normalized).
 * @property {string} figmaBranchMode            "branch" | "collection".
 * @property {import('./config.mjs').FigmaTokensConfig} config
 * @property {ReturnType<import('../core/token-rules.mjs').createTokenRules>} rules
 * @property {(name: string) => string | undefined} varLookup
 * @property {import('../core/collections.mjs').CollectionDef[]} collectionDefs
 * @property {string | undefined} branchName
 * @property {string | null} extractFile
 * @property {number} humanReadableCount
 * @property {string} source  CSS source path relative to the repo root.
 * @property {string} root
 */

const paths = {
  root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..'),
  get configPath() {
    return path.join(this.root, 'figma-tokens.config.json');
  },
  get cssFile() {
    return path.join(this.root, 'dist', 'clr-ui', 'clr-ui.css');
  },
};

/**
 * Build the shared context object handed to the selected controller.
 *
 * @param {ReturnType<import('./cli.mjs').parseCliArgs>} cli
 * @returns {RunContext}
 */
export function buildRunContext(cli) {
  if (!fs.existsSync(paths.cssFile)) {
    console.error(`❌  ${paths.cssFile} not found. Run: npm run _build:ui`);
    process.exit(1);
  }

  const { extractMode, branchName, extractFile } = cli;

  const { figmaToken, figmaFileKey, figmaBranchMode } = loadEnv({ extractMode });
  const config = loadConfig(paths.configPath);
  const rules = createTokenRules(config);

  const cssText = fs.readFileSync(paths.cssFile, 'utf8');
  const modeVars = resolveModeVars(parseCssBlocks(cssText));
  const collectionDefs = buildCollectionDefs(config.collections, modeVars);

  const humanReadableCount = config.collections.reduce(
    (n, col) => n + (col.humanReadable ? Object.keys(col.humanReadable).length : 0),
    0
  );

  return {
    figmaToken,
    figmaFileKey,
    figmaBranchMode,
    config,
    rules,
    varLookup: name => modeVars.root.get(name),
    collectionDefs,
    branchName,
    extractFile,
    humanReadableCount,
    source: path.relative(paths.root, paths.cssFile),
    root: paths.root,
  };
}
