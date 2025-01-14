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
import { ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';
import { ClrNumberInput } from './number-input';
import { ClrNumberInputContainer } from './number-input-container';

@Component({
  template: `<input clrNumberInput type="number" />`,
})
class InvalidUseTest {}

@Component({
  template: `
    <clr-number-input-container>
      <input clrNumberInput type="number" name="model" class="test-class" [(ngModel)]="model" />
    </clr-number-input-container>
  `,
})
class TemplateDrivenTest {}

@Component({
  template: `
    <div [formGroup]="example">
      <clr-number-input-container>
        <input clrNumberInput type="number" name="model" class="test-class" formControlName="model" />
      </clr-number-input-container>
    </div>
  `,
})
class ReactiveTest {
  example = new FormGroup({
    model: new FormControl('', Validators.required),
  });
}

export default function (): void {
  describe('Input directive', () => {
    describe('invalid use', () => {
      it('should throw an error when used without a number-input container', () => {
        TestBed.configureTestingModule({
          imports: [ClrNumberInput],
          declarations: [InvalidUseTest],
        });
        expect(() => {
          const fixture = TestBed.createComponent(InvalidUseTest);
          fixture.detectChanges();
        }).toThrow();
      });
    });
    TemplateDrivenSpec(ClrNumberInputContainer, ClrNumberInput, TemplateDrivenTest, 'clr-number-input');
    ReactiveSpec(ClrNumberInputContainer, ClrNumberInput, ReactiveTest, 'clr-number-input');
    inputSpec('tempate-driven', ClrNumberInputContainer, ClrNumberInput, TemplateDrivenTest);
    inputSpec('reactive', ClrNumberInputContainer, ClrNumberInput, ReactiveTest);
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
      control.nativeElement.value = 123;

      control.nativeElement.dispatchEvent(new Event('input'));
      control.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(valueChanges).toBe(1);
    });
  });
}
