/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrCombobox } from './combobox';
import { TestContext } from '../../data/datagrid/helpers.spec';
import { ClrPopoverService } from '../../popover/common/providers/popover.service';

@Component({
  template: `
    <clr-combobox>
      <clr-options class="test">Test</clr-options>
    </clr-combobox>
  `,
  standalone: false,
})
class TestSelectWithMenu {}

export default function (): void {
  describe('Select with Menu', function () {
    let context: TestContext<ClrCombobox<string>, TestSelectWithMenu>;
    let popoverService: ClrPopoverService;

    beforeEach(function () {
      context = this.create(ClrCombobox, TestSelectWithMenu, [], []);
      popoverService = context.getClarityProvider(ClrPopoverService);
      popoverService.open = true;
      context.detectChanges();
    });

    afterEach(function () {
      popoverService.open = false;
      context.detectChanges();
    });

    it('renders the menu projected by the consumer', function () {
      const menus = document.body.querySelectorAll('clr-options');
      expect(menus.length).toBe(1);
      expect(menus[0].classList.contains('test')).toBe(true);
    });
  });
}
