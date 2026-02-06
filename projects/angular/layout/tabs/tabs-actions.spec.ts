/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClrTabsActions } from './tabs-actions';
import { ClrTabsModule } from './tabs.module';

@Component({
  template: `<clr-tabs-actions>Hello world</clr-tabs-actions>`,
  standalone: false,
})
class TestComponent {}

describe('TabsActions', () => {
  let fixture: ComponentFixture<any>;
  let compiled: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrTabsModule],
      declarations: [TestComponent],
      providers: [],
    });
    fixture = TestBed.createComponent(TestComponent);
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('projects content', () => {
    expect(compiled.textContent.trim()).toMatch('Hello world');
  });

  it('adds a .tabs-actions class on the host element', () => {
    const tabsActionsElement = fixture.debugElement.query(By.directive(ClrTabsActions)).nativeElement;
    expect(tabsActionsElement.classList.contains('tabs-actions')).toBe(true);
  });
});
