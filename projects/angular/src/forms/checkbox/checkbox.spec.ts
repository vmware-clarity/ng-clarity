/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ControlStandaloneSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';
import { ClrCheckbox } from './checkbox';
import { ClrCheckboxWrapper } from './checkbox-wrapper';

@Component({
  template: `<input type="checkbox" clrCheckbox />`,
  standalone: false,
})
class StandaloneUseTest {}

@Component({
  template: `<input type="checkbox" clrCheckbox name="model" class="test-class" [(ngModel)]="model" />`,
  standalone: false,
})
class TemplateDrivenTest {}

@Component({
  template: `
    <form [formGroup]="example">
      <input type="checkbox" clrCheckbox name="model" class="test-class" formControlName="model" />
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
  describe('ClrCheckbox directive', () => {
    ControlStandaloneSpec(StandaloneUseTest);
    TemplateDrivenSpec(ClrCheckboxWrapper, ClrCheckbox, TemplateDrivenTest, 'clr-checkbox');
    ReactiveSpec(ClrCheckboxWrapper, ClrCheckbox, ReactiveTest, 'clr-checkbox');
  });
}
