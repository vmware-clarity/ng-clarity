"use strict";
/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = createContext;
exports.runMigrations = runMigrations;
exports.applyTsTransforms = applyTsTransforms;
const core_1 = require("@angular-devkit/core");
const css_migration_1 = require("../migrations/css-migration");
const import_migration_1 = require("../migrations/import-migration");
const template_migration_1 = require("../migrations/template-migration");
function createContext() {
    return { logger: new core_1.logging.NullLogger() };
}
/** Runs all three migration phases against an in-memory tree (mirrors index.ts). */
function runMigrations(tree) {
    const context = createContext();
    (0, import_migration_1.migrateImports)()(tree, context);
    (0, template_migration_1.migrateTemplates)()(tree, context);
    (0, css_migration_1.migrateCssProperties)()(tree, context);
    return tree;
}
/** Applies all pure TypeScript transforms in sequence (mirrors the unified pass in index.ts). */
function applyTsTransforms(text) {
    text = (0, import_migration_1.transformImports)(text);
    text = (0, template_migration_1.transformInlineTemplates)(text);
    text = (0, css_migration_1.transformInlineStyles)(text);
    return text;
}
//# sourceMappingURL=test-helpers.js.map