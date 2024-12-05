/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ClrCommonFormsModule } from '../common';
import { ControlStandaloneSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';
import { ClrNumberPicker } from './number-picker';
import { ClrNumberPickerContainer } from './number-picker-container';

@Component({
  template: `<clr-number-picker></clr-number-picker>`,
})
class StandaloneUseTest {}

@Component({
  template: `<clr-number-picker name="model" class="test-class" [(ngModel)]="model"></clr-number-picker>`,
})
class TemplateDrivenTest {}

@Component({
  template: `
    <div [formGroup]="example">
      <clr-number-picker name="model" class="test-class" formControlName="model"></clr-number-picker>
    </div>
  `,
})
class ReactiveTest {
  example = new FormGroup({
    model: new FormControl('', Validators.required),
  });
}

export default function (): void {
  describe('Number picker component', () => {
    ControlStandaloneSpec(StandaloneUseTest);
    TemplateDrivenSpec(ClrNumberPickerContainer, ClrNumberPicker, TemplateDrivenTest, 'clr-input');
    ReactiveSpec(ClrNumberPickerContainer, ClrNumberPicker, ReactiveTest, 'clr-input');
    inputSpec('tempate-driven', ClrNumberPickerContainer, ClrNumberPicker, TemplateDrivenTest);
    inputSpec('reactive', ClrNumberPickerContainer, ClrNumberPicker, ReactiveTest);
  });
}

function inputSpec(description, testContainer, testControl, testComponent) {
  describe('Input specific value change tests ' + description, () => {
    let control, fixture;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, ClrCommonFormsModule, ReactiveFormsModule],
        declarations: [testContainer, testControl, testComponent],
      });
      fixture = TestBed.createComponent(testComponent);
      control = fixture.debugElement.query(By.directive(testControl));
      console.log(control);
      fixture.detectChanges();
    });

    it('should handle valueChanges calls', () => {
      // control must be both invalid and blurred to register the validity
      let valueChanges = 0;
      control.injector.get(NgControl).control.valueChanges.subscribe(() => {
        valueChanges++;
      });

      // make sure blur alone does not trigger valueChanges
      control.nativeElement.dispatchEvent(new Event('focus'));
      control.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(valueChanges).toBe(0);

      // now make sure input change triggers valueChanges
      control.nativeElement.dispatchEvent(new Event('focus'));
      control.control.nativeElement.value = '1';

      control.nativeElement.dispatchEvent(new Event('input'));
      control.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(valueChanges).toBe(1);
    });
  });
}
