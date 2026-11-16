/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { visitFiles } from '../utils/file-visitor';

// `cds-icon` as a tag or element selector, not inside a longer name such as `.cds-icon-item`,
// `--cds-icon-size` or `./cds-icon.ts`. Closing tags (`</cds-icon>`, `&lt;/cds-icon&gt;`) have their own branch.
const CDS_ICON_RE = /(?:(?<=<\/|&lt;\/)|(?<![\w$.#/-]))cds-icon(?![\w-])/g;

const CLR_IMPORT_RE = /import\s*\{[^}]*\}\s*from\s*['"]@clr\/angular(?:\/icon)?['"];?\n?/g;
const ARRAY_RE = /\[[^[\]]*\]/g;
const CLR_ICON_RE = /\bClrIcon\b/;
const CLR_ICON_MODULE_RE = /\bClrIconModule\b/g;

/** Renames `cds-icon` to `clr-icon` in templates, styles, DOM queries and inline templates. */
export function renameCdsIconTag(text: string): string {
  return text.replace(CDS_ICON_RE, 'clr-icon');
}

/**
 * Replaces `ClrIconModule` with the standalone `ClrIcon`. Where a list already has `ClrIcon`
 * (or the file already imports it), the `ClrIconModule` entry is dropped instead of renamed.
 */
export function replaceClrIconModule(text: string): string {
  const clrImports = text.match(CLR_IMPORT_RE) ?? [];
  if (!clrImports.some(statement => statement.includes('ClrIconModule'))) {
    return text;
  }

  const importsClrIcon = clrImports.some(statement => CLR_ICON_RE.test(statement));
  text = text.replace(CLR_IMPORT_RE, statement => {
    if (!statement.includes('ClrIconModule') || !importsClrIcon) {
      return statement;
    }
    const remaining = removeListItem(statement, 'ClrIconModule');
    return /\{\s*\}/.test(remaining) ? '' : remaining;
  });

  text = text.replace(ARRAY_RE, list =>
    list.includes('ClrIconModule') && CLR_ICON_RE.test(list) ? removeListItem(list, 'ClrIconModule') : list
  );

  return text.replace(CLR_ICON_MODULE_RE, 'ClrIcon');
}

function removeListItem(list: string, name: string): string {
  return list.replace(new RegExp(`\\b${name}\\b\\s*,\\s*|\\s*,\\s*\\b${name}\\b|\\s*\\b${name}\\b\\s*`), '');
}

export function migrateIcons(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('  Migrating cds-icon to clr-icon and ClrIconModule to ClrIcon');

    let updateCount = 0;

    visitFiles(tree, '**/*.{ts,html,css,scss,sass,less}', filePath => {
      const original = tree.read(filePath)?.toString('utf-8');
      if (!original || (!original.includes('cds-icon') && !original.includes('ClrIconModule'))) {
        return;
      }

      let text = renameCdsIconTag(original);
      if (filePath.endsWith('.ts')) {
        text = replaceClrIconModule(text);
      }

      if (text !== original) {
        tree.overwrite(filePath, text);
        updateCount++;
        context.logger.info(`    UPDATE ${filePath}`);
      }
    });

    context.logger.info(`  ${updateCount} file(s) updated.`);
  };
}
