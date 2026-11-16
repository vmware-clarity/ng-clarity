/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HostTree } from '@angular-devkit/schematics';
import { describe, expect, it } from 'vitest';

import { createContext } from './test-helpers';
import { migrateIcons, renameCdsIconTag, replaceClrIconModule } from '../v19/icon-migration';

describe('v19 icon migration', () => {
  describe('renameCdsIconTag', () => {
    it('renames opening, closing and self-closing tags', () => {
      expect(renameCdsIconTag(`<cds-icon shape="user"></cds-icon><cds-icon [shape]="s" />`)).toBe(
        `<clr-icon shape="user"></clr-icon><clr-icon [shape]="s" />`
      );
    });

    it('renames multiline tags', () => {
      expect(renameCdsIconTag(`<cds-icon\n  shape="user"\n></cds-icon>`)).toBe(
        `<clr-icon\n  shape="user"\n></clr-icon>`
      );
    });

    it('renames HTML-escaped tags in code samples', () => {
      expect(renameCdsIconTag(`&lt;cds-icon shape="user"&gt;&lt;/cds-icon&gt;`)).toBe(
        `&lt;clr-icon shape="user"&gt;&lt;/clr-icon&gt;`
      );
    });

    it('renames CSS selectors', () => {
      expect(renameCdsIconTag(`.btn cds-icon, cds-icon.is-error, a > cds-icon[shape='x'] {}`)).toBe(
        `.btn clr-icon, clr-icon.is-error, a > clr-icon[shape='x'] {}`
      );
    });

    it('renames DOM queries', () => {
      expect(renameCdsIconTag(`el.querySelector('cds-icon'); By.css("button cds-icon");`)).toBe(
        `el.querySelector('clr-icon'); By.css("button clr-icon");`
      );
    });

    it('leaves longer names alone', () => {
      const text = `.cds-icon-item {} #cds-icon {} --cds-icon-size: 1; <app-cds-icon></app-cds-icon> import './cds-icon.ts';`;
      expect(renameCdsIconTag(text)).toBe(text);
    });
  });

  describe('replaceClrIconModule', () => {
    it('renames ClrIconModule to ClrIcon', () => {
      expect(
        replaceClrIconModule(`import { ClrIconModule } from '@clr/angular';\n@NgModule({ imports: [ClrIconModule] })`)
      ).toBe(`import { ClrIcon } from '@clr/angular';\n@NgModule({ imports: [ClrIcon] })`);
    });

    it('renames ClrIconModule imported from @clr/angular/icon', () => {
      expect(replaceClrIconModule(`import { ClrIconModule } from "@clr/angular/icon";\nexports: ClrIconModule`)).toBe(
        `import { ClrIcon } from "@clr/angular/icon";\nexports: ClrIcon`
      );
    });

    it('drops ClrIconModule where ClrIcon is already listed', () => {
      expect(
        replaceClrIconModule(
          `import { ClrAlertModule, ClrIcon, ClrIconModule } from '@clr/angular';\nimports: [ClrIcon, ClrIconModule, ClrAlertModule]`
        )
      ).toBe(`import { ClrAlertModule, ClrIcon } from '@clr/angular';\nimports: [ClrIcon, ClrAlertModule]`);
    });

    it('drops an import statement left empty', () => {
      expect(
        replaceClrIconModule(
          `import { ClrIcon } from '@clr/angular/icon';\nimport { ClrIconModule } from '@clr/angular';\nimports: [ClrIconModule]`
        )
      ).toBe(`import { ClrIcon } from '@clr/angular/icon';\nimports: [ClrIcon]`);
    });

    it('drops ClrIconModule from multiline lists', () => {
      expect(replaceClrIconModule(`import {\n  ClrIcon,\n  ClrIconModule,\n} from '@clr/angular';`)).toBe(
        `import {\n  ClrIcon,\n} from '@clr/angular';`
      );
    });

    it('leaves files that do not import ClrIconModule from Clarity alone', () => {
      const text = `import { ClrIconModule } from './my-icons';\nimports: [ClrIconModule]`;
      expect(replaceClrIconModule(text)).toBe(text);
    });

    it('leaves longer identifiers alone', () => {
      expect(
        replaceClrIconModule(`import { ClrIconModule } from '@clr/angular';\nconst c: ClrIconModuleConfig = {};`)
      ).toBe(`import { ClrIcon } from '@clr/angular';\nconst c: ClrIconModuleConfig = {};`);
    });
  });

  describe('migrateIcons', () => {
    it('updates templates, styles and TypeScript files', () => {
      const tree = new HostTree();
      tree.create('/src/app.component.html', `<cds-icon shape="home"></cds-icon>`);
      tree.create('/src/app.component.scss', `cds-icon { color: red; }`);
      tree.create(
        '/src/app.component.ts',
        `import { ClrIconModule } from '@clr/angular';\n@Component({ imports: [ClrIconModule], template: '<cds-icon></cds-icon>' })`
      );
      tree.create('/node_modules/lib/index.html', `<cds-icon></cds-icon>`);

      migrateIcons()(tree, createContext());

      expect(tree.readText('/src/app.component.html')).toBe(`<clr-icon shape="home"></clr-icon>`);
      expect(tree.readText('/src/app.component.scss')).toBe(`clr-icon { color: red; }`);
      expect(tree.readText('/src/app.component.ts')).toBe(
        `import { ClrIcon } from '@clr/angular';\n@Component({ imports: [ClrIcon], template: '<clr-icon></clr-icon>' })`
      );
      expect(tree.readText('/node_modules/lib/index.html')).toBe(`<cds-icon></cds-icon>`);
    });
  });
});
