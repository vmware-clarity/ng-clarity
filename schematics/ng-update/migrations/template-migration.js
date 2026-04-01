"use strict";
/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEMPLATE_MIGRATION_INLINE_CANDIDATES = exports.TEMPLATE_MIGRATION_HTML_CANDIDATES = void 0;
exports.transformInlineTemplates = transformInlineTemplates;
exports.migrateTemplates = migrateTemplates;
const css_replacements_1 = require("../replacements/css-replacements");
const template_replacements_1 = require("../replacements/template-replacements");
const file_visitor_1 = require("../utils/file-visitor");
// ---------------------------------------------------------------------------
// Pre-compiled regex arrays — built once at module load, not per-file
// ---------------------------------------------------------------------------
const COMPILED_OUTPUT_REGEXES = template_replacements_1.TEMPLATE_OUTPUT_REPLACEMENTS.map(r => ({
    old: r.old,
    new: r.new,
    regex: new RegExp(`\\(${escapeRegExp(r.old)}\\)`, 'g'),
}));
const COMPILED_INPUT_BOUND_REGEXES = template_replacements_1.TEMPLATE_INPUT_REPLACEMENTS.map(r => ({
    old: r.old,
    new: r.new,
    boundRegex: new RegExp(`\\[${escapeRegExp(r.old)}\\]`, 'g'),
    bareRegex: new RegExp(`(?<=\\s)${escapeRegExp(r.old)}(?==)`, 'g'),
}));
const COMPILED_ATTR_REGEXES = template_replacements_1.TEMPLATE_ATTRIBUTE_REPLACEMENTS.map(r => ({
    old: r.old,
    new: r.new,
    regex: new RegExp(escapeRegExp(r.old), 'g'),
}));
const COMPILED_HEADER_REGEXES = template_replacements_1.HEADER_CLASS_REPLACEMENTS.map(r => ({
    old: r.old,
    new: r.new,
    regex: new RegExp(`\\b${escapeRegExp(r.old)}\\b`, 'g'),
}));
const COMPILED_CDS_TEXT_REGEXES = css_replacements_1.CSS_ATTRIBUTE_REPLACEMENTS.map(r => ({
    old: r.old,
    new: r.new,
    regex: new RegExp(escapeRegExp(r.old), 'g'),
}));
// ---------------------------------------------------------------------------
// Fast-path candidate strings
// ---------------------------------------------------------------------------
exports.TEMPLATE_MIGRATION_HTML_CANDIDATES = [
    ...template_replacements_1.TEMPLATE_OUTPUT_REPLACEMENTS.map(r => r.old),
    ...template_replacements_1.TEMPLATE_INPUT_REPLACEMENTS.map(r => r.old),
    ...template_replacements_1.TEMPLATE_ATTRIBUTE_REPLACEMENTS.map(r => r.old),
    ...template_replacements_1.HEADER_CLASS_REPLACEMENTS.map(r => r.old),
    ...css_replacements_1.CSS_ATTRIBUTE_REPLACEMENTS.map(r => r.old),
];
exports.TEMPLATE_MIGRATION_INLINE_CANDIDATES = exports.TEMPLATE_MIGRATION_HTML_CANDIDATES;
// ---------------------------------------------------------------------------
// Public pure transforms — used by the unified .ts pass in index.ts
// ---------------------------------------------------------------------------
function transformInlineTemplates(text) {
    const templateRegex = /template\s*:\s*(`[\s\S]*?`|'[\s\S]*?')/g;
    return text.replace(templateRegex, (match, templateContent) => {
        if (!exports.TEMPLATE_MIGRATION_INLINE_CANDIDATES.some(c => templateContent.includes(c))) {
            return match;
        }
        const updated = applyHtmlTransforms(templateContent);
        return updated !== templateContent ? match.replace(templateContent, updated) : match;
    });
}
// ---------------------------------------------------------------------------
// Schematic Rule — visits .html files; .ts inline templates handled in unified pass
// ---------------------------------------------------------------------------
function migrateTemplates() {
    return (tree, context) => {
        context.logger.info('  Migrating HTML templates...');
        let htmlFileCount = 0;
        let tsFileCount = 0;
        (0, file_visitor_1.visitFiles)(tree, '**/*.html', filePath => {
            const content = tree.read(filePath);
            if (!content) {
                return;
            }
            const original = content.toString('utf-8');
            if (!exports.TEMPLATE_MIGRATION_HTML_CANDIDATES.some(c => original.includes(c))) {
                return;
            }
            const updated = applyHtmlTransforms(original);
            if (updated !== original) {
                tree.overwrite(filePath, updated);
                htmlFileCount++;
            }
        });
        (0, file_visitor_1.visitFiles)(tree, '**/*.ts', filePath => {
            const content = tree.read(filePath);
            if (!content) {
                return;
            }
            const original = content.toString('utf-8');
            if (!exports.TEMPLATE_MIGRATION_INLINE_CANDIDATES.some(c => original.includes(c))) {
                return;
            }
            const updated = transformInlineTemplates(original);
            if (updated !== original) {
                tree.overwrite(filePath, updated);
                tsFileCount++;
            }
        });
        context.logger.info(`    Updated ${htmlFileCount} HTML template(s) and ${tsFileCount} inline template(s).`);
    };
}
// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------
function applyHtmlTransforms(text) {
    text = migrateOutputBindings(text);
    text = migrateInputBindings(text);
    text = migrateCdsIconAttributes(text);
    text = migrateHeaderClasses(text);
    text = migrateCdsTextAttributes(text);
    return text;
}
function migrateOutputBindings(text) {
    for (const r of COMPILED_OUTPUT_REGEXES) {
        if (!text.includes(r.old)) {
            continue;
        }
        r.regex.lastIndex = 0;
        text = text.replace(r.regex, `(${r.new})`);
    }
    return text;
}
function migrateInputBindings(text) {
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
function migrateCdsIconAttributes(text) {
    for (const r of COMPILED_ATTR_REGEXES) {
        if (!text.includes(r.old)) {
            continue;
        }
        r.regex.lastIndex = 0;
        text = text.replace(r.regex, r.new);
    }
    return text;
}
function migrateHeaderClasses(text) {
    for (const r of COMPILED_HEADER_REGEXES) {
        if (!text.includes(r.old)) {
            continue;
        }
        r.regex.lastIndex = 0;
        text = text.replace(r.regex, r.new);
    }
    return text;
}
function migrateCdsTextAttributes(text) {
    for (const r of COMPILED_CDS_TEXT_REGEXES) {
        if (!text.includes(r.old)) {
            continue;
        }
        r.regex.lastIndex = 0;
        text = text.replace(r.regex, r.new);
    }
    return text;
}
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=template-migration.js.map