/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import {
  CSS_ATTRIBUTE_REPLACEMENTS,
  CSS_PROPERTY_REPLACEMENTS,
  CSS_SELECTOR_REPLACEMENTS,
  REMOVED_SCSS_MIXINS,
} from '../replacements/css-replacements';
import { visitFiles } from '../utils/file-visitor';

// ---------------------------------------------------------------------------
// Pre-compiled regex arrays — built once at module load, not per-file
// ---------------------------------------------------------------------------

// Negative lookahead (?![-\w]) ensures a CSS custom property name that is a
// prefix of a longer one (e.g. --clr-foo--active inside --clr-foo--active-extra)
// is NOT matched, preventing false-positive renames.
const COMPILED_PROPERTY_RENAME_REGEXES = CSS_PROPERTY_REPLACEMENTS.filter(r => r.new).map(r => ({
  old: r.old,
  new: r.new,
  regex: new RegExp(`${escapeRegExp(r.old)}(?![-\\w])`, 'g'),
}));

const COMPILED_PROPERTY_REMOVE_REGEXES = CSS_PROPERTY_REPLACEMENTS.filter(r => !r.new).map(r => ({
  old: r.old,
  regex: new RegExp(`(\\s*)(${escapeRegExp(r.old)}(?![-\\w])\\s*:[^;]*;)`, 'g'),
}));

const COMPILED_SELECTOR_REGEXES = CSS_SELECTOR_REPLACEMENTS.map(r => ({
  old: r.old,
  new: r.new,
  regex: new RegExp(`\\b${escapeRegExp(r.old)}\\b`, 'g'),
}));

const COMPILED_ATTRIBUTE_REGEXES = CSS_ATTRIBUTE_REPLACEMENTS.map(r => ({
  old: r.old,
  new: r.new,
  regex: new RegExp(escapeRegExp(r.old), 'g'),
}));

const COMPILED_MIXIN_REGEXES = REMOVED_SCSS_MIXINS.map(name => ({
  name,
  regex: new RegExp(`@include\\s+${escapeRegExp(name)}\\s*\\([^)]*\\)\\s*;`, 'g'),
}));

// ---------------------------------------------------------------------------
// Fast-path candidate strings
// ---------------------------------------------------------------------------

export const CSS_MIGRATION_CANDIDATES: readonly string[] = [
  ...CSS_PROPERTY_REPLACEMENTS.map(r => r.old),
  ...CSS_SELECTOR_REPLACEMENTS.map(r => r.old),
  ...CSS_ATTRIBUTE_REPLACEMENTS.map(r => r.old),
  ...REMOVED_SCSS_MIXINS,
];

export const CSS_MIGRATION_INLINE_CANDIDATES = CSS_MIGRATION_CANDIDATES;

// ---------------------------------------------------------------------------
// Public pure transforms — used by the unified .ts pass in index.ts
// ---------------------------------------------------------------------------

export function transformInlineStyles(text: string): string {
  const stylesRegex = /styles\s*:\s*\[([^\]]*)\]/g;

  return text.replace(stylesRegex, (match, stylesContent: string) => {
    if (!CSS_MIGRATION_INLINE_CANDIDATES.some(c => stylesContent.includes(c))) {
      return match;
    }
    const updated = applyStyleTransforms(stylesContent, null);
    return updated !== stylesContent ? match.replace(stylesContent, updated) : match;
  });
}

// ---------------------------------------------------------------------------
// Schematic Rule — visits style files and .ts inline styles
// ---------------------------------------------------------------------------

export function migrateCssProperties(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('  Migrating style files (CSS, SCSS, Sass, Less)');

    let styleScanCount = 0;
    let styleUpdateCount = 0;
    let tsScanCount = 0;
    let tsUpdateCount = 0;

    visitFiles(tree, '**/*.{css,scss,sass,less}', filePath => {
      styleScanCount++;

      const content = tree.read(filePath);
      if (!content) {
        return;
      }

      const original = content.toString('utf-8');
      if (!CSS_MIGRATION_CANDIDATES.some(c => original.includes(c))) {
        return;
      }

      const updated = applyStyleTransforms(original, filePath);
      if (updated !== original) {
        tree.overwrite(filePath, updated);
        styleUpdateCount++;
        context.logger.info(`    UPDATE ${filePath}`);
      }
    });

    visitFiles(tree, '**/*.ts', filePath => {
      tsScanCount++;

      const content = tree.read(filePath);
      if (!content) {
        return;
      }

      const original = content.toString('utf-8');
      if (!CSS_MIGRATION_INLINE_CANDIDATES.some(c => original.includes(c))) {
        return;
      }

      const updated = transformInlineStyles(original);
      if (updated !== original) {
        tree.overwrite(filePath, updated);
        tsUpdateCount++;
        context.logger.info(`    UPDATE ${filePath}`);
      }
    });

    const totalScanned = styleScanCount + tsScanCount;
    const totalUpdated = styleUpdateCount + tsUpdateCount;
    context.logger.info(`  ${totalUpdated} of ${totalScanned} file(s) updated.`);
  };
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function applyStyleTransforms(text: string, filePath: string | null): string {
  text = replaceCssProperties(text);
  text = replaceCssSelectors(text);
  text = replaceCssAttributes(text);

  const isScssSass = filePath === null || filePath.endsWith('.scss') || filePath.endsWith('.sass');
  if (isScssSass) {
    text = replaceScssMixins(text);
  }

  return text;
}

function replaceCssProperties(text: string): string {
  for (const r of COMPILED_PROPERTY_RENAME_REGEXES) {
    if (!text.includes(r.old)) {
      continue;
    }
    r.regex.lastIndex = 0;
    text = text.replace(r.regex, r.new);
  }
  for (const r of COMPILED_PROPERTY_REMOVE_REGEXES) {
    if (!text.includes(r.old)) {
      continue;
    }
    r.regex.lastIndex = 0;
    text = text.replace(r.regex, `$1/* TODO(v18 migration): '${r.old}' has been removed. */ /* $2 */`);
  }
  return text;
}

function replaceCssSelectors(text: string): string {
  for (const r of COMPILED_SELECTOR_REGEXES) {
    if (!text.includes(r.old)) {
      continue;
    }
    r.regex.lastIndex = 0;
    text = text.replace(r.regex, r.new);
  }
  return text;
}

function replaceCssAttributes(text: string): string {
  for (const r of COMPILED_ATTRIBUTE_REGEXES) {
    if (!text.includes(r.old)) {
      continue;
    }
    r.regex.lastIndex = 0;
    text = text.replace(r.regex, r.new);
  }
  return text;
}

function replaceScssMixins(text: string): string {
  for (const r of COMPILED_MIXIN_REGEXES) {
    if (!text.includes(r.name)) {
      continue;
    }
    r.regex.lastIndex = 0;
    text = text.replace(r.regex, `/* TODO(v18 migration): '@include ${r.name}(...)' has been removed. */`);
  }
  return text;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
