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

// ---------------------------------------------------------------------------
// Pre-compiled regex arrays — built once at module load, not per-file
// ---------------------------------------------------------------------------

const COMPILED_OUTPUT_REGEXES = TEMPLATE_OUTPUT_REPLACEMENTS.map(r => ({
  old: r.old,
  new: r.new,
  regex: new RegExp(`\\(${escapeRegExp(r.old)}\\)`, 'g'),
}));

const COMPILED_INPUT_BOUND_REGEXES = TEMPLATE_INPUT_REPLACEMENTS.map(r => ({
  old: r.old,
  new: r.new,
  boundRegex: new RegExp(`\\[${escapeRegExp(r.old)}\\]`, 'g'),
  bareRegex: new RegExp(`(?<=\\s)${escapeRegExp(r.old)}(?==)`, 'g'),
}));

// cds-icon [attr.*] replacements: applied only within <cds-icon> opening tags to
// avoid false positives on native elements like <input [attr.size]="x">.
const COMPILED_CDS_ICON_ATTR_ENTRIES = TEMPLATE_ATTRIBUTE_REPLACEMENTS.filter(r => r.context === 'cds-icon');

// Non-scoped attribute replacements: applied globally (e.g. clrPopoverAnchor).
// Word boundaries (\b) prevent matching inside longer identifiers such as clrPopoverAnchorClose.
const COMPILED_GLOBAL_ATTR_REGEXES = TEMPLATE_ATTRIBUTE_REPLACEMENTS.filter(r => r.context !== 'cds-icon').map(r => ({
  old: r.old,
  new: r.new,
  regex: new RegExp(`\\b${escapeRegExp(r.old)}\\b`, 'g'),
}));

