/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DebugElement, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  ClrCommonFormsModule,
  ControlClassService,
  ControlIdService,
  LayoutService,
  MarkControlService,
  NgControlService,
  WrappedFormControl,
} from '@clr/angular/forms/common';
import { DatalistIdService } from '@clr/angular/forms/datalist';
import { selectFiles } from '@clr/angular/forms/file-input';
import { ClrIcon } from '@clr/angular/icon';

export function ControlStandaloneSpec(testComponent: Type<unknown>): void {
  describe('standalone use', () => {
    it('should not throw an error when used without a form control', () => {
      TestBed.configureTestingModule({
        imports: [ClrIcon, ClrCommonFormsModule],
        declarations: [testComponent],
      });
      expect(() => {
        const fixture = TestBed.createComponent(testComponent);
        fixture.detectChanges();
      }).not.toThrow();
    });
  });
}

export function TemplateDrivenSpec(
  testContainer: Type<unknown>,
  testControl: Type<WrappedFormControl<unknown>>,
  testComponent: Type<unknown>,
  controlClass: string
): void {
  fullTest('template-driven', testContainer, testControl, testComponent, controlClass);
}

export function ReactiveSpec(
  testContainer: Type<unknown>,
  testControl: Type<WrappedFormControl<unknown>>,
  testComponent: Type<unknown>,
  controlClass: string
): void {
  fullTest('reactive', testContainer, testControl, testComponent, controlClass);
}

function fullTest(
  description: string,
  testContainer: Type<unknown>,
  testControl: Type<WrappedFormControl<unknown>>,
  testComponent: Type<unknown>,
  controlClass: string
) {
  describe(description, () => {
    let control: DebugElement;
    let fixture: ComponentFixture<unknown>;
    let controlClassService: ControlClassService;
    let markControlService: MarkControlService;
    let controlIdService: ControlIdService;
    let datalistIdService: DatalistIdService;

    beforeEach(() => {
      spyOn(WrappedFormControl.prototype, 'ngOnInit').and.callThrough();
      spyOn(ControlClassService.prototype, 'initControlClass').and.callThrough();
      TestBed.configureTestingModule({
        imports: [FormsModule, ClrIcon, ClrCommonFormsModule, ReactiveFormsModule],
        declarations: [testContainer, testControl, testComponent],
        providers: [
          NgControlService,
          ControlIdService,
          ControlClassService,
          MarkControlService,
          LayoutService,
          DatalistIdService,
        ],
      });
      fixture = TestBed.createComponent(testComponent);
      control = fixture.debugElement.query(By.directive(testControl));
      controlClassService = control.injector.get(ControlClassService);
      markControlService = control.injector.get(MarkControlService);
      controlIdService = control.injector.get(ControlIdService);
      datalistIdService = control.injector.get(DatalistIdService);
      fixture.detectChanges();
    });

    it('should have the ControlIdService', () => {
      expect(controlIdService).toBeTruthy();
    });

    it('should have the DatalistIdService', () => {
      expect(datalistIdService).toBeTruthy();
    });

    it(`should apply the ${controlClass} class`, () => {
      expect(control.nativeElement.classList.contains(controlClass));
    });

    it('should have the MarkControlService', () => {
      expect(markControlService.markAsTouched).toBeTruthy();
    });

    it('correctly extends WrappedFormControl', () => {
      expect(control.injector.get(testControl)['wrapperType']).toBe(testContainer);
      expect(testControl.prototype instanceof WrappedFormControl).toBeTrue();
    });

    it('should set the class on the control with ControlClassService', () => {
      expect(controlClassService).toBeTruthy();
      expect(controlClassService.initControlClass).toHaveBeenCalled();
      expect(controlClassService.className).toEqual('');
    });

    it('should handle blur events', () => {
      spyOn<any>(testControl.prototype, 'triggerValidation').and.callThrough();

      // control must be both invalid and blurred to register the validity
      if (control.nativeElement.type === 'file') {
        selectFiles(control.nativeElement, [new File([''], 'test.txt')]);
      } else {
        control.nativeElement.value = 'abc';
        control.nativeElement.dispatchEvent(new Event('input'));
      }

      control.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(testControl.prototype.triggerValidation).toHaveBeenCalled();
    });

    it('should have the MarkControlService', () => {
      expect(markControlService.markAsTouched).toBeTruthy();
    });
  });
}
