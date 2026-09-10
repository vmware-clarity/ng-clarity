/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClrCardBodyText } from './card-body-text';
import { ClrCardModule } from './card.module';

@Component({
  template: `<clr-card-body-text>Hello world</clr-card-body-text>`,
  standalone: false,
})
class TestComponent {}

describe('ClrCardBodyText', () => {
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

  it('adds .card-text and .clr-card-body-text classes on the host element', () => {
    const el = fixture.debugElement.query(By.directive(ClrCardBodyText)).nativeElement;
    expect(el.classList.contains('card-text')).toBe(true);
    expect(el.classList.contains('clr-card-body-text')).toBe(true);
  });
});
