/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrTabAction } from './tab-action.directive';
import { ClrTabsModule } from './tabs.module';

@Component({
  template: `
    <clr-tabs>
      <clr-tabs-action>
        <button clrTabAction>Tab Action</button>
      </clr-tabs-action>
      <clr-tab>
        <button clrTabLink>Tab1</button>
      </clr-tab>
      <clr-tab>
        <button clrTabLink>Tab2</button>
      </clr-tab>
    </clr-tabs>
  `,
  standalone: false,
})
class TestComponent {
  @ViewChildren(ClrTabAction, { read: ElementRef }) tabsActions: QueryList<ElementRef>;
}

describe('TabAction Directive', () => {
  let fixture: ComponentFixture<any>;
  let instance: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrTabsModule],
      declarations: [TestComponent],
      providers: [],
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    instance = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('has the correct tabIndex value', () => {
    const tabsActions: QueryList<ElementRef> = instance.tabsActions;
    expect(tabsActions.length).toBe(1);
    expect(tabsActions.get(0).nativeElement.tabIndex).toBe(0);
  });
});
