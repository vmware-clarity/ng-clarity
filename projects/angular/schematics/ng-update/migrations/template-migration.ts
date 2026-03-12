/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { CSS_ATTRIBUTE_REPLACEMENTS } from '../replacements/css-replacements';
import {
  HEADER_CLASS_REPLACEMENTS,
  TEMPLATE_ATTRIBUTE_REPLACEMENTS,
  TEMPLATE_INPUT_REPLACEMENTS,
  TEMPLATE_OUTPUT_REPLACEMENTS,
} from '../replacements/template-replacements';
import { visitFiles } from '../utils/file-visitor';

export function migrateTemplates(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('  Migrating HTML templates...');

    let htmlFileCount = 0;
    let tsFileCount = 0;

    visitFiles(tree, '**/*.html', filePath => {
      const content = tree.read(filePath);
      if (!content) {
        return;
      }

      let text = content.toString('utf-8');
      const original = text;

      text = migrateOutputBindings(text);
      text = migrateInputBindings(text);
      text = migrateCdsIconAttributes(text);
      text = migrateHeaderClasses(text);
      text = migrateCdsTextAttributes(text);

      if (text !== original) {
        tree.overwrite(filePath, text);
        htmlFileCount++;
      }
    });

    visitFiles(tree, '**/*.ts', filePath => {
      const content = tree.read(filePath);
      if (!content) {
        return;
      }

      let text = content.toString('utf-8');
      const original = text;

      text = migrateInlineTemplates(text);

      if (text !== original) {
        tree.overwrite(filePath, text);
        tsFileCount++;
      }
    });

    context.logger.info(`    Updated ${htmlFileCount} HTML template(s) and ${tsFileCount} inline template(s).`);
  };
}

function migrateOutputBindings(text: string): string {
  for (const replacement of TEMPLATE_OUTPUT_REPLACEMENTS) {
    // Match (outputName)="..." format
    text = text.replace(new RegExp(`\\(${escapeRegExp(replacement.old)}\\)`, 'g'), `(${replacement.new})`);
  }
  return text;
}

function migrateInputBindings(text: string): string {
  for (const replacement of TEMPLATE_INPUT_REPLACEMENTS) {
    // Match [inputName]="..." and inputName="..." formats
    text = text.replace(new RegExp(`\\[${escapeRegExp(replacement.old)}\\]`, 'g'), `[${replacement.new}]`);
    text = text.replace(new RegExp(`(?<=\\s)${escapeRegExp(replacement.old)}(?==)`, 'g'), replacement.new);
  }
  return text;
}

function migrateCdsIconAttributes(text: string): string {
  for (const replacement of TEMPLATE_ATTRIBUTE_REPLACEMENTS) {
    text = text.replace(new RegExp(escapeRegExp(replacement.old), 'g'), replacement.new);
  }
  return text;
}

function migrateHeaderClasses(text: string): string {
  for (const replacement of HEADER_CLASS_REPLACEMENTS) {
    // Match class="...header-N..." — only replace the specific header class
    text = text.replace(new RegExp(`\\b${escapeRegExp(replacement.old)}\\b`, 'g'), replacement.new);
  }
  return text;
}

function migrateCdsTextAttributes(text: string): string {
  for (const replacement of CSS_ATTRIBUTE_REPLACEMENTS) {
    text = text.replace(new RegExp(escapeRegExp(replacement.old), 'g'), replacement.new);
  }
  return text;
}

function migrateInlineTemplates(text: string): string {
  // Match template: `...` or template: '...' in @Component decorators
  const templateRegex = /template\s*:\s*(`[\s\S]*?`|'[\s\S]*?')/g;

  return text.replace(templateRegex, (match, templateContent: string) => {
    let content = templateContent;
    const original = content;

    content = migrateOutputBindings(content);
    content = migrateInputBindings(content);
    content = migrateCdsIconAttributes(content);
    content = migrateHeaderClasses(content);
    content = migrateCdsTextAttributes(content);

    if (content !== original) {
      return match.replace(original, content);
    }
    return match;
  });
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
