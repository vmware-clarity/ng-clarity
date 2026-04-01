"use strict";
/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrate = migrate;
const schematics_1 = require("@angular-devkit/schematics");
const css_migration_1 = require("./migrations/css-migration");
const import_migration_1 = require("./migrations/import-migration");
const template_migration_1 = require("./migrations/template-migration");
const file_visitor_1 = require("./utils/file-visitor");
/**
 * All candidate strings that may appear in .ts source files.
 * Used as a fast-path pre-check to skip files that need no migration.
 */
const TS_CANDIDATES = [
    ...import_migration_1.IMPORT_MIGRATION_CANDIDATES,
    ...template_migration_1.TEMPLATE_MIGRATION_INLINE_CANDIDATES,
    ...css_migration_1.CSS_MIGRATION_INLINE_CANDIDATES,
];
/**
 * Single-pass migration for TypeScript source files.
 *
 * Reads each .ts file exactly once, applies import, inline-template, and
 * inline-style transforms in sequence, then writes it if changed.
 * This is more efficient than visiting .ts files separately in each migration
 * because each file is read and written at most once.
 */
function migrateTypeScriptFiles() {
    return (tree, context) => {
        context.logger.info('  Migrating TypeScript files (imports, inline templates, inline styles)...');
        let fileCount = 0;
        (0, file_visitor_1.visitFiles)(tree, '**/*.ts', filePath => {
            const content = tree.read(filePath);
            if (!content) {
                return;
            }
            const original = content.toString('utf-8');
            // Fast-path: skip entirely if no candidate string is present anywhere.
            if (!TS_CANDIDATES.some(c => original.includes(c))) {
                return;
            }
            let text = original;
            text = (0, import_migration_1.transformImports)(text);
            text = (0, template_migration_1.transformInlineTemplates)(text);
            text = (0, css_migration_1.transformInlineStyles)(text);
            if (text !== original) {
                tree.overwrite(filePath, text);
                fileCount++;
            }
        });
        context.logger.info(`    Updated ${fileCount} TypeScript file(s).`);
    };
}
function migrate() {
    return (tree, context) => {
        context.logger.info('');
        context.logger.info('Running @clr/angular v18 migration schematics...');
        context.logger.info('');
        return (0, schematics_1.chain)([migrateTypeScriptFiles(), (0, template_migration_1.migrateTemplates)(), (0, css_migration_1.migrateCssProperties)()])(tree, context);
    };
}
//# sourceMappingURL=index.js.map