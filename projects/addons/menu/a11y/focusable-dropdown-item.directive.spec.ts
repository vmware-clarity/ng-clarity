/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClrDropdownItem } from '@clr/angular/popover/dropdown';

import { FocusableDropdownItemDirective } from './focusable-dropdown-item.directive';
import { FocusableItemProvider } from './focusable-item-provider';

@Component({
  selector: 'test-dropdown-item',
  standalone: false,
  template: '<div clrDropdownItem appfxFocusableDropdownItem></div>',
})
class TestDropdownItemComponent {}

@Component({
  selector: 'clr-dropdown-item',
  standalone: false,
  template: `<ng-content></ng-content>`,
})
class MockClrDropdownItemComponent {
  focusableItem: any = {};
}

describe('FocusableDropdownItemDirective', () => {
  let fixture: ComponentFixture<TestDropdownItemComponent>;
  let directive: FocusableDropdownItemDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockClrDropdownItemComponent, TestDropdownItemComponent, FocusableDropdownItemDirective],
      providers: [
        FocusableDropdownItemDirective,
        { provide: ClrDropdownItem, useClass: MockClrDropdownItemComponent },
        { provide: FocusableItemProvider, useClass: FocusableDropdownItemDirective },
      ],
    });

    fixture = TestBed.createComponent(TestDropdownItemComponent);
    fixture.detectChanges();

    directive = fixture.debugElement.injector.get(FocusableDropdownItemDirective);
  });

  it('should provide a focusable item', () => {
    const focusableItem = directive.getFocusableItem();

    expect(focusableItem).toBeDefined();
  });
});
