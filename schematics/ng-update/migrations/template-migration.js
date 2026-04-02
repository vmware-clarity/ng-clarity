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
exports.applyHtmlTransforms = applyHtmlTransforms;
const css_replacements_1 = require("../replacements/css-replacements");
const template_replacements_1 = require("../replacements/template-replacements");
const file_visitor_1 = require("../utils/file-visitor");
const regexp_utils_1 = require("../utils/regexp-utils");
// ---------------------------------------------------------------------------
// Pre-compiled regex arrays — built once at module load, not per-file
// ---------------------------------------------------------------------------
const COMPILED_OUTPUT_REGEXES = template_replacements_1.TEMPLATE_OUTPUT_REPLACEMENTS.map(r => ({
    old: r.old,
    new: r.new,
    regex: new RegExp(`\\(${(0, regexp_utils_1.escapeRegExp)(r.old)}\\)`, 'g'),
}));
const COMPILED_INPUT_BOUND_REGEXES = template_replacements_1.TEMPLATE_INPUT_REPLACEMENTS.map(r => ({
    old: r.old,
    new: r.new,
    boundRegex: new RegExp(`\\[${(0, regexp_utils_1.escapeRegExp)(r.old)}\\]`, 'g'),
    bareRegex: new RegExp(`(?<=\\s)${(0, regexp_utils_1.escapeRegExp)(r.old)}(?==)`, 'g'),
}));
// cds-icon [attr.*] replacements: applied only within <cds-icon> opening tags to
// avoid false positives on native elements like <input [attr.size]="x">.
const COMPILED_CDS_ICON_ATTR_ENTRIES = template_replacements_1.TEMPLATE_ATTRIBUTE_REPLACEMENTS.filter(r => r.context === 'cds-icon');
// Non-scoped attribute replacements: applied globally (e.g. clrPopoverAnchor).
// Word boundaries (\b) prevent matching inside longer identifiers such as clrPopoverAnchorClose.
const COMPILED_GLOBAL_ATTR_REGEXES = template_replacements_1.TEMPLATE_ATTRIBUTE_REPLACEMENTS.filter(r => r.context !== 'cds-icon').map(r => ({
    old: r.old,
    new: r.new,
    regex: (0, regexp_utils_1.wordBoundaryRegex)(r.old),
}));
// Quote-aware regex that matches a complete <cds-icon …> or <cds-icon … /> opening tag.
// Handles attribute values that contain > (e.g. [attr.size]="size > 0 ? 'lg' : 'md'").
const CDS_ICON_TAG_RE = /<cds-icon\b(?:[^"'/>]|"[^"]*"|'[^']*')*(?:\/?>)/g;
const COMPILED_HEADER_REGEXES = template_replacements_1.HEADER_CLASS_REPLACEMENTS.map(r => ({
    old: r.old,
    new: r.new,
    regex: (0, regexp_utils_1.wordBoundaryRegex)(r.old),
}));
const COMPILED_CDS_TEXT_REGEXES = css_replacements_1.CSS_ATTRIBUTE_REPLACEMENTS.map(r => ({
    old: r.old,
    new: r.new,
    regex: new RegExp((0, regexp_utils_1.escapeRegExp)(r.old), 'g'),
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
        context.logger.info('  Migrating HTML templates');
        let htmlScanCount = 0;
        let htmlUpdateCount = 0;
        let tsScanCount = 0;
        let tsUpdateCount = 0;
        (0, file_visitor_1.visitFiles)(tree, '**/*.html', filePath => {
            htmlScanCount++;
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
                htmlUpdateCount++;
                context.logger.info(`    UPDATE ${filePath}`);
            }
        });
        (0, file_visitor_1.visitFiles)(tree, '**/*.ts', filePath => {
            tsScanCount++;
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
//# sourceMappingURL=template-migration.js.map