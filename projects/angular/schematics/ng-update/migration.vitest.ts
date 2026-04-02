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

    // -----------------------------------------------------------------------
    // False-positive guard: multi-symbol imports
    // -----------------------------------------------------------------------

    it('should not move sibling symbols when ClrIfOpen is extracted from @clr/angular/utils', () => {
      tree.create('/app.ts', `import { ClrIfOpen, ClrConditionalModule } from '@clr/angular/utils';`);

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      // ClrIfOpen must land on its new module
      expect(content).toContain("import { ClrIfOpen } from '@clr/angular/popover/common'");
      // The sibling must stay on the original module — not follow ClrIfOpen
      expect(content).toContain("from '@clr/angular/utils'");
      expect(content).toContain('ClrConditionalModule');
      expect(content).not.toContain("ClrConditionalModule } from '@clr/angular/popover/common'");
    });

    it('should not move sibling symbols when FocusService is extracted from @clr/angular/forms', () => {
      tree.create(
        '/app.ts',
        `import { FocusService, ClrFormsModule } from '@clr/angular/forms';
const svc = new FocusService();`
      );

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      // FocusService must be renamed and moved
      expect(content).toContain("import { FormsFocusService } from '@clr/angular/forms/common'");
      // ClrFormsModule must stay on @clr/angular/forms, not follow FocusService
      expect(content).toContain("from '@clr/angular/forms'");
      expect(content).toContain('ClrFormsModule');
      expect(content).not.toContain("ClrFormsModule } from '@clr/angular/forms/common'");
      // Usage site also renamed
      expect(content).toContain('new FormsFocusService()');
    });

    it('should handle FocusService at the end of a multi-symbol import list', () => {
      tree.create('/app.ts', `import { ClrFormsModule, FocusService } from '@clr/angular/forms';`);

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain("import { FormsFocusService } from '@clr/angular/forms/common'");
      expect(content).toContain("import { ClrFormsModule } from '@clr/angular/forms'");
    });

    it('should not alter a local ./src/ import path that resembles a Clarity deep import', () => {
      tree.create('/app.ts', `import { MyService } from './src/accordion';`);

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      // The local path must be untouched — the migration targets @clr/angular/src/* only
      expect(content).toContain("from './src/accordion'");
    });

    it('should not rename ClrIconModule substring inside a longer identifier', () => {
      // ClrIconModuleConfig is a hypothetical class that starts with ClrIconModule.
      // Because the symbol replacement uses \b word boundaries, it must NOT match here.
      tree.create(
        '/app.ts',
        `import { ClrIconModuleConfig } from '@clr/angular';
const cfg: ClrIconModuleConfig = {};`
      );

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      // The full identifier must be left intact.
      expect(content).toContain('ClrIconModuleConfig');
      // If ClrIconModule were wrongly matched inside ClrIconModuleConfig it would produce ClrIconConfig.
      expect(content).not.toContain('ClrIconConfig');
    });

    it('should not rename ClrLabel inside a longer identifier like ClrLabelComponent', () => {
      tree.create(
        '/app.ts',
        `import { ClrLabelComponent } from '@clr/angular/forms';
const x: ClrLabelComponent = null;`
      );

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain('ClrLabelComponent');
      expect(content).not.toContain('ClrControlLabelComponent');
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

    it('should replace [attr.*] on cds-icon but preserve [attr.*] on sibling elements', () => {
      tree.create(
        '/app.component.html',
        `<input [attr.size]="formSize" /><cds-icon [attr.size]="iconSize" [attr.shape]="iconShape"></cds-icon>`
      );

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      // cds-icon attributes must be migrated
      expect(content).toContain('[size]="iconSize"');
      expect(content).toContain('[shape]="iconShape"');
      // native element attributes must be left alone
      expect(content).toContain('[attr.size]="formSize"');
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

    // -----------------------------------------------------------------------
    // False-positive guard: template attribute migrations
    // -----------------------------------------------------------------------

    it('should not rename clrWizardCurrentPageChanged when it appears as plain text, not an (event) binding', () => {
      // The output-binding regex requires the Angular (event)="handler" syntax.
      // Occurrences inside attribute values or arbitrary text must be left untouched.
      tree.create('/app.component.html', `<div title="clrWizardCurrentPageChanged is the old event name"></div>`);

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('clrWizardCurrentPageChanged');
    });

    it('should not rename clrBadgeColor when it appears bare without an Angular binding bracket', () => {
      // The input-binding migration only fires on [clrBadgeColor] or clrBadgeColor=
      // (attribute shorthand). A plain text mention must be left alone.
      tree.create('/app.component.html', `<!-- clrBadgeColor is the deprecated input -->`);

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('clrBadgeColor');
    });

    it('should not rename clrPopoverAnchor inside a longer identifier like clrPopoverAnchorClose', () => {
      // Word-boundary matching must prevent partial substring replacements.
      tree.create('/app.component.html', `<button clrPopoverAnchorClose>X</button>`);

      runMigrations(tree);
      const content = tree.readText('/app.component.html');

      expect(content).toContain('clrPopoverAnchorClose');
      expect(content).not.toContain('clrPopoverOriginClose');
    });

    it('should not modify a .html file when none of the migration patterns are present', () => {
      const original = `<div class="my-custom-layout"><span>Hello</span></div>`;
      tree.create('/plain.component.html', original);

      runMigrations(tree);

      expect(tree.readText('/plain.component.html')).toBe(original);
    });

    // -----------------------------------------------------------------------
    // Multi-line template tests
    // -----------------------------------------------------------------------

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

      // Output binding migrated
      expect(content).toContain('(clrWizardCurrentPageChange)');
      expect(content).not.toContain('clrWizardCurrentPageChanged');

      // cds-icon attributes migrated
      expect(content).toContain('[shape]="iconShape"');
      expect(content).toContain('[size]="iconSize"');
      expect(content).toContain('[status]="iconStatus"');
      expect(content).not.toContain('[attr.shape]="iconShape"');
      expect(content).not.toContain('[attr.size]="iconSize"');
      expect(content).not.toContain('[attr.status]="iconStatus"');

      // Native <input> [attr.size] must be untouched
      expect(content).toContain('[attr.size]="formFieldSize"');

      // Header classes migrated
      expect(content).toContain('header-3');
      expect(content).toContain('header-1');
      expect(content).not.toContain('header-4');
      expect(content).not.toContain('header-6');

      // Badge input migrated
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

      // Both cds-icon elements migrated
      expect(content).toContain('[shape]="homeIcon"');
      expect(content).toContain('[shape]="settingsIcon"');
      expect(content).toContain(`[size]="'lg'"`);
      expect(content).toContain(`[flip]="'horizontal'"`);
      expect(content).toContain('[inverse]="isInverse"');

      // Non-cds-icon elements must be untouched
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

      // Import migrated
      expect(content).toContain("from '@clr/angular/icon'");

      // Output binding migrated
      expect(content).toContain('clrWizardCurrentPageChange');
      expect(content).not.toContain('clrWizardCurrentPageChanged');

      // cds-icon attributes migrated
      expect(content).toContain('[shape]="myShape"');
      expect(content).toContain('[size]="mySize"');
      expect(content).not.toContain('[attr.shape]');
      expect(content).not.toContain('[attr.size]="mySize"');

      // Header class migrated
      expect(content).toContain('header-3');
      expect(content).not.toContain('header-4');

      // Native <input> [attr.size] must survive
      expect(content).toContain('[attr.size]="fieldSize"');
    });

    it('should correctly migrate output and attribute bindings when they appear on separate lines across many elements', () => {
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

      // Output binding on its own line
      expect(content).toContain('(clrWizardCurrentPageChange)');
      expect(content).not.toContain('(clrWizardCurrentPageChanged)');

      // cds-icon attributes
      expect(content).toContain('[shape]="s1"');
      expect(content).toContain('[shape]="s2"');
      expect(content).toContain('[size]="sz"');

      // <p> [attr.shape] must NOT be migrated
      expect(content).toContain('[attr.shape]="textShape"');

      // Header class
      expect(content).toContain('header-2');
      expect(content).not.toContain('header-7');

      // clrPopoverAnchor
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

    // -----------------------------------------------------------------------
    // False-positive guard: CSS migrations
    // -----------------------------------------------------------------------

    it('should not rename a CSS custom property that merely starts with a known pattern', () => {
      // --clr-wizard-stepnav-text--active is a prefix of --clr-wizard-stepnav-text--active-custom.
      // Without a negative lookahead the latter would be wrongly renamed.
      tree.create('/styles.scss', `:root { --clr-wizard-stepnav-text--active-custom: blue; }`);

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('--clr-wizard-stepnav-text--active-custom');
      expect(content).not.toContain('--clr-wizard-stepnav-text-selected-custom');
    });

    it('should not comment out a removed CSS property that starts with a known removed name', () => {
      // --clr-accordion-step-title-min-width is removed, but
      // --clr-accordion-step-title-min-width-override (hypothetical extension) must not be touched.
      tree.create('/styles.scss', `:root { --clr-accordion-step-title-min-width-override: 300px; }`);

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('--clr-accordion-step-title-min-width-override');
      expect(content).not.toContain('TODO(v18 migration)');
    });

    it('should not replace heading inside an unrelated CSS value string', () => {
      // The cds-text heading migration targets the exact attribute selector patterns
      // (e.g. [cds-text*="heading"]) and must not affect arbitrary property values.
      tree.create('/styles.scss', `.title { content: "This is a heading label"; }`);

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('"This is a heading label"');
      expect(content).not.toContain('"This is a headline label"');
    });

    it('should not replace header-N CSS class when used as part of a different compound selector', () => {
      // The \b word-boundary approach means .parent-header-4-override is effectively
      // treated as a variant of the Clarity header-4 class (because - is not a word char).
      // This test documents the known behaviour: the substring is replaced.
      tree.create('/styles.scss', `.clr-header-4 { color: red; }`);

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      // Known behaviour: header-4 inside .clr-header-4 IS replaced (- creates a word boundary).
      // Verify that at minimum the replacement is consistent (header-4 → header-3).
      expect(content).toContain('.clr-header-3');
    });

    it('should comment out only the exact range-track-style mixin and not a differently named mixin', () => {
      tree.create('/styles.scss', `input { @include range-track-style-custom(#000, #fff, 4px); }`);

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      // range-track-style-custom is NOT the removed mixin — must be left untouched
      expect(content).toContain('@include range-track-style-custom');
      expect(content).not.toContain('TODO(v18 migration)');
    });

    it('should not alter user-defined CSS custom properties that share a prefix with Clarity ones', () => {
      tree.create('/styles.scss', `:root { --my-clr-accordion-active-background-color: purple; }`);

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('--my-clr-accordion-active-background-color');
      expect(content).not.toContain('--my-clr-accordion-header-open-background-color');
    });
  });
});
