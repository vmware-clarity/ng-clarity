/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { logging } from '@angular-devkit/core';
import { HostTree, SchematicContext } from '@angular-devkit/schematics';
import { beforeEach, describe, expect, it } from 'vitest';

import { migrateCssProperties, transformInlineStyles } from './migrations/css-migration';
import { migrateImports, transformImports } from './migrations/import-migration';
import { migrateTemplates, transformInlineTemplates } from './migrations/template-migration';

function runMigrations(tree: HostTree): HostTree {
  const context = {
    logger: new logging.NullLogger(),
  } as SchematicContext;

  migrateImports()(tree, context);
  migrateTemplates()(tree, context);
  migrateCssProperties()(tree, context);

  return tree;
}

/**
 * Simulates the unified single-pass TypeScript migration from index.ts
 * without needing to invoke the full schematic runner.
 */
function applyTsTransforms(text: string): string {
  text = transformImports(text);
  text = transformInlineTemplates(text);
  text = transformInlineStyles(text);
  return text;
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
const x = ClrLabel;
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
const imports = [ClrIconModule];
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

    it('should rename ClrPopoverAnchor to ClrPopoverOrigin', () => {
      tree.create(
        '/app.ts',
        `import { ClrPopoverAnchor } from '@clr/angular/popover/common';
const anchor: ClrPopoverAnchor = new ClrPopoverAnchor();`
      );

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain('ClrPopoverOrigin');
      expect(content).not.toContain('ClrPopoverAnchor');
    });

    it('should rename POPOVER_HOST_ANCHOR to POPOVER_HOST_ORIGIN', () => {
      tree.create(
        '/app.ts',
        `import { POPOVER_HOST_ANCHOR } from '@clr/angular/popover/common';
providers: [{ provide: POPOVER_HOST_ANCHOR, useExisting: ElementRef }]`
      );

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain('POPOVER_HOST_ORIGIN');
      expect(content).not.toContain('POPOVER_HOST_ANCHOR');
    });

    it('should rename focusAnchor to focusOrigin', () => {
      tree.create(
        '/app.ts',
        `import { ClrPopoverService } from '@clr/angular/popover/common';
service.focusAnchor();`
      );

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain('focusOrigin');
      expect(content).not.toContain('focusAnchor');
    });

    it('should rename getAnchorPosition to getOriginPosition', () => {
      tree.create(
        '/app.ts',
        `import { ClrPopoverService, getAnchorPosition } from '@clr/angular/popover/common';
const pos = getAnchorPosition(key);`
      );

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain('getOriginPosition');
      expect(content).not.toContain('getAnchorPosition');
    });

    it('should rename Ç-prefixed popover symbols', () => {
      tree.create(
        '/app.ts',
        `import { ÇlrClrPopoverModuleNext, ÇlrClrPopoverCloseButton, ÇlrClrPopoverOpenCloseButton } from '@clr/angular/popover/common';
const imports = [ÇlrClrPopoverModuleNext];`
      );

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain('ClrPopoverModuleNext');
      expect(content).toContain('ClrPopoverCloseButton');
      expect(content).toContain('ClrPopoverOpenCloseButton');
      expect(content).not.toContain('ÇlrClrPopoverModuleNext');
      expect(content).not.toContain('ÇlrClrPopoverCloseButton');
      expect(content).not.toContain('ÇlrClrPopoverOpenCloseButton');
    });

    it('should rename Ç-prefixed accordion/stepper symbols', () => {
      tree.create(
        '/app.ts',
        `import { ÇlrAccordionWillyWonka, ÇlrAccordionOompaLoompa, ÇlrStepperWillyWonka, ÇlrStepperOompaLoompa } from '@clr/angular';
const a = ÇlrAccordionWillyWonka;`
      );

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain('AccordionWillyWonka');
      expect(content).toContain('AccordionOompaLoompa');
      expect(content).toContain('StepperWillyWonka');
      expect(content).toContain('StepperOompaLoompa');
      expect(content).not.toContain('ÇlrAccordionWillyWonka');
      expect(content).not.toContain('ÇlrStepperWillyWonka');
    });

    it('should rename Ç-prefixed datagrid symbols', () => {
      tree.create(
        '/app.ts',
        `import { ÇlrDatagridVirtualScrollDirective, ÇlrDatagridWillyWonka, ÇlrWrappedCell, ÇlrDatagridDetailRegisterer } from '@clr/angular/data';
const d = ÇlrDatagridWillyWonka;`
      );

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain('ClrDatagridVirtualScrollDirective');
      expect(content).toContain('DatagridWillyWonka');
      expect(content).toContain('WrappedCell');
      expect(content).toContain('DatagridDetailRegisterer');
      expect(content).not.toContain('ÇlrDatagridVirtualScrollDirective');
      expect(content).not.toContain('ÇlrDatagridWillyWonka');
      expect(content).not.toContain('ÇlrWrappedCell');
      expect(content).not.toContain('ÇlrDatagridDetailRegisterer');
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

    it('should rename clrPopoverAnchor attribute to clrPopoverOrigin in HTML templates', () => {
      tree.create('/app.component.html', `<button clrPopoverAnchor clrPopoverOpenCloseButton>Trigger</button>`);

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('clrPopoverOrigin');
      expect(content).not.toContain('clrPopoverAnchor');
    });

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

    it('should comment out removed range-track-style SCSS mixin', () => {
      tree.create(
        '/styles.scss',
        `input[type='range'] {
  @include range-track-style(#000, #fff, 4px);
}`
      );

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('TODO(v18 migration)');
      expect(content).toContain('range-track-style');
      // The mixin call must be inside a comment, not executable
      expect(content).not.toMatch(/^\s*@include range-track-style/m);
    });

    it('should migrate inline styles in TypeScript files', () => {
      const source = `
class AppComponent {}
`.replace(
        'class',
        `${'@'}Component({ styles: [\`
    :host { --clr-wizard-stepnav-text--active: red; }
  \`] })\nclass`
      );

      tree.create('/app.component.ts', source);

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

    it('should not modify .ts files that contain no Clarity-related content (fast-path)', () => {
      const original = `export function helper() { return 42; }`;

      // Test via the pure transform directly (no schematics overhead needed)
      const result = applyTsTransforms(original);

      expect(result).toBe(original);
    });
  });
});
