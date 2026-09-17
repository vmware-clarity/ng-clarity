/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClrCardDivider } from './card-divider';
import { ClrCardModule } from './card.module';

@Component({
  template: `<clr-card-divider></clr-card-divider>`,
  standalone: false,
})
class TestComponent {}

describe('ClrCardDivider', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ClrCardModule],
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('adds .card-divider and .clr-card-divider classes on the host element', () => {
    const el = fixture.debugElement.query(By.directive(ClrCardDivider)).nativeElement;
    expect(el.classList.contains('card-divider')).toBe(true);
    expect(el.classList.contains('clr-card-divider')).toBe(true);
  });
});