// Quote-aware regex that matches a complete <cds-icon …> or <cds-icon … /> opening tag.
// Handles attribute values that contain > (e.g. [attr.size]="size > 0 ? 'lg' : 'md'").
const CDS_ICON_TAG_RE = /<cds-icon\b(?:[^"'/>]|"[^"]*"|'[^']*')*(?:\/?>)/g;

const COMPILED_HEADER_REGEXES = HEADER_CLASS_REPLACEMENTS.map(r => ({
  old: r.old,
  new: r.new,
  regex: new RegExp(`\\b${escapeRegExp(r.old)}\\b`, 'g'),
}));

const COMPILED_CDS_TEXT_REGEXES = CSS_ATTRIBUTE_REPLACEMENTS.map(r => ({
  old: r.old,
  new: r.new,
  regex: new RegExp(escapeRegExp(r.old), 'g'),
}));

// ---------------------------------------------------------------------------
// Fast-path candidate strings
// ---------------------------------------------------------------------------

export const TEMPLATE_MIGRATION_HTML_CANDIDATES: readonly string[] = [
  ...TEMPLATE_OUTPUT_REPLACEMENTS.map(r => r.old),
  ...TEMPLATE_INPUT_REPLACEMENTS.map(r => r.old),
  ...TEMPLATE_ATTRIBUTE_REPLACEMENTS.map(r => r.old),
  ...HEADER_CLASS_REPLACEMENTS.map(r => r.old),
  ...CSS_ATTRIBUTE_REPLACEMENTS.map(r => r.old),
];

export const TEMPLATE_MIGRATION_INLINE_CANDIDATES = TEMPLATE_MIGRATION_HTML_CANDIDATES;

// ---------------------------------------------------------------------------
// Public pure transforms — used by the unified .ts pass in index.ts
// ---------------------------------------------------------------------------

export function transformInlineTemplates(text: string): string {
  const templateRegex = /template\s*:\s*(`[\s\S]*?`|'[\s\S]*?')/g;

  return text.replace(templateRegex, (match, templateContent: string) => {
    if (!TEMPLATE_MIGRATION_INLINE_CANDIDATES.some(c => templateContent.includes(c))) {
      return match;
    }
    const updated = applyHtmlTransforms(templateContent);
    return updated !== templateContent ? match.replace(templateContent, updated) : match;
  });
}

// ---------------------------------------------------------------------------
// Schematic Rule — visits .html files; .ts inline templates handled in unified pass
// ---------------------------------------------------------------------------

export function migrateTemplates(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('  Migrating HTML templates');

    let htmlScanCount = 0;
    let htmlUpdateCount = 0;
    let tsScanCount = 0;
    let tsUpdateCount = 0;

    visitFiles(tree, '**/*.html', filePath => {
      htmlScanCount++;

      const content = tree.read(filePath);
      if (!content) {
        return;
      }

      const original = content.toString('utf-8');
      if (!TEMPLATE_MIGRATION_HTML_CANDIDATES.some(c => original.includes(c))) {
        return;
      }

      const updated = applyHtmlTransforms(original);
      if (updated !== original) {
        tree.overwrite(filePath, updated);
        htmlUpdateCount++;
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
      if (!TEMPLATE_MIGRATION_INLINE_CANDIDATES.some(c => original.includes(c))) {
        return;
      }

      const updated = transformInlineTemplates(original);
      if (updated !== original) {
        tree.overwrite(filePath, updated);
        tsUpdateCount++;
        context.logger.info(`    UPDATE ${filePath}`);
      }
    });

    const totalScanned = htmlScanCount + tsScanCount;
    const totalUpdated = htmlUpdateCount + tsUpdateCount;
    context.logger.info(`  ${totalUpdated} of ${totalScanned} file(s) updated.`);
  };
}

// ---------------------------------------------------------------------------
// Helpers — exported for direct testing; not part of the public schematic API
// ---------------------------------------------------------------------------

export function applyHtmlTransforms(text: string): string {
  text = migrateOutputBindings(text);
  text = migrateInputBindings(text);
  text = migrateCdsIconAttributes(text);
  text = migrateHeaderClasses(text);
  text = migrateCdsTextAttributes(text);
  return text;
}

function migrateOutputBindings(text: string): string {
  for (const r of COMPILED_OUTPUT_REGEXES) {
    if (!text.includes(r.old)) {
      continue;
    }
    r.regex.lastIndex = 0;
    text = text.replace(r.regex, `(${r.new})`);
  }
  return text;
}

function migrateInputBindings(text: string): string {
  for (const r of COMPILED_INPUT_BOUND_REGEXES) {
    if (!text.includes(r.old)) {
      continue;
    }
    r.boundRegex.lastIndex = 0;
    r.bareRegex.lastIndex = 0;
    text = text.replace(r.boundRegex, `[${r.new}]`);
    text = text.replace(r.bareRegex, r.new);
  }
  return text;
}

function migrateCdsIconAttributes(text: string): string {
  // Scoped pass: only touch [attr.*] inside <cds-icon> opening tags.
  if (COMPILED_CDS_ICON_ATTR_ENTRIES.some(r => text.includes(r.old))) {
    CDS_ICON_TAG_RE.lastIndex = 0;
    text = text.replace(CDS_ICON_TAG_RE, tagMatch => {
      for (const { old: oldStr, new: newStr } of COMPILED_CDS_ICON_ATTR_ENTRIES) {
        if (tagMatch.includes(oldStr)) {
          tagMatch = tagMatch.split(oldStr).join(newStr);
        }
      }
      return tagMatch;
    });
  }

  // Global pass: non-scoped attribute replacements.
  for (const r of COMPILED_GLOBAL_ATTR_REGEXES) {
    if (!text.includes(r.old)) {
      continue;
    }
    r.regex.lastIndex = 0;
    text = text.replace(r.regex, r.new);
  }

  return text;
}

function migrateHeaderClasses(text: string): string {
  for (const r of COMPILED_HEADER_REGEXES) {
    if (!text.includes(r.old)) {
      continue;
    }
    r.regex.lastIndex = 0;
    text = text.replace(r.regex, r.new);
  }
  return text;
}

function migrateCdsTextAttributes(text: string): string {
  for (const r of COMPILED_CDS_TEXT_REGEXES) {
    if (!text.includes(r.old)) {
      continue;
    }
    r.regex.lastIndex = 0;
    text = text.replace(r.regex, r.new);
  }
  return text;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
