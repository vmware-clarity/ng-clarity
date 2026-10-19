/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClrCardMediaBlock } from './card-media-block';
import { ClrCardModule } from './card.module';

@Component({
  template: `<clr-card-media-block [clrCardMediaWrap]="wrap">Hello world</clr-card-media-block>`,
  standalone: false,
})
class TestComponent {
  wrap = false;
}

describe('ClrCardMediaBlock', () => {
  let fixture: ComponentFixture<TestComponent>;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ClrCardModule],
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    el = fixture.debugElement.query(By.directive(ClrCardMediaBlock)).nativeElement;
  });

  it('projects content', () => {
    expect(fixture.nativeElement.textContent.trim()).toBe('Hello world');
  });

  it('adds .card-media-block and .clr-card-media-block classes on the host element', () => {
    expect(el.classList.contains('card-media-block')).toBe(true);
    expect(el.classList.contains('clr-card-media-block')).toBe(true);
  });

  it('does not add the .wrap class by default', () => {
    expect(el.classList.contains('wrap')).toBe(false);
  });

  it('adds the .wrap class when clrCardMediaWrap is true', () => {
    fixture.componentInstance.wrap = true;
    fixture.detectChanges();
    expect(el.classList.contains('wrap')).toBe(true);
  });
});
