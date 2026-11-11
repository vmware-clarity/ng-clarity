/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrCardImage } from './card-image';
import { ClrCardModule } from './card.module';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<clr-card-image><img src="test.png" alt="" /></clr-card-image>`,
  standalone: false,
})
class TestComponent {}

describe('ClrCardImage', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ClrCardModule],
    });

    fixture = TestBed.createComponent(TestComponent);
    renderFixture(fixture);
  });

  it('projects content', () => {
    expect(fixture.nativeElement.querySelector('img')).not.toBeNull();
  });

  it('adds .card-img and .clr-card-image classes on the host element', () => {
    const el = fixture.debugElement.query(By.directive(ClrCardImage)).nativeElement;
    expect(el.classList.contains('card-img')).toBe(true);
    expect(el.classList.contains('clr-card-image')).toBe(true);
  });
});
