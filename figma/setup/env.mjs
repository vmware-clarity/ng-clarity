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
 * the required variables are present, and normalizing the file key (full Figma
 * URLs are NOT accepted).
 */

/**
 * Read and validate the Figma-related environment variables.
 *
 * @param {{ env?: NodeJS.ProcessEnv }} [options]
 * @returns {{ figmaToken: string, figmaFileKey: string }}
 */
export function loadEnv({ env = process.env } = {}) {
  const figmaToken = env.FIGMA_TOKEN;
  const figmaFileKey = env.FIGMA_FILE_KEY ?? '';

  if (!figmaToken || !figmaFileKey) {
    throw new Error(
      '❌  FIGMA_TOKEN and FIGMA_FILE_KEY must be set (e.g. via .env.figma).\n' +
        '    Tip: to inspect tokens without credentials, run: node figma/index.mjs --extract'
    );
  }

  return { figmaToken, figmaFileKey };
}
