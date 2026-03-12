/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Tree } from '@angular-devkit/schematics';

/**
 * Visits all files in the tree matching a glob-like pattern.
 * Supports simple extension matching: '**\/*.ts', '**\/*.html', '**\/*.{css,scss,sass,less}'
 */
export function visitFiles(tree: Tree, pattern: string, callback: (filePath: string) => void): void {
  const extensions = parseExtensions(pattern);

  tree.visit(filePath => {
    if (filePath.includes('/node_modules/') || filePath.includes('/.git/')) {
      return;
    }

    if (extensions.length > 0 && !extensions.some(ext => filePath.endsWith(ext))) {
      return;
    }

    callback(filePath);
  });
}

function parseExtensions(pattern: string): string[] {
  // Match patterns like '**/*.ts' or '**/*.{css,scss,sass,less}'
  const match = pattern.match(/\*\.(?:\{([^}]+)\}|(\w+))$/);
  if (!match) {
    return [];
  }

  if (match[1]) {
    return match[1].split(',').map(ext => `.${ext.trim()}`);
  }

  return [`.${match[2]}`];
}
