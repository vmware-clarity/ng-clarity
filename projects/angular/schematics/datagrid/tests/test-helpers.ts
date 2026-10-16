/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { strings } from '@angular-devkit/core';
import { HostTree, SchematicContext } from '@angular-devkit/schematics';

import { datagrid } from '../index';
import { DatagridSchema } from '../schema';

export interface RecordingContext extends SchematicContext {
  messages: { level: 'info' | 'warn' | 'error'; message: string }[];
}

/** A schematic context whose logger records every message. */
export function createContext(): RecordingContext {
  const messages: RecordingContext['messages'] = [];
  const record = (level: 'info' | 'warn' | 'error') => (message: string) => void messages.push({ level, message });
  return {
    messages,
    logger: { info: record('info'), warn: record('warn'), error: record('error'), debug: () => undefined },
  } as unknown as RecordingContext;
}

export const APP_CONFIG = `import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
`;

/** An in-memory workspace with one application project (`demo`, prefix `demo`) and a default app.config.ts. */
export function createWorkspace(): HostTree {
  const tree = new HostTree();
  tree.create(
    'angular.json',
    JSON.stringify({
      version: 1,
      projects: {
        'shared-lib': {
          projectType: 'library',
          root: 'projects/shared-lib',
          sourceRoot: 'projects/shared-lib/src',
          prefix: 'lib',
        },
        demo: { projectType: 'application', root: '', sourceRoot: 'src', prefix: 'demo' },
      },
    })
  );
  tree.create('src/app/app.config.ts', APP_CONFIG);
  return tree;
}

/** Runs the schematic and returns the tree, the generated files and the logged messages. */
export function run(options: Partial<DatagridSchema>, tree: HostTree = createWorkspace()) {
  const context = createContext();
  datagrid({ name: 'users-list', columns: 'name,age:number', ...options })(tree, context);

  const fileName = strings.dasherize((options.name ?? 'users-list').split('/').pop() ?? '');
  const dir = options.flat ? 'src/app' : `src/app/${fileName}`;
  const base = `${dir}/${fileName}`;
  return {
    tree,
    context,
    ts: tree.exists(`${base}.ts`) ? tree.readText(`${base}.ts`) : '',
    html: tree.exists(`${base}.html`) ? tree.readText(`${base}.html`) : '',
  };
}
