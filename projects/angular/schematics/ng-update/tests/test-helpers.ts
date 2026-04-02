/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { logging } from '@angular-devkit/core';
import { HostTree, SchematicContext } from '@angular-devkit/schematics';

import { migrateCssProperties, transformInlineStyles } from '../migrations/css-migration';
import { migrateImports, transformImports } from '../migrations/import-migration';
import { migrateTemplates, transformInlineTemplates } from '../migrations/template-migration';

export function createContext(): SchematicContext {
  return { logger: new logging.NullLogger() } as unknown as SchematicContext;
}

/** Runs all three migration phases against an in-memory tree (mirrors index.ts). */
export function runMigrations(tree: HostTree): HostTree {
  const context = createContext();
  migrateImports()(tree, context);
  migrateTemplates()(tree, context);
  migrateCssProperties()(tree, context);
  return tree;
}

/** Applies all pure TypeScript transforms in sequence (mirrors the unified pass in index.ts). */
export function applyTsTransforms(text: string): string {
  text = transformImports(text);
  text = transformInlineTemplates(text);
  text = transformInlineStyles(text);
  return text;
}
