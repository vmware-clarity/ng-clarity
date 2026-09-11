/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClrVerticalNavModule } from './vertical-nav.module';

@Component({
  template: `
    <clr-vertical-nav>
      <a clrVerticalNavLink href="#/hosts">Hosts</a>
    </clr-vertical-nav>
    <clr-vertical-nav role="none" class="wrapped">
      <a clrVerticalNavLink href="#/vms">VMs</a>
    </clr-vertical-nav>
  `,
  standalone: false,
})
class TestComponent {}

describe('Vertical nav, as assistive technology sees it', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrVerticalNavModule, NoopAnimationsModule],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('is a navigation landmark', () => {
    expect(fixture.nativeElement.querySelector('clr-vertical-nav').getAttribute('role')).toBe('navigation');
  });

  it('lets the application override the role, for a nav that is already wrapped in a landmark', () => {
    expect(fixture.nativeElement.querySelector('clr-vertical-nav.wrapped').getAttribute('role')).toBe('none');
  });
});
