/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * CLI argument parsing for the Figma token publisher.
 *
 * Keeps argv handling isolated from the rest of the pipeline so the orchestrator
 * receives a plain, validated options object.
 */

const DEFAULT_EXTRACT_FILE = 'figma-tokens.extract.json';

/**
 * Parse the supported CLI flags.
 *
 * @param {string[]} [argv] Defaults to process.argv.
 * @returns {{ dryRun: boolean, extractMode: boolean, extractFile: string | null, branchName: string | undefined }}
 */
export function parseCliArgs(argv = process.argv) {
  const dryRun = argv.includes('--dry-run');

  const extractIdx = argv.indexOf('--extract');
  const extractMode = extractIdx !== -1;
  const extractFile = (() => {
    if (!extractMode) {
      return null;
    }
    const next = argv[extractIdx + 1];
    return next && !next.startsWith('--') ? next : DEFAULT_EXTRACT_FILE;
  })();

  const branchIdx = argv.indexOf('--branch');
  const branchName = branchIdx !== -1 ? argv[branchIdx + 1] : undefined;
  if (branchIdx !== -1 && (!branchName || branchName.startsWith('--'))) {
    console.error('❌  --branch requires a non-empty branch name.');
    process.exit(1);
  }

  return { dryRun, extractMode, extractFile, branchName };
}
