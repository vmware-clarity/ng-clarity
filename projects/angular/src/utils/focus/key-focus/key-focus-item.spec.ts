/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expectActiveElementToBe } from '../../testing/helpers.spec';
import { ClrKeyFocusItem } from './key-focus-item';
import { ClrKeyFocusModule } from './key-focus.module';

@Component({
  template: `<button clrKeyFocusItem>Button 1</button>`,
  standalone: false,
})
class TestComponent {
  @ViewChild(ClrKeyFocusItem, { static: true }) button: ClrKeyFocusItem;
}

let fixture: ComponentFixture<any>;
let component: TestComponent;

describe('Typescript API', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrKeyFocusModule],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should focus host element', () => {
    component.button.focus();
    expectActiveElementToBe(fixture.nativeElement.querySelector('button'));
  });
});
