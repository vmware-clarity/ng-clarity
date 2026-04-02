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

// ---------------------------------------------------------------------------
// Pre-compiled regex arrays — built once at module load, not per-file
// ---------------------------------------------------------------------------

// Sort import replacements by path length descending so more-specific paths
// (e.g. '@clr/angular/src/accordion/stepper') match before shorter prefixes.
const SORTED_IMPORT_REPLACEMENTS = [...IMPORT_REPLACEMENTS].sort((a, b) => b.oldModule.length - a.oldModule.length);

// Wildcard replacements: change the whole module path for all symbols.
const COMPILED_WILDCARD_IMPORT_REGEXES = SORTED_IMPORT_REPLACEMENTS.filter(r => r.oldSymbol === '*').map(r => ({
  oldModule: r.oldModule,
  newModule: r.newModule,
  regex: new RegExp(`(from\\s+['"])${escapeRegExp(r.oldModule)}(?=[/'"])`, 'g'),
}));

// Symbol-specific replacements: only the named symbol moves to the new module.
// Kept as plain data — splitSymbolImport() handles them at runtime to avoid
// the false positive where sibling symbols in the same import are dragged to
// the wrong module path.
const SYMBOL_SPECIFIC_IMPORTS = SORTED_IMPORT_REPLACEMENTS.filter(r => r.oldSymbol !== '*').map(r => ({
  oldModule: r.oldModule,
  newModule: r.newModule,
  oldSymbol: r.oldSymbol,
  newSymbol: r.newSymbol,
}));

interface CompiledSymbolReplacement {
  readonly old: string;
  readonly new: string;
  readonly context?: string;
  readonly regex: RegExp;
}

// Only symbols with a non-empty new name are renamed here; removed symbols handled separately.
const COMPILED_SYMBOL_REPLACEMENTS: CompiledSymbolReplacement[] = SYMBOL_REPLACEMENTS.filter(r => r.new).map(r => ({
  ...r,
  // Ç (U+00C7) is not an ASCII word character so \b doesn't delimit it.
  // Use lookahead/lookbehind to avoid partial matches.
  regex: r.old.startsWith('Ç')
    ? new RegExp(`(?<![A-Za-z0-9_$Ç])${escapeRegExp(r.old)}(?![A-Za-z0-9_$])`, 'g')
    : new RegExp(`\\b${escapeRegExp(r.old)}\\b`, 'g'),
}));

const REMOVED_SYMBOLS = SYMBOL_REPLACEMENTS.filter(r => r.new === '').map(r => r.old);

const REMOVED_SYMBOL_SOLE_IMPORT_REGEXES = REMOVED_SYMBOLS.map(
  sym => new RegExp(`^\\s*import\\s*\\{\\s*${escapeRegExp(sym)}\\s*\\}\\s*from\\s*['"][^'"]+['"]\\s*;?\\s*$`, 'gm')
);

const REMOVED_SYMBOL_LEADING_COMMA_REGEXES = REMOVED_SYMBOLS.map(
  sym => new RegExp(`\\b${escapeRegExp(sym)}\\b\\s*,\\s*`, 'g')
);

const REMOVED_SYMBOL_TRAILING_COMMA_REGEXES = REMOVED_SYMBOLS.map(
  sym => new RegExp(`\\s*,\\s*${escapeRegExp(sym)}\\b`, 'g')
);

const REMOVED_SYMBOL_USAGE_REGEXES = REMOVED_SYMBOLS.map(sym => ({
  sym,
  test: new RegExp(`\\b${escapeRegExp(sym)}\\b`),
  replace: new RegExp(`\\b${escapeRegExp(sym)}\\b`, 'g'),
}));

// ---------------------------------------------------------------------------
// Fast-path candidate strings — if none present, skip the file entirely
// ---------------------------------------------------------------------------

export const IMPORT_MIGRATION_CANDIDATES: readonly string[] = [
  ...IMPORT_REPLACEMENTS.map(r => r.oldModule),
  ...SYMBOL_REPLACEMENTS.filter(r => r.new).map(r => r.old),
  ...REMOVED_SYMBOLS,
];

// ---------------------------------------------------------------------------
// Public pure transform — used by the unified .ts pass in index.ts
// ---------------------------------------------------------------------------

export function transformImports(text: string): string {
  if (!IMPORT_MIGRATION_CANDIDATES.some(c => text.includes(c))) {
    return text;
  }

  text = replaceImportPaths(text);
  text = replaceSymbols(text);
  text = removeDeletedImports(text);
  return text;
}

// ---------------------------------------------------------------------------
// Schematic Rule — kept for backwards compatibility; unified pass in index.ts
// is preferred for performance.
// ---------------------------------------------------------------------------

