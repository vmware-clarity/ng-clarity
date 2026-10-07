/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { posix } from 'path';

import { addAnimationsProvider } from './animations';
import { generateComponentHtml, generateComponentTs } from './generate-component';
import { normalizeOptions } from './options';
import { DatagridSchema } from './schema';
import { buildDefaultPath, findProject, normalizePath, parseName } from './workspace';

/**
 * Generates a standalone component with a configured `<clr-datagrid>`.
 * Run with: ng generate @clr/angular:datagrid <name> --columns=<field[:type]>,...
 */
export function datagrid(options: DatagridSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const project = findProject(tree, options.project);
    const basePath = options.path !== undefined ? normalizePath(options.path) : buildDefaultPath(project);
    const parsed = parseName(basePath, options.name ?? '');
    const normalized = normalizeOptions({ ...options, name: parsed.name }, options.prefix || project?.prefix || 'app');

    const directory = options.flat ? parsed.path : posix.join(parsed.path, normalized.fileName);
    const tsPath = posix.join(directory, `${normalized.fileName}.ts`);
    const htmlPath = posix.join(directory, `${normalized.fileName}.html`);
    for (const path of [tsPath, htmlPath]) {
      if (tree.exists(path)) {
        throw new SchematicsException(`${path} already exists.`);
      }
    }

    tree.create(tsPath, generateComponentTs(normalized));
    tree.create(htmlPath, generateComponentHtml(normalized));
    context.logger.info(`CREATE ${tsPath}`);
    context.logger.info(`CREATE ${htmlPath}`);

    for (const note of normalized.notes) {
      context.logger.info(note);
    }

    if (normalized.animations) {
      addAnimationsProvider(tree, context, project);
    }

    context.logger.info(
      `Next: add <${normalized.selector}> to a template, and load your rows ` +
        (normalized.mode === 'server' ? `in ${normalized.className}.fetch().` : `into ${normalized.className}.items.`)
    );
    return tree;
  };
}
