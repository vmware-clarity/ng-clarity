"use strict";
/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateTemplates = migrateTemplates;
const css_replacements_1 = require("../replacements/css-replacements");
const template_replacements_1 = require("../replacements/template-replacements");
const file_visitor_1 = require("../utils/file-visitor");
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
        (0, file_visitor_1.visitFiles)(tree, '**/*.ts', filePath => {
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
function migrateOutputBindings(text) {
    for (const replacement of template_replacements_1.TEMPLATE_OUTPUT_REPLACEMENTS) {
        // Match (outputName)="..." format
        text = text.replace(new RegExp(`\\(${escapeRegExp(replacement.old)}\\)`, 'g'), `(${replacement.new})`);
    }
    return text;
}
function migrateInputBindings(text) {
    for (const replacement of template_replacements_1.TEMPLATE_INPUT_REPLACEMENTS) {
        // Match [inputName]="..." and inputName="..." formats
        text = text.replace(new RegExp(`\\[${escapeRegExp(replacement.old)}\\]`, 'g'), `[${replacement.new}]`);
        text = text.replace(new RegExp(`(?<=\\s)${escapeRegExp(replacement.old)}(?==)`, 'g'), replacement.new);
    }
    return text;
}
function migrateCdsIconAttributes(text) {
    for (const replacement of template_replacements_1.TEMPLATE_ATTRIBUTE_REPLACEMENTS) {
        text = text.replace(new RegExp(escapeRegExp(replacement.old), 'g'), replacement.new);
    }
    return text;
}
function migrateHeaderClasses(text) {
    for (const replacement of template_replacements_1.HEADER_CLASS_REPLACEMENTS) {
        // Match class="...header-N..." — only replace the specific header class
        text = text.replace(new RegExp(`\\b${escapeRegExp(replacement.old)}\\b`, 'g'), replacement.new);
    }
    return text;
}
function migrateCdsTextAttributes(text) {
    for (const replacement of css_replacements_1.CSS_ATTRIBUTE_REPLACEMENTS) {
        text = text.replace(new RegExp(escapeRegExp(replacement.old), 'g'), replacement.new);
    }
    return text;
}
function migrateInlineTemplates(text) {
    // Match template: `...` or template: '...' in @Component decorators
    const templateRegex = /template\s*:\s*(`[\s\S]*?`|'[\s\S]*?')/g;
    return text.replace(templateRegex, (match, templateContent) => {
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
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=template-migration.js.map