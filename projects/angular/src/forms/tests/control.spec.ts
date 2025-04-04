/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ClrIconModule } from '../../icon/icon.module';
import { ClrCommonFormsModule } from '../common/common.module';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { LayoutService } from '../common/providers/layout.service';
import { MarkControlService } from '../common/providers/mark-control.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { WrappedFormControl } from '../common/wrapped-control';
import { DatalistIdService } from '../datalist/providers/datalist-id.service';
import { selectFiles } from '../file-input/file-input.helpers';

export function ControlStandaloneSpec(testComponent): void {
  describe('standalone use', () => {
    it('should not throw an error when used without a form control', () => {
      TestBed.configureTestingModule({
        imports: [ClrIconModule, ClrCommonFormsModule],
        declarations: [testComponent],
      });
      expect(() => {
        const fixture = TestBed.createComponent(testComponent);
        fixture.detectChanges();
      }).not.toThrow();
    });
  });
}

export function TemplateDrivenSpec(testContainer, testControl, testComponent, controlClass): void {
  fullTest('template-driven', testContainer, testControl, testComponent, controlClass);
}

export function ReactiveSpec(testContainer, testControl, testComponent, controlClass): void {
  fullTest('reactive', testContainer, testControl, testComponent, controlClass);
}

function fullTest(description, testContainer, testControl, testComponent, controlClass) {
  describe(description, () => {
    let control,
      fixture,
      ifControlStateService,
      controlClassService,
      markControlService,
      controlIdService,
      datalistIdService;

    beforeEach(() => {
      spyOn(WrappedFormControl.prototype, 'ngOnInit');
      spyOn(ControlClassService.prototype, 'initControlClass').and.callThrough();
      TestBed.configureTestingModule({
        imports: [FormsModule, ClrIconModule, ClrCommonFormsModule, ReactiveFormsModule],
        declarations: [testContainer, testControl, testComponent],
        providers: [
          IfControlStateService,
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
      ifControlStateService = control.injector.get(IfControlStateService);
      markControlService = control.injector.get(MarkControlService);
      controlIdService = control.injector.get(ControlIdService);
      datalistIdService = control.injector.get(DatalistIdService);
      spyOn(ifControlStateService, 'triggerStatusChange');
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

    it('should have the IfControlStateService', () => {
      expect(ifControlStateService).toBeTruthy();
    });

    it('should have the MarkControlService', () => {
      expect(markControlService.markAsTouched).toBeTruthy();
    });

    it('correctly extends WrappedFormControl', () => {
      expect(control.injector.get(testControl).wrapperType).toBe(testContainer);
      expect(testControl.prototype instanceof WrappedFormControl).toBeTrue();
    });

    it('should set the class on the control with ControlClassService', () => {
      expect(controlClassService).toBeTruthy();
      expect(controlClassService.initControlClass).toHaveBeenCalled();
      expect(controlClassService.className).toEqual('test-class');
    });

    it('should handle blur events', () => {
      // control must be both invalid and blurred to register the validity
      if (control.nativeElement.type === 'file') {
        selectFiles(control.nativeElement, [new File([''], 'test.txt')]);
      } else {
        control.nativeElement.value = 'abc';
        control.nativeElement.dispatchEvent(new Event('input'));
      }

      control.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(ifControlStateService.triggerStatusChange).toHaveBeenCalled();
    });

    it('should have the MarkControlService', () => {
      expect(markControlService.markAsTouched).toBeTruthy();
    });
  });
}
