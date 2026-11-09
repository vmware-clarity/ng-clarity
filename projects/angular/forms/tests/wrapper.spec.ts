/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DebugElement, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ClrCommonFormsModule, LayoutService, NgControlService } from '@clr/angular/forms/common';
import { ClrIcon } from '@clr/angular/icon';

export function WrapperNoLabelSpec(
  testContainer: Type<unknown>,
  testControl: Type<unknown>,
  testComponent: Type<unknown>
): void {
  describe('no label', () => {
    let fixture: ComponentFixture<unknown>;
    let containerDE: DebugElement;
    let containerEl: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrIcon, ClrCommonFormsModule, FormsModule],
        declarations: [testContainer, testControl, testComponent],
        providers: [NgControlService, LayoutService],
      });
      fixture = TestBed.createComponent(testComponent);

      containerDE = fixture.debugElement.query(By.directive(testContainer));
      containerEl = containerDE.nativeElement;
    });

    it('adds an empty label when no label is provided', () => {
      fixture.detectChanges();
      const labels = containerEl.querySelectorAll('label');
      expect(Array.prototype.filter.call(labels, (label: HTMLLabelElement) => label.textContent === '').length).toBe(1);
    });
  });
}

export function WrapperFullSpec(
  testContainer: Type<unknown>,
  testControl: Type<unknown>,
  testComponent: Type<unknown>,
  wrapperClass: string
): void {
  describe('full example', () => {
    let fixture: ComponentFixture<unknown>;
    let containerDE: DebugElement;
    let containerEl: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrIcon, ClrCommonFormsModule, FormsModule],
        declarations: [testContainer, testControl, testComponent],
        providers: [NgControlService, LayoutService],
      });
      fixture = TestBed.createComponent(testComponent);

      containerDE = fixture.debugElement.query(By.directive(testContainer));
      containerEl = containerDE.nativeElement;
      fixture.detectChanges();
    });

    it('projects the control inside of the wrapper', () => {
      expect(containerDE.query(By.directive(testControl))).toBeTruthy();
    });

    it('projects the control as first child', () => {
      const control = containerEl.querySelector('[name]');
      expect(control).toBeTruthy();
      expect(control!.previousElementSibling).toBeFalsy();
    });

    it('projects the label as second child', () => {
      const label = containerEl.querySelector('label');
      expect(label).toBeTruthy();
      expect(label!.previousElementSibling).toBeTruthy();
    });

    it('adds the wrapper class to the host', () => {
      expect(containerEl.classList).toContain(wrapperClass);
    });
  });
}

export function WrapperContainerSpec(
  testContainer: Type<unknown>,
  testWrapper: Type<unknown>,
  testControl: Type<unknown>,
  testComponent: Type<unknown>,
  wrapperClass: string
): void {
  describe('wrapper in container', () => {
    let fixture: ComponentFixture<unknown>;
    let wrapper: DebugElement;
    let wrapperEl: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrIcon, ClrCommonFormsModule, FormsModule],
        declarations: [testContainer, testWrapper, testControl, testComponent],
        providers: [NgControlService, LayoutService],
      });
      fixture = TestBed.createComponent(testComponent);

      wrapper = fixture.debugElement.query(By.directive(testWrapper));
      wrapperEl = wrapper.nativeElement;
      fixture.detectChanges();
    });

    it('does not add the wrapper class inside a container', () => {
      expect(wrapperEl.classList).toContain(wrapperClass);
    });
  });
}
