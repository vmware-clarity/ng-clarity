/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import {
  CSS_MIGRATION_INLINE_CANDIDATES,
  migrateCssProperties,
  transformInlineStyles,
} from './migrations/css-migration';
import { IMPORT_MIGRATION_CANDIDATES, transformImports } from './migrations/import-migration';
import {
  migrateTemplates,
  TEMPLATE_MIGRATION_INLINE_CANDIDATES,
  transformInlineTemplates,
} from './migrations/template-migration';
import { visitFiles } from './utils/file-visitor';

/**
 * All candidate strings that may appear in .ts source files.
 * Used as a fast-path pre-check to skip files that need no migration.
 */
const TS_CANDIDATES: readonly string[] = [
  ...IMPORT_MIGRATION_CANDIDATES,
  ...TEMPLATE_MIGRATION_INLINE_CANDIDATES,
  ...CSS_MIGRATION_INLINE_CANDIDATES,
];

/**
 * Single-pass migration for TypeScript source files.
 *
 * Reads each .ts file exactly once, applies import, inline-template, and
 * inline-style transforms in sequence, then writes it if changed.
 * This is more efficient than visiting .ts files separately in each migration
 * because each file is read and written at most once.
 */
function migrateTypeScriptFiles(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('  Migrating TypeScript files (imports, inline templates, inline styles)...');

    let fileCount = 0;

    visitFiles(tree, '**/*.ts', filePath => {
      const content = tree.read(filePath);
      if (!content) {
        return;
      }

      const original = content.toString('utf-8');

      // Fast-path: skip entirely if no candidate string is present anywhere.
      if (!TS_CANDIDATES.some(c => original.includes(c))) {
        return;
      }

      let text = original;
      text = transformImports(text);
      text = transformInlineTemplates(text);
      text = transformInlineStyles(text);

      if (text !== original) {
        tree.overwrite(filePath, text);
        fileCount++;
      }
    });

    context.logger.info(`    Updated ${fileCount} TypeScript file(s).`);
  };
}

export function migrate(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('');
    context.logger.info('Running @clr/angular v18 migration schematics...');
    context.logger.info('');

    return chain([migrateTypeScriptFiles(), migrateTemplates(), migrateCssProperties()])(tree, context);
  };
}
