/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HostTree } from '@angular-devkit/schematics';
import { describe, expect, it } from 'vitest';

import { APP_CONFIG, createContext, createWorkspace } from './test-helpers';
import { addAnimationsProvider, insertProvider } from '../animations';
import { findProject } from '../workspace';

const IMPORT = `import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';`;

describe('insertProvider', () => {
  it('adds the provider first and the import after the last package import', () => {
    expect(insertProvider(APP_CONFIG))
      .toBe(`import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
${IMPORT}

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
`);
  });

  it('fills an empty providers array', () => {
    const source = `import { ApplicationConfig } from '@angular/core';\n\nexport const appConfig: ApplicationConfig = {\n  providers: []\n};\n`;
    expect(insertProvider(source)).toBe(
      `import { ApplicationConfig } from '@angular/core';\n${IMPORT}\n\nexport const appConfig: ApplicationConfig = {\n  providers: [provideAnimationsAsync()]\n};\n`
    );
  });

  it('keeps the indentation of the existing entries', () => {
    const source = `export const appConfig = {\n\tproviders: [\n\t\tprovideRouter([]),\n\t],\n};\n`;
    expect(insertProvider(source)).toBe(
      `${IMPORT}\n\nexport const appConfig = {\n\tproviders: [\n\t\tprovideAnimationsAsync(),\n\t\tprovideRouter([]),\n\t],\n};\n`
    );
  });

  it('handles a single-line providers array and a file with only relative imports', () => {
    const source = `import { routes } from './app.routes';\n\nexport const appConfig = { providers: [provideRouter(routes)] };\n`;
    expect(insertProvider(source)).toBe(
      `import { routes } from './app.routes';\n${IMPORT}\n\nexport const appConfig = { providers: [provideAnimationsAsync(), provideRouter(routes)] };\n`
    );
  });

  it('returns undefined without a providers array', () => {
    expect(insertProvider(`export const appConfig = {};\n`)).toBeUndefined();
  });
});

describe('addAnimationsProvider', () => {
  it('patches src/app/app.config.ts of the project', () => {
    const tree = createWorkspace();
    const context = createContext();

    addAnimationsProvider(tree, context, findProject(tree));

    expect(tree.readText('src/app/app.config.ts')).toContain('provideAnimationsAsync(),');
    expect(context.messages).toEqual([
      { level: 'info', message: 'UPDATE src/app/app.config.ts (provideAnimationsAsync())' },
    ]);
  });

  it('finds an app.config.ts elsewhere under the source root', () => {
    const tree = new HostTree();
    tree.create('src/config/app.config.ts', APP_CONFIG);
    const context = createContext();

    addAnimationsProvider(tree, context, undefined);

    expect(tree.readText('src/config/app.config.ts')).toContain('provideAnimationsAsync(),');
  });

  it.each([
    'provideAnimations()',
    'provideAnimationsAsync()',
    "provideAnimationsAsync('noop')",
    'provideNoopAnimations()',
    'importProvidersFrom(BrowserAnimationsModule)',
    'importProvidersFrom(NoopAnimationsModule)',
  ])('leaves a config alone that already has %s', provider => {
    const tree = new HostTree();
    const source = `export const appConfig = { providers: [${provider}] };\n`;
    tree.create('src/app/app.config.ts', source);
    const context = createContext();

    addAnimationsProvider(tree, context, undefined);

    expect(tree.readText('src/app/app.config.ts')).toBe(source);
    expect(context.messages).toEqual([]);
  });

  it('warns when there is no app.config.ts', () => {
    const tree = new HostTree();
    tree.create('src/main.ts', '');
    const context = createContext();

    addAnimationsProvider(tree, context, undefined);

    expect(context.messages).toEqual([
      {
        level: 'warn',
        message: expect.stringMatching(/^Could not find app.config.ts. The datagrid needs an animations provider/),
      },
    ]);
  });

  it('warns when the config has no providers array', () => {
    const tree = new HostTree();
    tree.create('src/app/app.config.ts', 'export const appConfig = {};\n');
    const context = createContext();

    addAnimationsProvider(tree, context, undefined);

    expect(tree.readText('src/app/app.config.ts')).toBe('export const appConfig = {};\n');
    expect(context.messages).toEqual([
      {
        level: 'warn',
        message: expect.stringMatching(/^Could not find a `providers: \[...\]` array in src\/app\/app.config.ts/),
      },
    ]);
  });
});
