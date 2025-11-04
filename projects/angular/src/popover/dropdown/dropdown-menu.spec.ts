/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrDropdown } from './dropdown';
import { ClrDropdownMenu } from './dropdown-menu';
import { DropdownFocusHandler } from './providers/dropdown-focus-handler.service';
import { FocusableItem } from '../../utils/focus/focusable-item/focusable-item';
import { spec, TestContext } from '../../utils/testing/helpers.spec';
import { ClrPopoverService } from '../common/providers/popover.service';

@Component({
  template: `
    <clr-dropdown>
      @if (menu) {
        <clr-dropdown-menu [clrPosition]="position">Hello world</clr-dropdown-menu>
      }
    </clr-dropdown>
  `,
  standalone: false,
})
class SimpleTest {
  position: string;

  menu = true;
}

export default function (): void {
  describe('DropdownMenu component', function () {
    type Context = TestContext<ClrDropdownMenu, SimpleTest>;
    spec(ClrDropdownMenu, SimpleTest, null, { declarations: [ClrDropdown] });

    beforeEach(function (this: Context) {
      this.getClarityProvider(ClrPopoverService).open = true;
      this.detectChanges();
    });

    it('projects content', function (this: Context) {
      expect(this.clarityElement.textContent.trim()).toMatch('Hello world');
    });

    it('has the correct css classes', function (this: Context) {
      expect(this.hostElement.querySelector('.dropdown-menu')).not.toBeNull();
    });

    it('adds the menu role to the host', function (this: Context) {
      expect(this.clarityElement.getAttribute('role')).toBe('menu');
    });

    it('declares itself to the DropdownFocusHandler', function (this: Context) {
      expect(this.getClarityProvider(DropdownFocusHandler).container).toBe(this.clarityElement);
    });

    it('adds DropdownItem children to the DropdownFocusHandler', function (this: Context) {
      const focusHandler = this.getClarityProvider(DropdownFocusHandler);
      const spy = spyOn(focusHandler, 'addChildren');
      const newChildren = [{ id: '1' }, { id: '2' }, { id: '3' }] as FocusableItem[];
      this.clarityDirective.items.reset(newChildren);
      this.clarityDirective.items.notifyOnChanges();
      expect(spy).toHaveBeenCalledWith(newChildren);
    });

    it('removes children from the DropdownFocusHandler on destroy', function (this: Context) {
      const focusHandler = this.getClarityProvider(DropdownFocusHandler);
      const spy = spyOn(focusHandler, 'resetChildren');
      this.hostComponent.menu = false;
      this.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });
}
