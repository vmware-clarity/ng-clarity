/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { IMPORT_REPLACEMENTS } from '../replacements/import-replacements';
import { SYMBOL_REPLACEMENTS } from '../replacements/symbol-replacements';
import { visitFiles } from '../utils/file-visitor';

export function migrateImports(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('  Migrating TypeScript imports and symbols...');

    let fileCount = 0;

    visitFiles(tree, '**/*.ts', filePath => {
      const content = tree.read(filePath);
      if (!content) {
        return;
      }

      let text = content.toString('utf-8');
      const original = text;

      text = replaceImportPaths(text);
      text = replaceSymbols(text);
      text = removeDeletedImports(text);

      if (text !== original) {
        tree.overwrite(filePath, text);
        fileCount++;
      }
    });

    context.logger.info(`    Updated ${fileCount} TypeScript file(s).`);
  };
}

function replaceImportPaths(text: string): string {
  // Sort by path length descending so more specific paths match first
  // (e.g., '@clr/angular/src/accordion/stepper' before '@clr/angular/src/accordion')
  const sorted = [...IMPORT_REPLACEMENTS].sort((a, b) => b.oldModule.length - a.oldModule.length);

  for (const replacement of sorted) {
    if (replacement.oldSymbol === '*') {
      const escapedOld = escapeRegExp(replacement.oldModule);
      const regex = new RegExp(`(from\\s+['"])${escapedOld}(?=[/'"])`, 'g');
      text = text.replace(regex, `$1${replacement.newModule}`);
    } else {
      // Replace specific named import within a module
      const importRegex = new RegExp(
        `(import\\s*\\{[^}]*\\b)${escapeRegExp(replacement.oldSymbol)}(\\b[^}]*\\}\\s*from\\s*['"])${escapeRegExp(replacement.oldModule)}(['"])`,
        'g'
      );
      text = text.replace(importRegex, `$1${replacement.newSymbol}$2${replacement.newModule}$3`);
    }
  }
  return text;
}

function replaceSymbols(text: string): string {
  for (const replacement of SYMBOL_REPLACEMENTS) {
    if (!replacement.new) {
      continue; // Removed symbols - handled by removeDeletedImports
    }

    // Only rename if old symbol is used (word-boundary match)
    const regex = new RegExp(`\\b${escapeRegExp(replacement.old)}\\b`, 'g');
    text = text.replace(regex, replacement.new);
  }
  return text;
}

function removeDeletedImports(text: string): string {
  const removedSymbols = SYMBOL_REPLACEMENTS.filter(r => r.new === '').map(r => r.old);

  for (const symbol of removedSymbols) {
    // Remove import of the symbol (handles sole import and one-of-many)
    // Sole import: import { Symbol } from '...';
    const soleImportRegex = new RegExp(
      `^\\s*import\\s*\\{\\s*${escapeRegExp(symbol)}\\s*\\}\\s*from\\s*['"][^'"]+['"]\\s*;?\\s*$`,
      'gm'
    );
    text = text.replace(soleImportRegex, '');

    // One of many: remove the symbol and surrounding comma
    text = text.replace(new RegExp(`\\b${escapeRegExp(symbol)}\\b\\s*,\\s*`, 'g'), '');
    text = text.replace(new RegExp(`\\s*,\\s*${escapeRegExp(symbol)}\\b`, 'g'), '');

    // Add TODO comment where the symbol is still used
    if (new RegExp(`\\b${escapeRegExp(symbol)}\\b`).test(text)) {
      text = text.replace(
        new RegExp(`\\b${escapeRegExp(symbol)}\\b`, 'g'),
        `${symbol} /* TODO: '${symbol}' was removed in @clr/angular v18. Use standard KeyboardEvent.key values instead. */`
      );
    }
  }

  return text;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
