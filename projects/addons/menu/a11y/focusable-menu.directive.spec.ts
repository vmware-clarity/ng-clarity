/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrDropdownModule } from '@clr/angular/popover/dropdown';

import { FocusableMenuDirective } from './focusable-menu.directive';

@Component({
  selector: 'test-focusable-menu',
  standalone: false,
  template: ` <clr-dropdown>
    <button clrDropdownTrigger>Trigger</button>
    <clr-dropdown-menu appfxFocusableMenu>
      <div clrDropdownItem>Action 1</div>
    </clr-dropdown-menu>
  </clr-dropdown>`,
})
class TestFocusableMenuComponent {}

describe('FocusableMenuDirective', () => {
  let fixture: ComponentFixture<TestFocusableMenuComponent>;
  let directive: FocusableMenuDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrDropdownModule],
      declarations: [TestFocusableMenuComponent, FocusableMenuDirective],
    });

    fixture = TestBed.createComponent(TestFocusableMenuComponent);
    fixture.detectChanges();

    directive = fixture.debugElement.query(By.directive(FocusableMenuDirective)).injector.get(FocusableMenuDirective);
  });

  it('should provide a focusable item', () => {
    const focusableItem = directive.getFocusableItem();

    expect(focusableItem).toBeDefined();
  });
});
