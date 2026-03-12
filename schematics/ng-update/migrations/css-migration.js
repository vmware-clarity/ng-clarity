"use strict";
/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateCssProperties = migrateCssProperties;
const css_replacements_1 = require("../replacements/css-replacements");
const file_visitor_1 = require("../utils/file-visitor");
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
            let text = content.toString('utf-8');
            const original = text;
            text = replaceCssProperties(text);
            text = replaceCssSelectors(text);
            text = replaceCssAttributes(text);
            if (text !== original) {
                tree.overwrite(filePath, text);
                styleFileCount++;
            }
        });
        (0, file_visitor_1.visitFiles)(tree, '**/*.ts', filePath => {
            const content = tree.read(filePath);
            if (!content) {
                return;
            }
            let text = content.toString('utf-8');
            const original = text;
            text = migrateInlineStyles(text);
            if (text !== original) {
                tree.overwrite(filePath, text);
                tsFileCount++;
            }
        });
        context.logger.info(`    Updated ${styleFileCount} style file(s) and ${tsFileCount} inline style(s).`);
    };
}
function replaceCssProperties(text) {
    for (const replacement of css_replacements_1.CSS_PROPERTY_REPLACEMENTS) {
        if (replacement.new) {
            text = text.replace(new RegExp(escapeRegExp(replacement.old), 'g'), replacement.new);
        }
        else {
            // Property was removed — comment it out with a migration note
            const regex = new RegExp(`(\\s*)(${escapeRegExp(replacement.old)}\\s*:[^;]*;)`, 'g');
            text = text.replace(regex, `$1/* TODO(v18 migration): '${replacement.old}' has been removed. */ /* $2 */`);
        }
    }
    return text;
}
function replaceCssSelectors(text) {
    for (const replacement of css_replacements_1.CSS_SELECTOR_REPLACEMENTS) {
        text = text.replace(new RegExp(`\\b${escapeRegExp(replacement.old)}\\b`, 'g'), replacement.new);
    }
    return text;
}
function replaceCssAttributes(text) {
    for (const replacement of css_replacements_1.CSS_ATTRIBUTE_REPLACEMENTS) {
        text = text.replace(new RegExp(escapeRegExp(replacement.old), 'g'), replacement.new);
    }
    return text;
}
function migrateInlineStyles(text) {
    // Match styles: [`...`] or styles: ['...'] in @Component decorators
    const stylesRegex = /styles\s*:\s*\[([^\]]*)\]/g;
    return text.replace(stylesRegex, (match, stylesContent) => {
        let content = stylesContent;
        const original = content;
        content = replaceCssProperties(content);
        content = replaceCssSelectors(content);
        content = replaceCssAttributes(content);
        if (content !== original) {
            return match.replace(original, content);
        }
        return match;
    });
}
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=css-migration.js.map