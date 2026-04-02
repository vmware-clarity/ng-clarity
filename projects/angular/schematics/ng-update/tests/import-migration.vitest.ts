/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HostTree } from '@angular-devkit/schematics';
import { beforeEach, describe, expect, it } from 'vitest';

import { runMigrations } from './test-helpers';
import { transformImports } from '../migrations/import-migration';
import { IMPORT_REPLACEMENTS } from '../replacements/import-replacements';
import { SYMBOL_REPLACEMENTS } from '../replacements/symbol-replacements';

describe('import migration', () => {
  let tree: HostTree;

  beforeEach(() => {
    tree = new HostTree();
  });

  // -------------------------------------------------------------------------
  // Schematic integration tests
  // -------------------------------------------------------------------------

  describe('module path replacements', () => {
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

      expect(tree.readText('/app.ts')).toContain("from '@clr/angular/popover/common'");
    });

    it('should move ClrIfOpen from utils to popover/common', () => {
      tree.create('/app.ts', `import { ClrIfOpen } from '@clr/angular/utils';`);

      runMigrations(tree);

      expect(tree.readText('/app.ts')).toContain("from '@clr/angular/popover/common'");
    });

    it('should migrate @cds/core/icon imports to @clr/angular/icon', () => {
      tree.create('/app.ts', `import { ClarityIcons } from '@cds/core/icon';`);

      runMigrations(tree);

      expect(tree.readText('/app.ts')).toContain("from '@clr/angular/icon'");
    });

    it('should not alter a local ./src/ import path that resembles a Clarity deep import', () => {
      tree.create('/app.ts', `import { MyService } from './src/accordion';`);

      runMigrations(tree);

      expect(tree.readText('/app.ts')).toContain("from './src/accordion'");
    });
  });

  describe('symbol renames', () => {
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

  describe('removed symbols', () => {
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
  });

  describe('sibling symbol preservation (false-positive guards)', () => {
    it('should not move sibling symbols when ClrIfOpen is extracted from @clr/angular/utils', () => {
      tree.create('/app.ts', `import { ClrIfOpen, ClrConditionalModule } from '@clr/angular/utils';`);

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain("import { ClrIfOpen } from '@clr/angular/popover/common'");
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

      expect(content).toContain("import { FormsFocusService } from '@clr/angular/forms/common'");
      expect(content).toContain("from '@clr/angular/forms'");
      expect(content).toContain('ClrFormsModule');
      expect(content).not.toContain("ClrFormsModule } from '@clr/angular/forms/common'");
      expect(content).toContain('new FormsFocusService()');
    });

    it('should handle FocusService at the end of a multi-symbol import list', () => {
      tree.create('/app.ts', `import { ClrFormsModule, FocusService } from '@clr/angular/forms';`);

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain("import { FormsFocusService } from '@clr/angular/forms/common'");
      expect(content).toContain("import { ClrFormsModule } from '@clr/angular/forms'");
    });

    it('should not rename ClrIconModule substring inside a longer identifier', () => {
      tree.create(
        '/app.ts',
        `import { ClrIconModuleConfig } from '@clr/angular';
const cfg: ClrIconModuleConfig = {};`
      );

      runMigrations(tree);
      const content = tree.readText('/app.ts');

      expect(content).toContain('ClrIconModuleConfig');
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

  // -------------------------------------------------------------------------
  // Regex pattern boundary tests — calls production transformImports() directly
  // -------------------------------------------------------------------------

  describe('regex pattern boundaries', () => {
    describe('import path wildcards', () => {
      const wildcardRules = IMPORT_REPLACEMENTS.filter(r => r.oldSymbol === '*');

      for (const rule of wildcardRules) {
        it(`replaces '${rule.oldModule}' import path`, () => {
          const input = `import { Foo } from '${rule.oldModule}';`;
          expect(transformImports(input)).toContain(`from '${rule.newModule}'`);
        });

        it(`does not affect an unrelated import when processing '${rule.oldModule}'`, () => {
          const unrelated = `import { Foo } from '@other/pkg';`;
          expect(transformImports(unrelated)).toBe(unrelated);
        });
      }

      it('longer (more specific) path sorts before shorter prefix', () => {
        const sorted = [...IMPORT_REPLACEMENTS].sort((a, b) => b.oldModule.length - a.oldModule.length);
        const stepperIdx = sorted.findIndex(r => r.oldModule === '@clr/angular/src/accordion/stepper');
        const accordionIdx = sorted.findIndex(r => r.oldModule === '@clr/angular/src/accordion');

        expect(stepperIdx).toBeGreaterThanOrEqual(0);
        expect(accordionIdx).toBeGreaterThanOrEqual(0);
        expect(stepperIdx).toBeLessThan(accordionIdx);
      });

      it('replaces subpath imports — @clr/angular/src/forms/subpath', () => {
        expect(transformImports(`import { Foo } from '@clr/angular/src/forms/utils';`)).toContain(
          `from '@clr/angular/forms/utils'`
        );
      });
    });

    describe('symbol renames (word-boundary)', () => {
      const standardRules = SYMBOL_REPLACEMENTS.filter(r => r.new && !r.old.startsWith('Ç'));

      for (const rule of standardRules) {
        it(`renames '${rule.old}' standalone but not inside a longer identifier`, () => {
          const withSuffix = `${rule.old}Extra`;
          const input = `import { ${withSuffix} } from '@clr/angular'; const x = ${withSuffix};`;
          const output = transformImports(input);
          expect(output).toContain(withSuffix);
          expect(output).not.toContain(`${rule.new}Extra`);
        });
      }

      // Ç-prefix symbols: new name is a substring of old, so suffix test is unsuitable.
      // Test the lookbehind — a preceding letter must suppress the match.
      const cPrefixRules = SYMBOL_REPLACEMENTS.filter(r => r.new && r.old.startsWith('Ç'));

      for (const rule of cPrefixRules) {
        it(`does not rename '${rule.old}' when preceded by an identifier character`, () => {
          const withPrefix = `A${rule.old}`;
          const input = `import { ${withPrefix} } from '@clr/angular'; const x = ${withPrefix};`;
          expect(transformImports(input)).toContain(withPrefix);
        });
      }
    });

    describe('removed symbol boundaries', () => {
      const removedSymbols = SYMBOL_REPLACEMENTS.filter(r => r.new === '').map(r => r.old);

      for (const sym of removedSymbols) {
        it(`strips a sole import of removed symbol '${sym}'`, () => {
          const input = `import { ${sym} } from '@clr/angular/utils';`;
          expect(transformImports(input)).not.toContain(`import { ${sym} }`);
        });

        it(`preserves sibling symbols when stripping '${sym}' import`, () => {
          const input = `import { ${sym}, OtherThing } from '@clr/angular/utils';`;
          expect(transformImports(input)).toContain('OtherThing');
        });

        it(`does not match '${sym}' inside a longer identifier`, () => {
          const longer = `${sym}Wrapper`;
          const input = `import { ${sym} } from '@clr/angular/utils'; const w: ${longer} = {};`;
          expect(transformImports(input)).toContain(longer);
        });
      }
    });
  });
});
