/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { logging } from '@angular-devkit/core';
import { HostTree, SchematicContext } from '@angular-devkit/schematics';
import { beforeEach, describe, expect, it } from 'vitest';

import { migrateCssProperties } from './migrations/css-migration';
import { migrateImports } from './migrations/import-migration';
import { migrateTemplates } from './migrations/template-migration';

function runMigrations(tree: HostTree): HostTree {
  const context = {
    logger: new logging.NullLogger(),
  } as SchematicContext;

  migrateImports()(tree, context);
  migrateTemplates()(tree, context);
  migrateCssProperties()(tree, context);

  return tree;
}

describe('ng-update v18 migration', () => {
  let tree: HostTree;

  beforeEach(() => {
    tree = new HostTree();
  });

  describe('import migrations', () => {
    it('should replace @clr/angular/src/* deep imports with secondary entrypoints', () => {
      tree.create(
        '/app.ts',
        `import { ClrAccordionModule } from '@clr/angular/src/accordion';
import { ClrStepperModule } from '@clr/angular/src/accordion/stepper';
import { ClrFormsModule } from '@clr/angular/src/forms';`
      );

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain("from '@clr/angular/accordion'");
      expect(content).toContain("from '@clr/angular/stepper'");
      expect(content).toContain("from '@clr/angular/forms'");
      expect(content).not.toContain('/src/');
    });

    it('should move smart popover imports from utils/popover to popover/common', () => {
      tree.create('/app.ts', `import { ClrSmartOpen } from '@clr/angular/utils/popover';`);

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain("from '@clr/angular/popover/common'");
    });

    it('should move ClrIfOpen from utils to popover/common', () => {
      tree.create('/app.ts', `import { ClrIfOpen } from '@clr/angular/utils';`);

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain("from '@clr/angular/popover/common'");
    });

    it('should rename FocusService to FormsFocusService', () => {
      tree.create(
        '/app.ts',
        `import { FocusService } from '@clr/angular/forms';
const svc = new FocusService();`
      );

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain('FormsFocusService');
      expect(content).toContain("from '@clr/angular/forms/common'");
      expect(content).not.toMatch(/(?<!Forms)FocusService/);
    });

    it('should migrate @cds/core/icon imports to @clr/angular/icon', () => {
      tree.create('/app.ts', `import { ClarityIcons } from '@cds/core/icon';`);

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain("from '@clr/angular/icon'");
    });

    it('should rename ClrLabel to ClrControlLabel', () => {
      tree.create(
        '/app.ts',
        `import { ClrLabel } from '@clr/angular/forms';
@Component({ providers: [ClrLabel] })
class MyComp {}`
      );

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain('ClrControlLabel');
      expect(content).not.toContain('ClrLabel');
    });

    it('should rename ClrIconModule to ClrIcon', () => {
      tree.create(
        '/app.ts',
        `import { ClrIconModule } from '@clr/angular';
@NgModule({ imports: [ClrIconModule] })
class AppModule {}`
      );

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain('ClrIcon');
      expect(content).not.toContain('ClrIconModule');
    });

    it('should rename AccordionPanelModel to CollapsiblePanelModel', () => {
      tree.create(
        '/app.ts',
        `import { AccordionPanelModel } from '@clr/angular/accordion';
const model: AccordionPanelModel = {};`
      );

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain('CollapsiblePanelModel');
      expect(content).not.toContain('AccordionPanelModel');
    });

    it('should add TODO comment for removed IEKeys symbol', () => {
      tree.create(
        '/app.ts',
        `import { IEKeys } from '@clr/angular/utils';
if (key === IEKeys.Escape) {}`
      );

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain('TODO');
      expect(content).toContain('removed in @clr/angular v18');
    });

    it('should rename popover services', () => {
      tree.create(
        '/app.ts',
        `import { ClrPopoverToggleService } from '@clr/angular';
const svc: ClrPopoverToggleService = inject(ClrPopoverToggleService);`
      );

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain('ClrPopoverService');
      expect(content).not.toContain('ClrPopoverToggleService');
    });
  });

  describe('template migrations', () => {
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

    it('should rename clrDgItemsTrackBy to clrDgItemsIdentityFn in templates', () => {
      tree.create('/app.component.html', `<clr-dg-items [clrDgItemsTrackBy]="trackFn"></clr-dg-items>`);

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('clrDgItemsIdentityFn');
    });

    it('should replace [attr.shape] with [shape] on cds-icon', () => {
      tree.create('/app.component.html', `<cds-icon [attr.shape]="iconShape" [attr.size]="iconSize"></cds-icon>`);

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('[shape]="iconShape"');
      expect(content).toContain('[size]="iconSize"');
      expect(content).not.toContain('[attr.');
    });

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

    it('should replace cds-text heading with headline', () => {
      tree.create('/app.component.html', `<h1 cds-text*="heading">Title</h1>`);

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('headline');
      expect(content).not.toContain('heading');
    });

    it('should rename clrBadgeColor to clrColor', () => {
      tree.create('/app.component.html', `<clr-badge [clrBadgeColor]="color"></clr-badge>`);

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('[clrColor]');
      expect(content).not.toContain('clrBadgeColor');
    });

    it('should migrate inline templates in .ts files', () => {
      tree.create(
        '/app.component.ts',
        `@Component({
  template: \`<clr-wizard (clrWizardCurrentPageChanged)="onPage()"></clr-wizard>\`
})
class AppComponent {}`
      );

      runMigrations(tree);
      const content = tree.readText('/app.component.ts');

      expect(content).toContain('clrWizardCurrentPageChange');
      expect(content).not.toContain('clrWizardCurrentPageChanged');
    });
  });

  describe('CSS migrations', () => {
    it('should rename wizard stepnav CSS custom properties', () => {
      tree.create(
        '/styles.scss',
        `:root {
  --clr-wizard-stepnav-text--active: red;
  --clr-wizard-stepnav-item-border-color--active: blue;
  --clr-wizard-stepnav-link-hover-bg-color: green;
  --clr-wizard-stepnav-link-active-bg-color: yellow;
}`
      );

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('--clr-wizard-stepnav-text-selected');
      expect(content).toContain('--clr-wizard-stepnav-item-complete-border-color');
      expect(content).toContain('--clr-wizard-stepnav-hover-bgcolor');
      expect(content).toContain('--clr-wizard-stepnav-active-bgcolor');
    });

    it('should rename accordion CSS custom properties', () => {
      tree.create(
        '/styles.scss',
        `:root {
  --clr-accordion-active-background-color: #fff;
  --clr-collapsible-panel-active-background-color: #eee;
}`
      );

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('--clr-accordion-header-open-background-color');
      expect(content).toContain('--clr-collapsible-panel-header-open-background-color');
    });

    it('should comment out removed CSS custom properties', () => {
      tree.create(
        '/styles.scss',
        `:root {
  --clr-accordion-step-title-min-width: 200px;
}`
      );

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('TODO(v18 migration)');
      expect(content).toContain('has been removed');
    });

    it('should replace header-N selectors in CSS', () => {
      tree.create(
        '/styles.scss',
        `.header-4 { color: red; }
.header-5 { color: blue; }
.header-6 { color: green; }
.header-7 { color: yellow; }`
      );

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('.header-3');
      expect(content).toContain('.header-1');
      expect(content).toContain('.header-2');
    });

    it('should replace cds-text heading attribute selectors in CSS', () => {
      tree.create('/styles.scss', `[cds-text*="heading"] { font-weight: bold; }`);

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('[cds-text*="headline"]');
    });

    it('should migrate inline styles in TypeScript files', () => {
      tree.create(
        '/app.component.ts',
        `@Component({
  styles: [\`
    :host {
      --clr-wizard-stepnav-text--active: red;
    }
  \`]
})
class AppComponent {}`
      );

      runMigrations(tree);
      const content = tree.readText('/app.component.ts');

      expect(content).toContain('--clr-wizard-stepnav-text-selected');
    });

    it('should not modify files without matching patterns', () => {
      const original = `:root { --custom-prop: red; }`;
      tree.create('/unrelated.scss', original);

      runMigrations(tree);
      const content = tree.readText('/unrelated.scss');

      expect(content).toBe(original);
    });
  });
});
