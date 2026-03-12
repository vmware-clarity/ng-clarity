/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HostTree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('ng-update v18 migration', () => {
  let runner: SchematicTestRunner;
  let tree: HostTree;

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', collectionPath);
    tree = new HostTree();
  });

  describe('import migrations', () => {
    it('should replace @clr/angular/src/* deep imports with secondary entrypoints', async () => {
      tree.create(
        '/app.ts',
        `import { ClrAccordionModule } from '@clr/angular/src/accordion';
import { ClrStepperModule } from '@clr/angular/src/accordion/stepper';
import { ClrFormsModule } from '@clr/angular/src/forms';`
      );

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/app.ts');

      expect(content).toContain("from '@clr/angular/accordion'");
      expect(content).toContain("from '@clr/angular/stepper'");
      expect(content).toContain("from '@clr/angular/forms'");
      expect(content).not.toContain('/src/');
    });

    it('should move smart popover imports from utils/popover to popover/common', async () => {
      tree.create('/app.ts', `import { ClrSmartOpen } from '@clr/angular/utils/popover';`);

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/app.ts');

      expect(content).toContain("from '@clr/angular/popover/common'");
    });

    it('should move ClrIfOpen from utils to popover/common', async () => {
      tree.create('/app.ts', `import { ClrIfOpen } from '@clr/angular/utils';`);

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/app.ts');

      expect(content).toContain("from '@clr/angular/popover/common'");
    });

    it('should rename FocusService to FormsFocusService', async () => {
      tree.create(
        '/app.ts',
        `import { FocusService } from '@clr/angular/forms';
const svc = new FocusService();`
      );

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/app.ts');

      expect(content).toContain('FormsFocusService');
      expect(content).toContain("from '@clr/angular/forms/common'");
      expect(content).not.toContain('FocusService');
    });

    it('should migrate @cds/core/icon imports to @clr/angular/icon', async () => {
      tree.create('/app.ts', `import { ClarityIcons } from '@cds/core/icon';`);

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/app.ts');

      expect(content).toContain("from '@clr/angular/icon'");
    });

    it('should rename ClrLabel to ClrControlLabel', async () => {
      tree.create(
        '/app.ts',
        `import { ClrLabel } from '@clr/angular/forms';
@Component({ providers: [ClrLabel] })
class MyComp {}`
      );

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/app.ts');

      expect(content).toContain('ClrControlLabel');
      expect(content).not.toContain('ClrLabel');
    });

    it('should rename ClrIconModule to ClrIcon', async () => {
      tree.create(
        '/app.ts',
        `import { ClrIconModule } from '@clr/angular';
@NgModule({ imports: [ClrIconModule] })
class AppModule {}`
      );

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/app.ts');

      expect(content).toContain('ClrIcon');
      expect(content).not.toContain('ClrIconModule');
    });

    it('should rename AccordionPanelModel to CollapsiblePanelModel', async () => {
      tree.create(
        '/app.ts',
        `import { AccordionPanelModel } from '@clr/angular/accordion';
const model: AccordionPanelModel = {};`
      );

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/app.ts');

      expect(content).toContain('CollapsiblePanelModel');
      expect(content).not.toContain('AccordionPanelModel');
    });

    it('should add TODO comment for removed IEKeys symbol', async () => {
      tree.create(
        '/app.ts',
        `import { IEKeys } from '@clr/angular/utils';
if (key === IEKeys.Escape) {}`
      );

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/app.ts');

      expect(content).toContain('TODO');
      expect(content).toContain('removed in @clr/angular v18');
    });

    it('should rename popover services', async () => {
      tree.create(
        '/app.ts',
        `import { ClrPopoverToggleService } from '@clr/angular';
const svc: ClrPopoverToggleService = inject(ClrPopoverToggleService);`
      );

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/app.ts');

      expect(content).toContain('ClrPopoverService');
      expect(content).not.toContain('ClrPopoverToggleService');
    });
  });

  describe('template migrations', () => {
    it('should rename clrWizardCurrentPageChanged to clrWizardCurrentPageChange', async () => {
      tree.create(
        '/app.component.html',
        `<clr-wizard (clrWizardCurrentPageChanged)="onPageChange($event)"></clr-wizard>`
      );

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/app.component.html');

      expect(content).toContain('(clrWizardCurrentPageChange)');
      expect(content).not.toContain('clrWizardCurrentPageChanged');
    });

    it('should rename clrDgItemsTrackBy to clrDgItemsIdentityFn in templates', async () => {
      tree.create('/app.component.html', `<clr-dg-items [clrDgItemsTrackBy]="trackFn"></clr-dg-items>`);

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/app.component.html');

      expect(content).toContain('clrDgItemsIdentityFn');
    });

    it('should replace [attr.shape] with [shape] on cds-icon', async () => {
      tree.create('/app.component.html', `<cds-icon [attr.shape]="iconShape" [attr.size]="iconSize"></cds-icon>`);

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/app.component.html');

      expect(content).toContain('[shape]="iconShape"');
      expect(content).toContain('[size]="iconSize"');
      expect(content).not.toContain('[attr.');
    });

    it('should replace header-4 through header-7 classes', async () => {
      tree.create(
        '/app.component.html',
        `<header class="header-4">
  <div class="header-6 branding"></div>
  <div class="header-7"></div>
</header>`
      );

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/app.component.html');

      expect(content).toContain('header-3');
      expect(content).toContain('header-1');
      expect(content).toContain('header-2');
      expect(content).not.toContain('header-4');
      expect(content).not.toContain('header-6');
      expect(content).not.toContain('header-7');
    });

    it('should replace cds-text heading with headline', async () => {
      tree.create('/app.component.html', `<h1 cds-text*="heading">Title</h1>`);

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/app.component.html');

      expect(content).toContain('headline');
      expect(content).not.toContain('heading');
    });

    it('should rename clrBadgeColor to clrColor', async () => {
      tree.create('/app.component.html', `<clr-badge [clrBadgeColor]="color"></clr-badge>`);

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/app.component.html');

      expect(content).toContain('[clrColor]');
      expect(content).not.toContain('clrBadgeColor');
    });

    it('should migrate inline templates in .ts files', async () => {
      tree.create(
        '/app.component.ts',
        `@Component({
  template: \`<clr-wizard (clrWizardCurrentPageChanged)="onPage()"></clr-wizard>\`
})
class AppComponent {}`
      );

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/app.component.ts');

      expect(content).toContain('clrWizardCurrentPageChange');
      expect(content).not.toContain('clrWizardCurrentPageChanged');
    });
  });

  describe('CSS migrations', () => {
    it('should rename wizard stepnav CSS custom properties', async () => {
      tree.create(
        '/styles.scss',
        `:root {
  --clr-wizard-stepnav-text--active: red;
  --clr-wizard-stepnav-item-border-color--active: blue;
  --clr-wizard-stepnav-link-hover-bg-color: green;
  --clr-wizard-stepnav-link-active-bg-color: yellow;
}`
      );

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/styles.scss');

      expect(content).toContain('--clr-wizard-stepnav-text-selected');
      expect(content).toContain('--clr-wizard-stepnav-item-complete-border-color');
      expect(content).toContain('--clr-wizard-stepnav-hover-bgcolor');
      expect(content).toContain('--clr-wizard-stepnav-active-bgcolor');
    });

    it('should rename accordion CSS custom properties', async () => {
      tree.create(
        '/styles.scss',
        `:root {
  --clr-accordion-active-background-color: #fff;
  --clr-collapsible-panel-active-background-color: #eee;
}`
      );

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/styles.scss');

      expect(content).toContain('--clr-accordion-header-open-background-color');
      expect(content).toContain('--clr-collapsible-panel-header-open-background-color');
    });

    it('should comment out removed CSS custom properties', async () => {
      tree.create(
        '/styles.scss',
        `:root {
  --clr-accordion-step-title-min-width: 200px;
}`
      );

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/styles.scss');

      expect(content).toContain('TODO(v18 migration)');
      expect(content).toContain('has been removed');
    });

    it('should replace header-N selectors in CSS', async () => {
      tree.create(
        '/styles.scss',
        `.header-4 { color: red; }
.header-5 { color: blue; }
.header-6 { color: green; }
.header-7 { color: yellow; }`
      );

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/styles.scss');

      expect(content).toContain('.header-3');
      expect(content).toContain('.header-1');
      expect(content).toContain('.header-2');
    });

    it('should replace cds-text heading attribute selectors in CSS', async () => {
      tree.create('/styles.scss', `[cds-text*="heading"] { font-weight: bold; }`);

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/styles.scss');

      expect(content).toContain('[cds-text*="headline"]');
    });

    it('should migrate inline styles in TypeScript files', async () => {
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

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/app.component.ts');

      expect(content).toContain('--clr-wizard-stepnav-text-selected');
    });

    it('should not modify files without matching patterns', async () => {
      const original = `:root { --custom-prop: red; }`;
      tree.create('/unrelated.scss', original);

      const result = await runner.runSchematic('ng-update', {}, tree);
      const content = result.readContent('/unrelated.scss');

      expect(content).toBe(original);
    });
  });
});
