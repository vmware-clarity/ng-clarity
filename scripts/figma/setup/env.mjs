/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Environment loading and validation for the Figma token publisher.
 *
 * Encapsulates reading credentials from the process environment, validating that
 * the required variables are present (unless running in extract mode), and
 * normalizing the file key (full Figma URLs are accepted).
 */

/**
 * Read and validate the Figma-related environment variables.
 *
 * @param {{ extractMode?: boolean, env?: NodeJS.ProcessEnv }} [options]
 * @returns {{ figmaToken: string | undefined, figmaFileKey: string, figmaBranchMode: string }}
 */
export function loadEnv({ env = process.env } = {}) {
  const figmaToken = env.FIGMA_TOKEN;
  const rawFileKey = env.FIGMA_FILE_KEY ?? '';
  const figmaBranchMode = env.FIGMA_BRANCH_MODE ?? 'collection';

  if (!figmaToken || !rawFileKey) {
    throw new Error(
      '❌  FIGMA_TOKEN and FIGMA_FILE_KEY must be set (e.g. via .env.figma).\n' +
        '    Tip: to inspect tokens without credentials, run: node scripts/figma/index.mjs --extract'
    );
  }

  // Accept full Figma URLs: extract the key from the path segment after /file/ or /design/
  const figmaFileKey = rawFileKey.replace(/^https?:\/\/.*?\/(?:file|design)\/([A-Za-z0-9_-]+).*/, '$1');

  return { figmaToken, figmaFileKey, figmaBranchMode };
}
