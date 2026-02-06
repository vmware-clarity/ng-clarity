/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClrDropdown } from './dropdown';
import { ClrDropdownMenu } from './dropdown-menu';
import { DropdownFocusHandler } from './providers/dropdown-focus-handler.service';
import { FocusableItem } from '../../utils/focus/focusable-item/focusable-item';
import { ClrPopoverContent, ClrPopoverService } from '../common';
import { ClrDropdownModule } from './dropdown.module';
import { ClrPopoverPosition } from '../common/utils/popover-positions';

@Component({
  template: `
    <clr-dropdown>
      <button class="btn btn-primary" clrDropdownTrigger>Dropdown</button>
      @if (menu) {
        <clr-dropdown-menu [clrPosition]="position">Hello world</clr-dropdown-menu>
      }
    </clr-dropdown>
  `,
  standalone: false,
})
class SimpleTest {
  position: ClrPopoverPosition;

  menu = true;
}

export default function (): void {
  describe('DropdownMenu component', function () {
    let fixture: ComponentFixture<SimpleTest>;
    let popoverService: ClrPopoverService;
    let popoverContent: ClrPopoverContent;
    let focusHandler: DropdownFocusHandler;
    let dropdownMenu: HTMLElement;

    beforeEach(async () => {
      TestBed.configureTestingModule({ imports: [ClrDropdownModule, ClrPopoverContent], declarations: [SimpleTest] });

      fixture = TestBed.createComponent(SimpleTest);
      popoverService = fixture.debugElement.query(By.directive(ClrDropdown)).injector.get(ClrPopoverService);
      focusHandler = fixture.debugElement.query(By.directive(ClrDropdown)).injector.get(DropdownFocusHandler);

      popoverService.open = true;
      fixture.detectChanges();

      // ClrPopoverContent is only available after open
      popoverContent = fixture.debugElement.query(By.directive(ClrDropdownMenu)).injector.get(ClrPopoverContent);

      dropdownMenu = document.body.querySelector('.dropdown-menu') as HTMLElement;
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('projected content', function () {
      expect(dropdownMenu.textContent.trim()).toMatch('Hello world');
    });

    it('has the correct css classes', function () {
      expect(dropdownMenu).not.toBeNull();
    });

    it('supports clrPosition option', function () {
      // Default is bottom-left since menuPosition is set to ""
      expect(popoverContent.contentAt as ClrPopoverPosition).toEqual(ClrPopoverPosition.BOTTOM_LEFT);

      fixture.componentInstance.position = ClrPopoverPosition.BOTTOM_RIGHT;
      fixture.detectChanges();
      expect(popoverContent.contentAt as ClrPopoverPosition).toEqual(ClrPopoverPosition.BOTTOM_RIGHT);

      fixture.componentInstance.position = ClrPopoverPosition.TOP_RIGHT;
      fixture.detectChanges();
      expect(popoverContent.contentAt as ClrPopoverPosition).toEqual(ClrPopoverPosition.TOP_RIGHT);
    });

    it('adds the menu role to the host', function () {
      expect(dropdownMenu.getAttribute('role')).toBe('menu');
    });

    it('declares itself to the DropdownFocusHandler', function () {
      expect(focusHandler.container).toBe(dropdownMenu);
    });

    it('adds DropdownItem children to the DropdownFocusHandler', function () {
      const clrDropdownMenu = fixture.debugElement.query(By.directive(ClrDropdownMenu)).injector.get(ClrDropdownMenu);
      const spy = spyOn(focusHandler, 'addChildren');
      const newChildren = [{ id: '1' }, { id: '2' }, { id: '3' }] as FocusableItem[];
      clrDropdownMenu.items.reset(newChildren);
      clrDropdownMenu.items.notifyOnChanges();
      expect(spy).toHaveBeenCalledWith(newChildren);
    });

    it('removes children from the DropdownFocusHandler on destroy', function () {
      const spy = spyOn(focusHandler, 'resetChildren');
      fixture.componentInstance.menu = false;
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });
}
