"use strict";
/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateImports = migrateImports;
const import_replacements_1 = require("../replacements/import-replacements");
const symbol_replacements_1 = require("../replacements/symbol-replacements");
const file_visitor_1 = require("../utils/file-visitor");
function migrateImports() {
    return (tree, context) => {
        context.logger.info('  Migrating TypeScript imports and symbols...');
        let fileCount = 0;
        (0, file_visitor_1.visitFiles)(tree, '**/*.ts', filePath => {
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
function replaceImportPaths(text) {
    // Sort by path length descending so more specific paths match first
    // (e.g., '@clr/angular/src/accordion/stepper' before '@clr/angular/src/accordion')
    const sorted = [...import_replacements_1.IMPORT_REPLACEMENTS].sort((a, b) => b.oldModule.length - a.oldModule.length);
    for (const replacement of sorted) {
        if (replacement.oldSymbol === '*') {
            const escapedOld = escapeRegExp(replacement.oldModule);
            const regex = new RegExp(`(from\\s+['"])${escapedOld}(?=[/'"])`, 'g');
            text = text.replace(regex, `$1${replacement.newModule}`);
        }
        else {
            // Replace specific named import within a module
            const importRegex = new RegExp(`(import\\s*\\{[^}]*\\b)${escapeRegExp(replacement.oldSymbol)}(\\b[^}]*\\}\\s*from\\s*['"])${escapeRegExp(replacement.oldModule)}(['"])`, 'g');
            text = text.replace(importRegex, `$1${replacement.newSymbol}$2${replacement.newModule}$3`);
        }
    }
    return text;
}
function replaceSymbols(text) {
    for (const replacement of symbol_replacements_1.SYMBOL_REPLACEMENTS) {
        if (!replacement.new) {
            continue; // Removed symbols - handled by removeDeletedImports
        }
        // Only rename if old symbol is used (word-boundary match)
        const regex = new RegExp(`\\b${escapeRegExp(replacement.old)}\\b`, 'g');
        text = text.replace(regex, replacement.new);
    }
    return text;
}
function removeDeletedImports(text) {
    const removedSymbols = symbol_replacements_1.SYMBOL_REPLACEMENTS.filter(r => r.new === '').map(r => r.old);
    for (const symbol of removedSymbols) {
        // Remove import of the symbol (handles sole import and one-of-many)
        // Sole import: import { Symbol } from '...';
        const soleImportRegex = new RegExp(`^\\s*import\\s*\\{\\s*${escapeRegExp(symbol)}\\s*\\}\\s*from\\s*['"][^'"]+['"]\\s*;?\\s*$`, 'gm');
        text = text.replace(soleImportRegex, '');
        // One of many: remove the symbol and surrounding comma
        text = text.replace(new RegExp(`\\b${escapeRegExp(symbol)}\\b\\s*,\\s*`, 'g'), '');
        text = text.replace(new RegExp(`\\s*,\\s*${escapeRegExp(symbol)}\\b`, 'g'), '');
        // Add TODO comment where the symbol is still used
        if (new RegExp(`\\b${escapeRegExp(symbol)}\\b`).test(text)) {
            text = text.replace(new RegExp(`\\b${escapeRegExp(symbol)}\\b`, 'g'), `${symbol} /* TODO: '${symbol}' was removed in @clr/angular v18. Use standard KeyboardEvent.key values instead. */`);
        }
    }
    return text;
}
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=import-migration.js.map