/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ClrCommonFormsModule } from '../common';
import { ControlStandaloneSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';
import { ClrInput } from './input';
import { ClrInputContainer } from './input-container';

@Component({
  template: `<input type="text" clrInput />`,
})
class StandaloneUseTest {}

@Component({
  template: `<input clrInput name="model" class="test-class" [(ngModel)]="model" />`,
})
class TemplateDrivenTest {}

@Component({
  template: `
    <div [formGroup]="example">
      <input clrInput name="model" class="test-class" formControlName="model" />
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
    ControlStandaloneSpec(StandaloneUseTest);
    TemplateDrivenSpec(ClrInputContainer, ClrInput, TemplateDrivenTest, 'clr-input');
    ReactiveSpec(ClrInputContainer, ClrInput, ReactiveTest, 'clr-input');
    inputSpec('tempate-driven', ClrInputContainer, ClrInput, TemplateDrivenTest);
    inputSpec('reactive', ClrInputContainer, ClrInput, ReactiveTest);
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
      control.nativeElement.value = 'abc';

      control.nativeElement.dispatchEvent(new Event('input'));
      control.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(valueChanges).toBe(1);
    });
  });
}
