/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HostTree } from '@angular-devkit/schematics';
import { beforeEach, describe, expect, it } from 'vitest';

import { runMigrations } from './test-helpers';
import { applyHtmlTransforms } from '../migrations/template-migration';
import {
  HEADER_CLASS_REPLACEMENTS,
  TEMPLATE_ATTRIBUTE_REPLACEMENTS,
  TEMPLATE_INPUT_REPLACEMENTS,
  TEMPLATE_OUTPUT_REPLACEMENTS,
} from '../replacements/template-replacements';

describe('template migration', () => {
  let tree: HostTree;

  beforeEach(() => {
    tree = new HostTree();
  });

  // -------------------------------------------------------------------------
  // Schematic integration tests
  // -------------------------------------------------------------------------

  describe('output bindings', () => {
    it('should rename clrWizardCurrentPageChanged to clrWizardCurrentPageChange', () => {
      tree.create(
        '/app.component.html',
        `<clr-wizard (clrWizardCurrentPageChanged)="onPageChange($event)"></clr-wizard>`
      );

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('(clrWizardCurrentPageChange)');
      expect(content).not.toContain('clrWizardCurrentPageChanged');
    });

    it('should not rename clrWizardCurrentPageChanged when it appears as plain text, not an (event) binding', () => {
      tree.create('/app.component.html', `<div title="clrWizardCurrentPageChanged is the old event name"></div>`);

      runMigrations(tree);

      expect(tree.readText('/app.component.html')).toContain('clrWizardCurrentPageChanged');
    });
  });

  describe('input bindings', () => {
    it('should rename clrDgItemsTrackBy to clrDgItemsIdentityFn in templates', () => {
      tree.create('/app.component.html', `<clr-dg-items [clrDgItemsTrackBy]="trackFn"></clr-dg-items>`);

      runMigrations(tree);

      expect(tree.readText('/app.component.html')).toContain('clrDgItemsIdentityFn');
    });

    it('should rename clrBadgeColor to clrColor', () => {
      tree.create('/app.component.html', `<clr-badge [clrBadgeColor]="color"></clr-badge>`);

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('[clrColor]');
      expect(content).not.toContain('clrBadgeColor');
    });

    it('should not rename clrBadgeColor when it appears bare without an Angular binding bracket', () => {
      tree.create('/app.component.html', `<!-- clrBadgeColor is the deprecated input -->`);

      runMigrations(tree);

      expect(tree.readText('/app.component.html')).toContain('clrBadgeColor');
    });
  });

  describe('cds-icon attribute migrations', () => {
    it('should replace [attr.shape] with [shape] on cds-icon', () => {
      tree.create('/app.component.html', `<cds-icon [attr.shape]="iconShape" [attr.size]="iconSize"></cds-icon>`);

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('[shape]="iconShape"');
      expect(content).toContain('[size]="iconSize"');
      expect(content).not.toContain('[attr.');
    });

    it('should replace all [attr.*] bindings on cds-icon', () => {
      tree.create(
        '/app.component.html',
        `<cds-icon [attr.shape]="s" [attr.size]="sz" [attr.dir]="d" [attr.flip]="f" [attr.status]="st" [attr.inverse]="inv" [attr.badge]="b" [attr.solid]="sol"></cds-icon>`
      );

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('[shape]="s"');
      expect(content).toContain('[size]="sz"');
      expect(content).toContain('[dir]="d"');
      expect(content).toContain('[flip]="f"');
      expect(content).toContain('[status]="st"');
      expect(content).toContain('[inverse]="inv"');
      expect(content).toContain('[badge]="b"');
      expect(content).toContain('[solid]="sol"');
      expect(content).not.toContain('[attr.');
    });

    it('should replace [attr.*] on multiline cds-icon opening tags', () => {
      tree.create(
        '/app.component.html',
        `<cds-icon
  [attr.shape]="iconShape"
  [attr.size]="iconSize"
></cds-icon>`
      );

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('[shape]="iconShape"');
      expect(content).toContain('[size]="iconSize"');
      expect(content).not.toContain('[attr.');
    });

    it('should replace [attr.*] on self-closing cds-icon tags', () => {
      tree.create('/app.component.html', `<cds-icon [attr.shape]="iconShape" [attr.size]="iconSize" />`);

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('[shape]="iconShape"');
      expect(content).toContain('[size]="iconSize"');
      expect(content).not.toContain('[attr.');
    });

    it('should not replace [attr.size] with [size] on input elements', () => {
      tree.create('/app.component.html', `<input [attr.size]="iconSize" />`);

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('[attr.size]="iconSize"');
      expect(content).not.toContain('[size]="iconSize"');
    });

    it('should not replace [attr.shape] on non-cds-icon elements', () => {
      tree.create('/app.component.html', `<div [attr.shape]="myShape"></div>`);

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('[attr.shape]="myShape"');
      expect(content).not.toContain('[shape]="myShape"');
    });

    it('should not replace [attr.dir] on non-cds-icon elements', () => {
      tree.create('/app.component.html', `<span [attr.dir]="textDir"></span>`);

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('[attr.dir]="textDir"');
      expect(content).not.toContain('[dir]="textDir"');
    });

    it('should not replace [attr.status] on non-cds-icon elements', () => {
      tree.create('/app.component.html', `<button [attr.status]="btnStatus"></button>`);

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('[attr.status]="btnStatus"');
      expect(content).not.toContain('[status]="btnStatus"');
    });

    it('should replace [attr.*] on cds-icon but preserve [attr.*] on sibling elements', () => {
      tree.create(
        '/app.component.html',
        `<input [attr.size]="formSize" /><cds-icon [attr.size]="iconSize" [attr.shape]="iconShape"></cds-icon>`
      );

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('[size]="iconSize"');
      expect(content).toContain('[shape]="iconShape"');
      expect(content).toContain('[attr.size]="formSize"');
    });
  });

  describe('global attribute renames', () => {
    it('should rename clrPopoverAnchor attribute to clrPopoverOrigin in HTML templates', () => {
      tree.create('/app.component.html', `<button clrPopoverAnchor clrPopoverOpenCloseButton>Trigger</button>`);

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('clrPopoverOrigin');
      expect(content).not.toContain('clrPopoverAnchor');
    });

    it('should not rename clrPopoverAnchor inside a longer identifier like clrPopoverAnchorClose', () => {
      tree.create('/app.component.html', `<button clrPopoverAnchorClose>X</button>`);

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('clrPopoverAnchorClose');
      expect(content).not.toContain('clrPopoverOriginClose');
    });
  });

  describe('header class renames', () => {
    it('should replace header-4 through header-7 classes', () => {
      tree.create(
        '/app.component.html',
        `<header class="header-4">
  <div class="header-6 branding"></div>
  <div class="header-7"></div>
</header>`
      );

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('header-3');
      expect(content).toContain('header-1');
      expect(content).toContain('header-2');
      expect(content).not.toContain('header-4');
      expect(content).not.toContain('header-6');
      expect(content).not.toContain('header-7');
    });
  });

  describe('cds-text attribute renames', () => {
    it('should replace cds-text heading with headline', () => {
      tree.create('/app.component.html', `<h1 cds-text*="heading">Title</h1>`);

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('headline');
      expect(content).not.toContain('heading');
    });
  });

  describe('inline templates in TypeScript files', () => {
    it('should migrate inline templates in .ts files', () => {
      const source = `
class AppComponent {}
`.replace(
        'class',
        `${'@'}Component({ template: \`<clr-wizard (clrWizardCurrentPageChanged)="onPage()"></clr-wizard>\` })\nclass`
      );

      tree.create('/app.component.ts', source);
      runMigrations(tree);
      const content = tree.readText('/app.component.ts');

      expect(content).toContain('clrWizardCurrentPageChange');
      expect(content).not.toContain('clrWizardCurrentPageChanged');
    });

    it('should rename clrPopoverAnchor attribute in inline templates', () => {
      const source = `
class PopoverComponent {}
`.replace(
        'class',
        `${'@'}Component({ template: \`<button clrPopoverAnchor clrPopoverOpenCloseButton>Open</button>\` })\nclass`
      );

      tree.create('/popover.component.ts', source);
      runMigrations(tree);
      const content = tree.readText('/popover.component.ts');

      expect(content).toContain('clrPopoverOrigin');
      expect(content).not.toContain('clrPopoverAnchor');
    });
  });

  describe('no-op guard', () => {
    it('should not modify a .html file when none of the migration patterns are present', () => {
      const original = `<div class="my-custom-layout"><span>Hello</span></div>`;
      tree.create('/plain.component.html', original);

      runMigrations(tree);

      expect(tree.readText('/plain.component.html')).toBe(original);
    });
  });

  describe('multi-line template integration', () => {
    it('should migrate all patterns in a realistic multi-line template file', () => {
      tree.create(
        '/wizard.component.html',
        `<div class="container">
  <!-- Wizard -->
  <clr-wizard
    (clrWizardCurrentPageChanged)="onPageChange($event)"
    [clrWizardOpen]="isOpen">
  </clr-wizard>

  <!-- Icon row -->
  <cds-icon
    [attr.shape]="iconShape"
    [attr.size]="iconSize"
    [attr.status]="iconStatus">
  </cds-icon>

  <!-- Native element: must NOT be touched -->
  <input
    [attr.size]="formFieldSize"
    type="text"
  />

  <!-- Header -->
  <header class="header-4 app-header">
    <div class="header-6 nav"></div>
  </header>

  <!-- Badge -->
  <clr-badge [clrBadgeColor]="color">42</clr-badge>
</div>`
      );

      runMigrations(tree);
      const content = tree.readText('/wizard.component.html');

      expect(content).toContain('(clrWizardCurrentPageChange)');
      expect(content).not.toContain('clrWizardCurrentPageChanged');
      expect(content).toContain('[shape]="iconShape"');
      expect(content).toContain('[size]="iconSize"');
      expect(content).toContain('[status]="iconStatus"');
      expect(content).not.toContain('[attr.shape]="iconShape"');
      expect(content).not.toContain('[attr.size]="iconSize"');
      expect(content).not.toContain('[attr.status]="iconStatus"');
      expect(content).toContain('[attr.size]="formFieldSize"');
      expect(content).toContain('header-3');
      expect(content).toContain('header-1');
      expect(content).not.toContain('header-4');
      expect(content).not.toContain('header-6');
      expect(content).toContain('[clrColor]');
      expect(content).not.toContain('clrBadgeColor');
    });

    it('should migrate multiple cds-icon elements across multiple lines without affecting other elements between them', () => {
      tree.create(
        '/icons.component.html',
        `<section>
  <cds-icon
    [attr.shape]="homeIcon"
    [attr.size]="'lg'">
  </cds-icon>

  <span [attr.shape]="spanShape"></span>

  <cds-icon
    [attr.shape]="settingsIcon"
    [attr.flip]="'horizontal'"
    [attr.inverse]="isInverse">
  </cds-icon>

  <input [attr.size]="inputSize" />
</section>`
      );

      runMigrations(tree);
      const content = tree.readText('/icons.component.html');

      expect(content).toContain('[shape]="homeIcon"');
      expect(content).toContain('[shape]="settingsIcon"');
      expect(content).toContain(`[size]="'lg'"`);
      expect(content).toContain(`[flip]="'horizontal'"`);
      expect(content).toContain('[inverse]="isInverse"');
      expect(content).toContain('[attr.shape]="spanShape"');
      expect(content).toContain('[attr.size]="inputSize"');
    });

    it('should migrate a multi-line inline template inside a TypeScript component', () => {
      tree.create(
        '/multi.component.ts',
        `import { Component } from '@angular/core';
import { ClarityIcons } from '@cds/core/icon';

@Component({
  template: \`
    <clr-wizard (clrWizardCurrentPageChanged)="onPage($event)">
    </clr-wizard>
    <cds-icon
      [attr.shape]="myShape"
      [attr.size]="mySize">
    </cds-icon>
    <header class="header-4 branding"></header>
    <input [attr.size]="fieldSize" />
  \`
})
export class MultiComponent {}`
      );

      runMigrations(tree);
      const content = tree.readText('/multi.component.ts');

      expect(content).toContain("from '@clr/angular/icon'");
      expect(content).toContain('clrWizardCurrentPageChange');
      expect(content).not.toContain('clrWizardCurrentPageChanged');
      expect(content).toContain('[shape]="myShape"');
      expect(content).toContain('[size]="mySize"');
      expect(content).not.toContain('[attr.shape]');
      expect(content).not.toContain('[attr.size]="mySize"');
      expect(content).toContain('header-3');
      expect(content).not.toContain('header-4');
      expect(content).toContain('[attr.size]="fieldSize"');
    });

    it('should correctly migrate bindings when they appear on separate lines across many elements', () => {
      tree.create(
        '/mixed.component.html',
        `<ng-container>
  <clr-wizard
    [clrWizardOpen]="isOpen"
    (clrWizardCurrentPageChanged)="onPage($event)"
    (clrWizardOnFinish)="onFinish()">
  </clr-wizard>

  <cds-icon [attr.shape]="s1"></cds-icon>
  <p [attr.shape]="textShape">text</p>
  <cds-icon [attr.shape]="s2" [attr.size]="sz"></cds-icon>

  <footer class="header-7">
    <button clrPopoverAnchor>Open</button>
  </footer>
</ng-container>`
      );

      runMigrations(tree);
      const content = tree.readText('/mixed.component.html');

      expect(content).toContain('(clrWizardCurrentPageChange)');
      expect(content).not.toContain('(clrWizardCurrentPageChanged)');
      expect(content).toContain('[shape]="s1"');
      expect(content).toContain('[shape]="s2"');
      expect(content).toContain('[size]="sz"');
      expect(content).toContain('[attr.shape]="textShape"');
      expect(content).toContain('header-2');
      expect(content).not.toContain('header-7');
      expect(content).toContain('clrPopoverOrigin');
      expect(content).not.toContain('clrPopoverAnchor');
    });
  });

  // -------------------------------------------------------------------------
  // Regex pattern boundary tests — calls production applyHtmlTransforms() directly
  // -------------------------------------------------------------------------

  describe('regex pattern boundaries', () => {
    describe('output binding boundaries', () => {
      for (const rule of TEMPLATE_OUTPUT_REPLACEMENTS) {
        it(`(${rule.old}) matches exactly — extended name is not affected`, () => {
          const input = `<clr-wizard (${rule.old}Extended)="handler()"></clr-wizard>`;
          const output = applyHtmlTransforms(input);
          expect(output).not.toContain(`(${rule.new})`);
          expect(output).toContain(`(${rule.old}Extended)`);
        });
      }
    });

    describe('input binding boundaries', () => {
      for (const rule of TEMPLATE_INPUT_REPLACEMENTS) {
        it(`[${rule.old}Extended] is not affected by the ${rule.old} rule`, () => {
          const input = `<clr-badge [${rule.old}Extended]="value"></clr-badge>`;
          const output = applyHtmlTransforms(input);
          expect(output).not.toContain(`[${rule.new}]`);
          expect(output).toContain(`[${rule.old}Extended]`);
        });
      }
    });

    describe('cds-icon attribute scoping boundaries', () => {
      const cdsIconRules = TEMPLATE_ATTRIBUTE_REPLACEMENTS.filter(r => r.context === 'cds-icon');

      for (const rule of cdsIconRules) {
        it(`${rule.old} is not replaced on a native <input> element`, () => {
          const input = `<input ${rule.old}="value">`;
          expect(applyHtmlTransforms(input)).toBe(input);
        });

        it(`${rule.old} is not replaced on an arbitrary non-cds-icon component`, () => {
          const input = `<clr-other ${rule.old}="value"></clr-other>`;
          expect(applyHtmlTransforms(input)).toBe(input);
        });
      }

      it('leaves <cds-icon> untouched when no old attributes are present', () => {
        const input = `<cds-icon [shape]="already-migrated"></cds-icon>`;
        expect(applyHtmlTransforms(input)).toBe(input);
      });
    });

    describe('global attribute word-boundary boundaries', () => {
      const globalRules = TEMPLATE_ATTRIBUTE_REPLACEMENTS.filter(r => r.context !== 'cds-icon');

      for (const rule of globalRules) {
        it(`'${rule.old}' is not renamed when it is a prefix of a longer attribute name`, () => {
          const input = `<button ${rule.old}Close>label</button>`;
          expect(applyHtmlTransforms(input)).toContain(`${rule.old}Close`);
          expect(applyHtmlTransforms(input)).not.toContain(`${rule.new}Close`);
        });
      }
    });

    describe('header class word-boundary boundaries', () => {
      for (const rule of HEADER_CLASS_REPLACEMENTS) {
        it(`'${rule.old}' is not renamed when followed by a digit (${rule.old}0)`, () => {
          const input = `<header class="${rule.old}0"></header>`;
          expect(applyHtmlTransforms(input)).toContain(`${rule.old}0`);
          expect(applyHtmlTransforms(input)).not.toContain(rule.new);
        });

        it(`'${rule.old}' is not renamed when followed by a letter (${rule.old}x)`, () => {
          const input = `<header class="${rule.old}x"></header>`;
          expect(applyHtmlTransforms(input)).toContain(`${rule.old}x`);
        });
      }
    });
  });
});
