/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { createTestHelpers, TestContext } from '@clr/angular/testing';

import { ClrCombobox } from './combobox';

@Component({
  template: `
    <clr-combobox>
      <clr-options class="test">Test</clr-options>
    </clr-combobox>
  `,
  standalone: false,
})
class TestSelectWithMenu {}

describe('Combobox component', () => {
  describe('Integration Tests', () => {
    describe('Select with Menu', () => {
      const helpers = createTestHelpers();

      let context: TestContext<ClrCombobox<string>, TestSelectWithMenu>;
      let popoverService: ClrPopoverService;

      beforeEach(() => {
        context = helpers.create<ClrCombobox<string>, TestSelectWithMenu>(ClrCombobox, TestSelectWithMenu, [], []);
        popoverService = context.getClarityProvider(ClrPopoverService);
        popoverService.open = true;
        context.detectChanges();
      });

      afterEach(() => {
        popoverService.open = false;
        context.detectChanges();
      });

      it('renders the menu projected by the consumer', () => {
        const menus = document.body.querySelectorAll('clr-options');
        expect(menus.length).toBe(1);
        expect(menus[0].classList.contains('test')).toBe(true);
      });
    });
  });
});
