"use strict";
/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMPORT_MIGRATION_CANDIDATES = void 0;
exports.transformImports = transformImports;
exports.migrateImports = migrateImports;
const import_replacements_1 = require("../replacements/import-replacements");
const symbol_replacements_1 = require("../replacements/symbol-replacements");
const file_visitor_1 = require("../utils/file-visitor");
// ---------------------------------------------------------------------------
// Pre-compiled regex arrays — built once at module load, not per-file
// ---------------------------------------------------------------------------
// Sort import replacements by path length descending so more-specific paths
// (e.g. '@clr/angular/src/accordion/stepper') match before shorter prefixes.
const SORTED_IMPORT_REPLACEMENTS = [...import_replacements_1.IMPORT_REPLACEMENTS].sort((a, b) => b.oldModule.length - a.oldModule.length);
const COMPILED_IMPORT_REPLACEMENTS = SORTED_IMPORT_REPLACEMENTS.map(r => ({
    ...r,
    regex: r.oldSymbol === '*'
        ? new RegExp(`(from\\s+['"])${escapeRegExp(r.oldModule)}(?=[/'"])`, 'g')
        : new RegExp(`(import\\s*\\{[^}]*\\b)${escapeRegExp(r.oldSymbol)}(\\b[^}]*\\}\\s*from\\s*['"])${escapeRegExp(r.oldModule)}(['"])`, 'g'),
}));
// Only symbols with a non-empty new name are renamed here; removed symbols handled separately.
const COMPILED_SYMBOL_REPLACEMENTS = symbol_replacements_1.SYMBOL_REPLACEMENTS.filter(r => r.new).map(r => ({
    ...r,
    // Ç (U+00C7) is not an ASCII word character so \b doesn't delimit it.
    // Use lookahead/lookbehind to avoid partial matches.
    regex: r.old.startsWith('Ç')
        ? new RegExp(`(?<![A-Za-z0-9_$Ç])${escapeRegExp(r.old)}(?![A-Za-z0-9_$])`, 'g')
        : new RegExp(`\\b${escapeRegExp(r.old)}\\b`, 'g'),
}));
const REMOVED_SYMBOLS = symbol_replacements_1.SYMBOL_REPLACEMENTS.filter(r => r.new === '').map(r => r.old);
const REMOVED_SYMBOL_SOLE_IMPORT_REGEXES = REMOVED_SYMBOLS.map(sym => new RegExp(`^\\s*import\\s*\\{\\s*${escapeRegExp(sym)}\\s*\\}\\s*from\\s*['"][^'"]+['"]\\s*;?\\s*$`, 'gm'));
const REMOVED_SYMBOL_LEADING_COMMA_REGEXES = REMOVED_SYMBOLS.map(sym => new RegExp(`\\b${escapeRegExp(sym)}\\b\\s*,\\s*`, 'g'));
const REMOVED_SYMBOL_TRAILING_COMMA_REGEXES = REMOVED_SYMBOLS.map(sym => new RegExp(`\\s*,\\s*${escapeRegExp(sym)}\\b`, 'g'));
const REMOVED_SYMBOL_USAGE_REGEXES = REMOVED_SYMBOLS.map(sym => ({
    sym,
    test: new RegExp(`\\b${escapeRegExp(sym)}\\b`),
    replace: new RegExp(`\\b${escapeRegExp(sym)}\\b`, 'g'),
}));
// ---------------------------------------------------------------------------
// Fast-path candidate strings — if none present, skip the file entirely
// ---------------------------------------------------------------------------
exports.IMPORT_MIGRATION_CANDIDATES = [
    ...import_replacements_1.IMPORT_REPLACEMENTS.map(r => r.oldModule),
    ...symbol_replacements_1.SYMBOL_REPLACEMENTS.filter(r => r.new).map(r => r.old),
    ...REMOVED_SYMBOLS,
];
// ---------------------------------------------------------------------------
// Public pure transform — used by the unified .ts pass in index.ts
// ---------------------------------------------------------------------------
function transformImports(text) {
    if (!exports.IMPORT_MIGRATION_CANDIDATES.some(c => text.includes(c))) {
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
function migrateImports() {
    return (tree, context) => {
        context.logger.info('  Migrating TypeScript imports and symbols...');
        let fileCount = 0;
        (0, file_visitor_1.visitFiles)(tree, '**/*.ts', filePath => {
            const content = tree.read(filePath);
            if (!content) {
                return;
            }
            const original = content.toString('utf-8');
            const updated = transformImports(original);
            if (updated !== original) {
                tree.overwrite(filePath, updated);
                fileCount++;
            }
        });
        context.logger.info(`    Updated ${fileCount} TypeScript file(s).`);
    };
}
// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------
function replaceImportPaths(text) {
    for (const r of COMPILED_IMPORT_REPLACEMENTS) {
        if (!text.includes(r.oldModule)) {
            continue;
        }
        r.regex.lastIndex = 0;
        if (r.oldSymbol === '*') {
            text = text.replace(r.regex, `$1${r.newModule}`);
        }
        else {
            text = text.replace(r.regex, `$1${r.newSymbol}$2${r.newModule}$3`);
        }
    }
    return text;
}
function replaceSymbols(text) {
    for (const r of COMPILED_SYMBOL_REPLACEMENTS) {
        if (!text.includes(r.old)) {
            continue;
        }
        r.regex.lastIndex = 0;
        text = text.replace(r.regex, r.new);
    }
    return text;
}
function removeDeletedImports(text) {
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
            text = text.replace(usage.replace, `${sym} /* TODO: '${sym}' was removed in @clr/angular v18. Use standard KeyboardEvent.key values instead. */`);
        }
    }
    return text;
}
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=import-migration.js.map