/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrTabOverflowContent } from './tab-overflow-content';
import { ClrPopoverToggleService } from '../../popover/common/providers/popover-toggle.service';

@Component({
  template: `<clr-tab-overflow-content>Hello world</clr-tab-overflow-content>`,
  standalone: false,
})
class TestComponent {}

describe('TabOverflowContent', () => {
  let fixture: ComponentFixture<any>;
  let compiled: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClrTabOverflowContent, TestComponent],
      providers: [ClrPopoverToggleService],
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('has the correct css classes', () => {
    expect(compiled.querySelector('.dropdown-menu')).not.toBeNull();
  });

  it('projects content', () => {
    expect(compiled.textContent.trim()).toMatch('Hello world');
  });
});
