/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClrCardImg } from './card-img';
import { ClrCardModule } from './card.module';

@Component({
  template: `<clr-card-img><img src="test.png" alt="" /></clr-card-img>`,
  standalone: false,
})
class TestComponent {}

describe('ClrCardImg', () => {
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
    expect(fixture.nativeElement.querySelector('img')).not.toBeNull();
  });

  it('adds .card-img and .clr-card-img classes on the host element', () => {
    const el = fixture.debugElement.query(By.directive(ClrCardImg)).nativeElement;
    expect(el.classList.contains('card-img')).toBe(true);
    expect(el.classList.contains('clr-card-img')).toBe(true);
  });
});