export function migrateImports(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('  Migrating TypeScript imports and symbols');

    let scanCount = 0;
    let fileCount = 0;

    visitFiles(tree, '**/*.ts', filePath => {
      scanCount++;

      const content = tree.read(filePath);
      if (!content) {
        return;
      }

      const original = content.toString('utf-8');
      const updated = transformImports(original);

      if (updated !== original) {
        tree.overwrite(filePath, updated);
        fileCount++;
        context.logger.info(`    UPDATE ${filePath}`);
      }
    });

    context.logger.info(`  ${fileCount} of ${scanCount} file(s) updated.`);
  };
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function replaceImportPaths(text: string): string {
  // Wildcard replacements: move all symbols from oldModule to newModule.
  for (const r of COMPILED_WILDCARD_IMPORT_REGEXES) {
    if (!text.includes(r.oldModule)) {
      continue;
    }
    r.regex.lastIndex = 0;
    text = text.replace(r.regex, `$1${r.newModule}`);
  }

  // Symbol-specific replacements: extract one symbol to a new module, leaving
  // any sibling symbols on the original module to prevent false positives.
  for (const r of SYMBOL_SPECIFIC_IMPORTS) {
    if (!text.includes(r.oldModule) || !text.includes(r.oldSymbol)) {
      continue;
    }
    text = splitSymbolImport(text, r.oldSymbol, r.newSymbol, r.oldModule, r.newModule);
  }

  return text;
}

/**
 * Extracts a single named symbol from an import and moves it to a new module.
 *
 * When the import contains sibling symbols, a second import for the remaining
 * symbols on the original module is emitted. This prevents the false positive
 * where all siblings are silently moved to the wrong module.
 *
 * Example (multi-symbol):
 *   import { FocusService, ClrFormsModule } from '@clr/angular/forms';
 *   →
 *   import { FormsFocusService } from '@clr/angular/forms/common';
 *   import { ClrFormsModule } from '@clr/angular/forms';
 */
function splitSymbolImport(
  text: string,
  oldSymbol: string,
  newSymbol: string,
  oldModule: string,
  newModule: string
): string {
  const modEsc = escapeRegExp(oldModule);
  const symEsc = escapeRegExp(oldSymbol);
  // Compiled once per call, not inside the replace callback.
  const symInListRe = new RegExp(`(?:^|,)\\s*${symEsc}\\s*(?:,|$)`);
  const importRe = new RegExp(`([ \\t]*)import\\s*\\{([^}]*)\\}\\s*from\\s*(['"])${modEsc}\\3(\\s*;?)`, 'gm');

  return text.replace(importRe, (match, indent: string, symbolList: string, quote: string, semi: string) => {
    if (!symInListRe.test(symbolList)) {
      return match;
    }

    const semiStr = semi.trim() || ';';
    const remaining = symbolList
      .split(',')
      .map(s => s.trim())
      .filter(s => s && s !== oldSymbol);

    if (remaining.length === 0) {
      return `${indent}import { ${newSymbol} } from ${quote}${newModule}${quote}${semiStr}`;
    }

    const newLine = `${indent}import { ${newSymbol} } from ${quote}${newModule}${quote}${semiStr}`;
    const oldLine = `${indent}import { ${remaining.join(', ')} } from ${quote}${oldModule}${quote}${semiStr}`;
    return `${newLine}\n${oldLine}`;
  });
}

function replaceSymbols(text: string): string {
  for (const r of COMPILED_SYMBOL_REPLACEMENTS) {
    if (!text.includes(r.old)) {
      continue;
    }
    r.regex.lastIndex = 0;
    text = text.replace(r.regex, r.new);
  }
  return text;
}

function removeDeletedImports(text: string): string {
  for (let i = 0; i < REMOVED_SYMBOLS.length; i++) {
    const sym = REMOVED_SYMBOLS[i];
    if (!text.includes(sym)) {
      continue;
    }

    text = text.replace(REMOVED_SYMBOL_SOLE_IMPORT_REGEXES[i], '');
    text = text.replace(REMOVED_SYMBOL_LEADING_COMMA_REGEXES[i], '');
    text = text.replace(REMOVED_SYMBOL_TRAILING_COMMA_REGEXES[i], '');

    const usage = REMOVED_SYMBOL_USAGE_REGEXES[i];
    if (usage.test.test(text)) {
      usage.replace.lastIndex = 0;
      text = text.replace(
        usage.replace,
        `${sym} /* TODO: '${sym}' was removed in @clr/angular v18. Use standard KeyboardEvent.key values instead. */`
      );
    }
  }
  return text;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
