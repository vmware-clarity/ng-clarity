/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { spec, TestContext } from '@clr/angular/testing';
import { FocusService } from '@clr/angular/utils';

import { ClrDropdown } from './dropdown';
import { ClrDropdownTrigger } from './dropdown-trigger';
import { DROPDOWN_FOCUS_HANDLER_PROVIDER, DropdownFocusHandler } from './providers/dropdown-focus-handler.service';
@Component({
  template: `<button clrDropdownTrigger>Hello world</button>`,
  // These services are declared here because they need the renderer
  providers: [FocusService, DROPDOWN_FOCUS_HANDLER_PROVIDER],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class SimpleTest {}

describe('Dropdown', () => {
  describe('Components', () => {
    describe('DropdownTrigger directive', () => {
      let testContext: Context;

      /*
       * Most tests for this directive are apparently jammed in the main dropdown.spec.ts,
       * but moving them isn't relevant to this commit.
       */

      type Context = TestContext<ClrDropdownTrigger, SimpleTest>;
      const getContext = spec(ClrDropdownTrigger, SimpleTest, null, {
        providers: [{ provide: ClrDropdown, useValue: {} }, ClrPopoverService],
      });
      beforeEach(() => {
        testContext = getContext() as Context;
      });

      it('adds the aria-haspopup attribute to the host', () => {
        expect(testContext.clarityElement.getAttribute('aria-haspopup')).toBe('menu');
      });

      it('adds the aria-expanded attribute to the host', () => {
        const popoverService = testContext.getProvider(ClrPopoverService);
        popoverService.open = false;
        testContext.detectChanges();
        expect(testContext.clarityElement.getAttribute('aria-expanded')).toBe('false');
        popoverService.open = true;
        testContext.detectChanges();
        expect(testContext.clarityElement.getAttribute('aria-expanded')).toBe('true');
      });

      it('declares itself to the DropdownFocusHandler', () => {
        expect(testContext.getClarityProvider(DropdownFocusHandler).trigger).toBe(testContext.clarityElement);
      });
    });
  });
});
