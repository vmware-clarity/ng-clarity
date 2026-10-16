/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ClrPopoverService, POPOVER_HOST_ORIGIN } from '@clr/angular/popover/common';
import { createTestHelpers, TestContext } from '@clr/angular/testing';
import { ClrCommonStringsService, FocusService, IF_ACTIVE_ID_PROVIDER } from '@clr/angular/utils';

import { ClrOptions } from './options';
import { ComboboxFocusHandler } from './providers/combobox-focus-handler.service';
import { OptionSelectionService } from './providers/option-selection.service';

const OPTION_PROVIDERS = [
  ClrPopoverService,
  IF_ACTIVE_ID_PROVIDER,
  OptionSelectionService,
  FocusService,
  ComboboxFocusHandler,
  ClrCommonStringsService,
];

@Component({
  template: `<clr-options>Test</clr-options>`,
  providers: [...OPTION_PROVIDERS, { provide: POPOVER_HOST_ORIGIN, useExisting: ElementRef }],
  standalone: false,
})
class TestComponent {}

@Component({
  template: `
    <clr-options>
      @if (showOption) {
        <clr-option>1</clr-option>
      }
    </clr-options>
  `,
  providers: [...OPTION_PROVIDERS, { provide: POPOVER_HOST_ORIGIN, useExisting: ElementRef }],
  standalone: false,
})
class TestComponentWithChild {
  showOption = true;
}

@Component({
  template: `<clr-options>Test</clr-options>`,
  providers: OPTION_PROVIDERS,
  standalone: false,
})
class TestComponentWithError {}

export default function (): void {
  describe('Select Options Menu Component', () => {
    const helpers = createTestHelpers();

    let context:
      | TestContext<ClrOptions<string>, TestComponent>
      | TestContext<ClrOptions<string>, TestComponentWithChild>;
    let popoverService: ClrPopoverService;

    describe('View Basics', () => {
      beforeEach(() => {
        context = helpers.createOnly<ClrOptions<string>, TestComponent>(ClrOptions, TestComponent, []);
        popoverService = context.getClarityProvider(ClrPopoverService);
      });

      afterEach(() => {
        popoverService.open = false;
        context.detectChanges();
      });

      it('projects content', () => {
        const menu = context.testElement.querySelector('clr-options');
        expect(menu.textContent).toMatch(/Test/);
      });

      it('has the correct class', () => {
        const menu = context.testElement.querySelector('clr-options');
        expect(menu.classList.contains('clr-combobox-options')).toBe(true);
      });

      it('does not close the menu when you click on the menu', () => {
        popoverService.open = true;
        const menu = context.testElement.querySelector('clr-options');
        menu.click();

        expect(popoverService.open).toBe(true);
      });

      it('handles loading and no-result states', () => {
        const selectionService: OptionSelectionService<any> = context.getClarityProvider(OptionSelectionService);
        selectionService.loading = true;
        context.fixture.detectChanges();
        const menu = context.testElement.querySelector('clr-options');
        expect(menu.textContent).toMatch(/Loading/);
        expect(menu.textContent).toMatch(/Searching for matches for/);
        selectionService.loading = false;
        context.fixture.detectChanges();
        expect(menu.textContent).toMatch(/No results/);
      });
    });

    describe('Template API', () => {
      describe('Plain text content', () => {
        beforeEach(() => {
          context = helpers.createOnly<ClrOptions<string>, TestComponent>(ClrOptions, TestComponent, []);
        });

        it('has a searchText method', () => {
          const searchText = context.clarityDirective.searchText('test');
          expect(searchText).toEqual('Searching for matches for "test"');
        });
      });

      describe('ClrOption content', () => {
        beforeEach(() => {
          context = helpers.create<ClrOptions<string>, TestComponentWithChild>(ClrOptions, TestComponentWithChild, []);
        });

        it('can add option items', () => {
          expect(context.clarityDirective.items.length).toBe(1);
          (context.testComponent as TestComponentWithChild).showOption = false;
          context.detectChanges();
          expect(context.clarityDirective.items.length).toBe(0);
        });

        it('has "emptyOptions" field that depend on the items', () => {
          expect(context.clarityDirective.emptyOptions).toBeFalse();
          (context.testComponent as TestComponentWithChild).showOption = false;
          context.detectChanges();
          expect(context.clarityDirective.emptyOptions).toBeTrue();
        });
      });
    });

    describe('Error Condition', () => {
      it('throws an error when options menu is not used inside of clr-combobox', () => {
        TestBed.configureTestingModule({ declarations: [ClrOptions, TestComponentWithError] });
        expect(() => {
          TestBed.createComponent(TestComponentWithError);
        }).toThrowError('clr-options should only be used inside of a clr-combobox');
      });
    });
  });
}
