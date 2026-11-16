/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { migrateIcons } from './icon-migration';

export function migrate(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('');
    context.logger.info('Running @clr/angular v19 migration...');
    context.logger.info('');

    return migrateIcons()(tree, context);
  };
}
