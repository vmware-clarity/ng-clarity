"use strict";
/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSS_MIGRATION_INLINE_CANDIDATES = exports.CSS_MIGRATION_CANDIDATES = void 0;
exports.transformInlineStyles = transformInlineStyles;
exports.migrateCssProperties = migrateCssProperties;
const css_replacements_1 = require("../replacements/css-replacements");
const file_visitor_1 = require("../utils/file-visitor");
// ---------------------------------------------------------------------------
// Pre-compiled regex arrays — built once at module load, not per-file
// ---------------------------------------------------------------------------
const COMPILED_PROPERTY_RENAME_REGEXES = css_replacements_1.CSS_PROPERTY_REPLACEMENTS.filter(r => r.new).map(r => ({
    old: r.old,
    new: r.new,
    regex: new RegExp(escapeRegExp(r.old), 'g'),
}));
const COMPILED_PROPERTY_REMOVE_REGEXES = css_replacements_1.CSS_PROPERTY_REPLACEMENTS.filter(r => !r.new).map(r => ({
    old: r.old,
    regex: new RegExp(`(\\s*)(${escapeRegExp(r.old)}\\s*:[^;]*;)`, 'g'),
}));
const COMPILED_SELECTOR_REGEXES = css_replacements_1.CSS_SELECTOR_REPLACEMENTS.map(r => ({
    old: r.old,
    new: r.new,
    regex: new RegExp(`\\b${escapeRegExp(r.old)}\\b`, 'g'),
}));
const COMPILED_ATTRIBUTE_REGEXES = css_replacements_1.CSS_ATTRIBUTE_REPLACEMENTS.map(r => ({
    old: r.old,
    new: r.new,
    regex: new RegExp(escapeRegExp(r.old), 'g'),
}));
const COMPILED_MIXIN_REGEXES = css_replacements_1.REMOVED_SCSS_MIXINS.map(name => ({
    name,
    regex: new RegExp(`@include\\s+${escapeRegExp(name)}\\s*\\([^)]*\\)\\s*;`, 'g'),
}));
// ---------------------------------------------------------------------------
// Fast-path candidate strings
// ---------------------------------------------------------------------------
exports.CSS_MIGRATION_CANDIDATES = [
    ...css_replacements_1.CSS_PROPERTY_REPLACEMENTS.map(r => r.old),
    ...css_replacements_1.CSS_SELECTOR_REPLACEMENTS.map(r => r.old),
    ...css_replacements_1.CSS_ATTRIBUTE_REPLACEMENTS.map(r => r.old),
    ...css_replacements_1.REMOVED_SCSS_MIXINS,
];
exports.CSS_MIGRATION_INLINE_CANDIDATES = exports.CSS_MIGRATION_CANDIDATES;
// ---------------------------------------------------------------------------
// Public pure transforms — used by the unified .ts pass in index.ts
// ---------------------------------------------------------------------------
function transformInlineStyles(text) {
    const stylesRegex = /styles\s*:\s*\[([^\]]*)\]/g;
    return text.replace(stylesRegex, (match, stylesContent) => {
        if (!exports.CSS_MIGRATION_INLINE_CANDIDATES.some(c => stylesContent.includes(c))) {
            return match;
        }
        const updated = applyStyleTransforms(stylesContent, null);
        return updated !== stylesContent ? match.replace(stylesContent, updated) : match;
    });
}
// ---------------------------------------------------------------------------
// Schematic Rule — visits style files and .ts inline styles
// ---------------------------------------------------------------------------
function migrateCssProperties() {
    return (tree, context) => {
        context.logger.info('  Migrating CSS custom properties and selectors...');
        let styleFileCount = 0;
        let tsFileCount = 0;
        (0, file_visitor_1.visitFiles)(tree, '**/*.{css,scss,sass,less}', filePath => {
            const content = tree.read(filePath);
            if (!content) {
                return;
            }
            const original = content.toString('utf-8');
            if (!exports.CSS_MIGRATION_CANDIDATES.some(c => original.includes(c))) {
                return;
            }
            const updated = applyStyleTransforms(original, filePath);
            if (updated !== original) {
                tree.overwrite(filePath, updated);
                styleFileCount++;
            }
        });
        (0, file_visitor_1.visitFiles)(tree, '**/*.ts', filePath => {
            const content = tree.read(filePath);
            if (!content) {
                return;
            }
            const original = content.toString('utf-8');
            if (!exports.CSS_MIGRATION_INLINE_CANDIDATES.some(c => original.includes(c))) {
                return;
            }
            const updated = transformInlineStyles(original);
            if (updated !== original) {
                tree.overwrite(filePath, updated);
                tsFileCount++;
            }
        });
        context.logger.info(`    Updated ${styleFileCount} style file(s) and ${tsFileCount} inline style(s).`);
    };
}
// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------
function applyStyleTransforms(text, filePath) {
    text = replaceCssProperties(text);
    text = replaceCssSelectors(text);
    text = replaceCssAttributes(text);
    const isScssSass = filePath === null || filePath.endsWith('.scss') || filePath.endsWith('.sass');
    if (isScssSass) {
        text = replaceScssMixins(text);
    }
    return text;
}
function replaceCssProperties(text) {
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
function replaceCssSelectors(text) {
    for (const r of COMPILED_SELECTOR_REGEXES) {
        if (!text.includes(r.old)) {
            continue;
        }
        r.regex.lastIndex = 0;
        text = text.replace(r.regex, r.new);
    }
    return text;
}
function replaceCssAttributes(text) {
    for (const r of COMPILED_ATTRIBUTE_REGEXES) {
        if (!text.includes(r.old)) {
            continue;
        }
        r.regex.lastIndex = 0;
        text = text.replace(r.regex, r.new);
    }
    return text;
}
function replaceScssMixins(text) {
    for (const r of COMPILED_MIXIN_REGEXES) {
        if (!text.includes(r.name)) {
            continue;
        }
        r.regex.lastIndex = 0;
        text = text.replace(r.regex, `/* TODO(v18 migration): '@include ${r.name}(...)' has been removed. */`);
    }
    return text;
}
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=css-migration.js.map