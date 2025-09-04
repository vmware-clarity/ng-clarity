/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { OutsideClick } from './outside-click';

describe('Outside click', () => {
  let fixture: ComponentFixture<FullTest>;
  let testComponent: FullTest;
  let outslideClickDirective: OutsideClick;

  let host: HTMLElement, button: HTMLElement, outside: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [OutsideClick, FullTest] });
    fixture = TestBed.createComponent(FullTest);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;
    outslideClickDirective = fixture.componentInstance.outslideClick;
    host = fixture.debugElement.query(By.css('.host')).nativeElement;
    button = fixture.debugElement.query(By.css('button')).nativeElement;
    outside = fixture.debugElement.query(By.css('.outside')).nativeElement;
  });

  it('emits clicks outside of the host', () => {
    expect(testComponent.nbClicks).toBe(0);
    outside.click();
    expect(testComponent.nbClicks).toBe(1);
    outside.click();
    expect(testComponent.nbClicks).toBe(2);
  });

  it('ignores clicks inside of the host', () => {
    expect(testComponent.nbClicks).toBe(0);
    host.click();
    expect(testComponent.nbClicks).toBe(0);
    button.click();
    expect(testComponent.nbClicks).toBe(0);
  });

  it('offers a strict input to only ignore clicks that happen exactly on the host', () => {
    testComponent.strict = true;
    fixture.detectChanges();
    expect(testComponent.nbClicks).toBe(0);
    host.click();
    expect(testComponent.nbClicks).toBe(0);
    button.click();
    expect(testComponent.nbClicks).toBe(1);
  });

  it('should not run change detection if the click event happened on the host element', () => {
    const spy = spyOn(outslideClickDirective.outsideClick, 'emit').and.callThrough();

    host.click();
    host.click();
    host.click();

    expect(spy.calls.count()).toEqual(0);

    outside.click();

    expect(spy.calls.count()).toEqual(1);
    expect(testComponent.nbClicks).toEqual(1);
  });
});

@Component({
  template: `
    <p class="outside">Hello World</p>
    <p class="host" (clrOutsideClick)="inc()" [clrStrict]="strict">
      <button>Button</button>
    </p>
  `,
  standalone: false,
})
class FullTest {
  @ViewChild(OutsideClick) outslideClick: OutsideClick;
  strict = false;
  nbClicks = 0;

  inc() {
    this.nbClicks++;
  }
}
