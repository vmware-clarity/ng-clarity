/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ControlStandaloneSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';
import { ClrControl } from './control';
import { ClrControlContainer } from './control-container';

@Component({
  template: `<input type="text" clrControl />`,
  standalone: false,
})
class StandaloneUseTest {}

@Component({
  template: `<input clrControl name="model" class="test-class" [(ngModel)]="model" />`,
  standalone: false,
})
class TemplateDrivenTest {
  model;
}

@Component({
  template: `
    <div [formGroup]="example">
      <input clrControl name="model" class="test-class" formControlName="model" />
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
  describe('Input directive', () => {
    ControlStandaloneSpec(StandaloneUseTest);
    TemplateDrivenSpec(ClrControlContainer, ClrControl, TemplateDrivenTest, 'clr-input');
    ReactiveSpec(ClrControlContainer, ClrControl, ReactiveTest, 'clr-input');
  });
}
