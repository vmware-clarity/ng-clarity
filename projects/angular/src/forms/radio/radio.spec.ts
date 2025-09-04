/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ClrRadio } from './radio';
import { ClrRadioWrapper } from './radio-wrapper';
import { ControlStandaloneSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';

@Component({
  template: `<input type="radio" clrRadio />`,
  standalone: false,
})
class StandaloneUseTest {}

@Component({
  template: `<input type="radio" clrRadio name="model" class="test-class" [(ngModel)]="model" />`,
  standalone: false,
})
class TemplateDrivenTest {}

@Component({
  template: `
    <form [formGroup]="example">
      <input type="radio" clrRadio name="model" class="test-class" formControlName="model" />
    </form>
  `,
  standalone: false,
})
class ReactiveTest {
  example = new FormGroup({
    model: new FormControl('', Validators.required),
  });
}

export default function (): void {
  describe('ClrRadio directive', () => {
    ControlStandaloneSpec(StandaloneUseTest);
    TemplateDrivenSpec(ClrRadioWrapper, ClrRadio, TemplateDrivenTest, 'clr-radio');
    ReactiveSpec(ClrRadioWrapper, ClrRadio, ReactiveTest, 'clr-radio');
  });
}
