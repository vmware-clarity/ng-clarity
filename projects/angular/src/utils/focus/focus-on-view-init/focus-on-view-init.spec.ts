/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ApplicationRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expectActiveElementToBe } from '../../testing/helpers.spec';
import { ClrFocusOnViewInit } from './focus-on-view-init';
import { ClrFocusOnViewInitModule } from './focus-on-view-init.module';
import { FOCUS_ON_VIEW_INIT } from './focus-on-view-init.provider';

const focusOnViewInitProvider = { provide: FOCUS_ON_VIEW_INIT, useValue: true };

@Component({
  template: `
    <button #dummyButton>dummy button</button>
    <div *ngIf="displayNoExistingTabindex">
      <h1 clrFocusOnViewInit>Title</h1>
    </div>
    <div *ngIf="displayExistingTabindex">
      <h1 clrFocusOnViewInit tabindex="5">Title</h1>
    </div>
    <div *ngIf="displayDisabled">
      <h1 [clrFocusOnViewInit]="false">Title</h1>
    </div>
  `,
})
class TestComponent {
  displayNoExistingTabindex = false;
  displayExistingTabindex = false;
  displayDisabled = false;

  @ViewChild('dummyButton', { static: true }) buttonElRef: ElementRef<HTMLButtonElement>;

  @ViewChild(ClrFocusOnViewInit, { read: ElementRef }) focusOnItElRef: ElementRef<HTMLElement>;
}

@Component({
  template: `
    <button #dummyButton>dummy button</button>
    <div *ngIf="display">
      <h1 clrFocusOnViewInit>Title</h1>
    </div>
  `,
  providers: [focusOnViewInitProvider],
})
class TestDisablingViaInjection {
  display = false;
  @ViewChild('dummyButton', { static: true }) buttonElRef: ElementRef<HTMLButtonElement>;
  @ViewChild(ClrFocusOnViewInit, { read: ElementRef }) focusOnItElRef: ElementRef<HTMLElement>;
}

describe('ClrFocusOnViewInit', () => {
  let fixture: ComponentFixture<any>;

  describe('Default: Without Injection', () => {
    let component: TestComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrFocusOnViewInitModule],
        declarations: [TestComponent],
      });
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('sets negative tabindex if no tabindex', () => {
      component.displayNoExistingTabindex = true;
      fixture.detectChanges();
      expect(component.focusOnItElRef.nativeElement.getAttribute('tabindex')).toBe('-1');
    });

    it('should use existing tabindex', () => {
      component.displayExistingTabindex = true;
      fixture.detectChanges();
      expect(component.focusOnItElRef.nativeElement.getAttribute('tabindex')).toBe('5');
    });

    it('sets focus on the directive element on view initialization', () => {
      component.buttonElRef.nativeElement.focus();
      expectActiveElementToBe(component.buttonElRef.nativeElement);
      component.displayNoExistingTabindex = true;
      fixture.detectChanges();
      expectActiveElementToBe(component.focusOnItElRef.nativeElement);
    });

    it('should remove tabindex on focusout event and should not run change detection', () => {
      component.displayNoExistingTabindex = true;
      fixture.detectChanges();
      const appRef = TestBed.inject(ApplicationRef);
      spyOn(appRef, 'tick');
      expect(component.focusOnItElRef.nativeElement.getAttribute('tabindex')).toBe('-1');
      component.buttonElRef.nativeElement.focus();
      expect(component.focusOnItElRef.nativeElement.getAttribute('tabindex')).toBeNull();
      expect(appRef.tick).not.toHaveBeenCalled();
    });

    it('should not remove tabindex if it was pre-existing tabindex', () => {
      component.displayExistingTabindex = true;
      fixture.detectChanges();
      expect(component.focusOnItElRef.nativeElement.getAttribute('tabindex')).toBe('5');
      component.buttonElRef.nativeElement.focus();
      fixture.detectChanges();
      expect(component.focusOnItElRef.nativeElement.getAttribute('tabindex')).toBe('5');
    });

    it('should not set focus on the directive element if disabled', () => {
      component.buttonElRef.nativeElement.focus();
      expectActiveElementToBe(component.buttonElRef.nativeElement);
      component.displayDisabled = true;
      fixture.detectChanges();
      expectActiveElementToBe(component.buttonElRef.nativeElement);
    });
  });

  describe('With Injection', () => {
    let component: TestDisablingViaInjection;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrFocusOnViewInitModule],
        declarations: [TestDisablingViaInjection],
      });
    });

    it('should focus on the directive element when value true is injected', () => {
      focusOnViewInitProvider.useValue = true;
      fixture = TestBed.createComponent(TestDisablingViaInjection);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.buttonElRef.nativeElement.focus();
      expectActiveElementToBe(component.buttonElRef.nativeElement);
      component.display = true;
      fixture.detectChanges();
      expectActiveElementToBe(component.focusOnItElRef.nativeElement);
    });

    it('should not focus on the directive element when value false is injected', () => {
      focusOnViewInitProvider.useValue = false;
      fixture = TestBed.createComponent(TestDisablingViaInjection);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.buttonElRef.nativeElement.focus();
      expectActiveElementToBe(component.buttonElRef.nativeElement);
      component.display = true;
      fixture.detectChanges();
      expectActiveElementToBe(component.buttonElRef.nativeElement);
    });
  });
});
