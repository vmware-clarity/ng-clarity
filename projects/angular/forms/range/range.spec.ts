/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ClrRange } from './range';
import { ClrRangeContainer } from './range-container';
import { ControlStandaloneSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';

@Component({
  template: `<input type="text" clrRange />`,
  standalone: false,
})
class StandaloneUseTest {}

@Component({
  template: `<input clrRange name="model" class="test-class" [(ngModel)]="model" />`,
  standalone: false,
})
class TemplateDrivenTest {}

@Component({
  template: `
    <div [formGroup]="example">
      <input clrRange name="model" class="test-class" formControlName="model" />
    </div>
  `,
  standalone: false,
})
class ReactiveTest {
  example = new FormGroup({
    model: new FormControl('', Validators.required),
  });
}

export default function (): void {
  describe('Range directive', () => {
    ControlStandaloneSpec(StandaloneUseTest);
    TemplateDrivenSpec(ClrRangeContainer, ClrRange, TemplateDrivenTest, 'clr-range');
    ReactiveSpec(ClrRangeContainer, ClrRange, ReactiveTest, 'clr-range');
  });
}
