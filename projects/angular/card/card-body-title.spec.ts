/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClrCardBodyTitle } from './card-body-title';
import { ClrCardModule } from './card.module';

@Component({
  template: `<clr-card-body-title>Hello world</clr-card-body-title>`,
  standalone: false,
})
class TestComponent {}

@Component({
  template: `<clr-card-body-title clrHeadingLevel="3">Hello world</clr-card-body-title>`,
  standalone: false,
})
class TestHeadingLevelComponent {}

describe('ClrCardBodyTitle', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, TestHeadingLevelComponent],
      imports: [ClrCardModule],
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('projects content', () => {
    expect(fixture.nativeElement.textContent.trim()).toBe('Hello world');
  });

  it('adds .card-title and .clr-card-body-title classes on the host element', () => {
    const el = fixture.debugElement.query(By.directive(ClrCardBodyTitle)).nativeElement;
    expect(el.classList.contains('card-title')).toBe(true);
    expect(el.classList.contains('clr-card-body-title')).toBe(true);
  });

  it('has no heading role by default', () => {
    const el = fixture.debugElement.query(By.directive(ClrCardBodyTitle)).nativeElement;
    expect(el.hasAttribute('role')).toBe(false);
  });

  it('gets a heading role and level when clrHeadingLevel is set', () => {
    const headingFixture = TestBed.createComponent(TestHeadingLevelComponent);
    headingFixture.detectChanges();

    const el = headingFixture.debugElement.query(By.directive(ClrCardBodyTitle)).nativeElement;
    expect(el.getAttribute('role')).toBe('heading');
    expect(el.getAttribute('aria-level')).toBe('3');
  });
});
