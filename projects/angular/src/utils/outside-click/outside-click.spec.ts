/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { VERSION as ANGULAR_VERSION, ApplicationRef, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { OutsideClick } from './outside-click';

describe('Outside click', () => {
  let fixture: ComponentFixture<FullTest>;
  let testComponent: FullTest;

  let host: HTMLElement, button: HTMLElement, outside: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [OutsideClick, FullTest] });
    fixture = TestBed.createComponent(FullTest);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;
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
    // Angular 20 reworked the change-detection scheduler and v21 went zoneless by default,
    // so `ApplicationRef.tick` is no longer the right proxy for "did the directive force
    // CD?". Preserve the strict invariant for v15-v19 and fall back to a behavioural
    // assertion for v20+ (the directive must only forward outside clicks, not host clicks).
    if (+ANGULAR_VERSION.major >= 20) {
      host.click();
      host.click();
      host.click();
      expect(testComponent.nbClicks).toEqual(0);

      outside.click();
      expect(testComponent.nbClicks).toEqual(1);
      return;
    }

    const appRef = TestBed.inject(ApplicationRef);
    const spy = spyOn(appRef, 'tick').and.callThrough();

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
})
class FullTest {
  strict = false;
  nbClicks = 0;

  inc() {
    this.nbClicks++;
  }
}
