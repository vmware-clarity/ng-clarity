/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClrCardMediaDescription } from './card-media-description';
import { ClrCardMediaImage } from './card-media-image.directive';
import { ClrCardMediaText } from './card-media-text.directive';
import { ClrCardMediaTitle } from './card-media-title.directive';
import { ClrCardModule } from './card.module';

@Component({
  template: `
    <img clrCardMediaImage src="test.png" alt="" />
    <clr-card-media-description>
      <span clrCardMediaTitle>Title</span>
      <span clrCardMediaText>Text</span>
    </clr-card-media-description>
  `,
  standalone: false,
})
class TestComponent {}

describe('Card media parts', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ClrCardModule],
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('ClrCardMediaImage adds the .card-media-image class on the host img element', () => {
    const el = fixture.debugElement.query(By.directive(ClrCardMediaImage)).nativeElement;
    expect(el.classList.contains('card-media-image')).toBe(true);
  });

  it('ClrCardMediaTitle adds the .card-media-title class on the host element', () => {
    const el = fixture.debugElement.query(By.directive(ClrCardMediaTitle)).nativeElement;
    expect(el.classList.contains('card-media-title')).toBe(true);
  });

  it('ClrCardMediaText adds the .card-media-text class on the host element', () => {
    const el = fixture.debugElement.query(By.directive(ClrCardMediaText)).nativeElement;
    expect(el.classList.contains('card-media-text')).toBe(true);
  });

  it('ClrCardMediaDescription adds host classes and projects content', () => {
    const el = fixture.debugElement.query(By.directive(ClrCardMediaDescription)).nativeElement;
    expect(el.classList.contains('card-media-description')).toBe(true);
    expect(el.classList.contains('clr-card-media-description')).toBe(true);
    expect(el.textContent.trim()).toBe('TitleText');
  });
});
