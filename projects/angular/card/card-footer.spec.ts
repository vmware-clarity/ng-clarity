/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClrCardFooter } from './card-footer';
import { ClrCardModule } from './card.module';

@Component({
  template: `<clr-card-footer>Hello world</clr-card-footer>`,
  standalone: false,
})
class TestComponent {}

describe('ClrCardFooter', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ClrCardModule],
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('projects content', () => {
    expect(fixture.nativeElement.textContent.trim()).toBe('Hello world');
  });

  it('adds .card-footer and .clr-card-footer classes on the host element', () => {
    const el = fixture.debugElement.query(By.directive(ClrCardFooter)).nativeElement;
    expect(el.classList.contains('card-footer')).toBe(true);
    expect(el.classList.contains('clr-card-footer')).toBe(true);
  });
});
