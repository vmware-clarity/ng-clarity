/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ClrSelect } from './select';
import { ClrSelectContainer } from './select-container';
import { ControlStandaloneSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';

@Component({
  template: `<select clrSelect></select>`,
  standalone: false,
})
class StandaloneUseTest {}

@Component({
  template: `<select clrSelect name="model" class="test-class" [(ngModel)]="model"></select>`,
  standalone: false,
})
class TemplateDrivenTest {}

@Component({
  template: `
    <div [formGroup]="example">
      <select clrSelect name="model" class="test-class" formControlName="model"></select>
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
  describe('Select directive', () => {
    ControlStandaloneSpec(StandaloneUseTest);
    TemplateDrivenSpec(ClrSelectContainer, ClrSelect, TemplateDrivenTest, 'clr-select');
    ReactiveSpec(ClrSelectContainer, ClrSelect, ReactiveTest, 'clr-select');
  });
}
