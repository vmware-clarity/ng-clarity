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
function migrate() {
    return (tree, context) => {
        context.logger.info('');
        context.logger.info('Running @clr/angular v18 migration schematics...');
        context.logger.info('');
        return (0, schematics_1.chain)([(0, import_migration_1.migrateImports)(), (0, template_migration_1.migrateTemplates)(), (0, css_migration_1.migrateCssProperties)()])(tree, context);
    };
}
//# sourceMappingURL=index.js.map