/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { migrateCssProperties } from './migrations/css-migration';
import { migrateImports } from './migrations/import-migration';
import { migrateTemplates } from './migrations/template-migration';

export function migrate(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('');
    context.logger.info('Running @clr/angular v18 migration schematics...');
    context.logger.info('');

    return chain([migrateImports(), migrateTemplates(), migrateCssProperties()])(tree, context);
  };
}
