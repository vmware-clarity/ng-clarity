/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ControlStandaloneSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';
import { ClrFileInput } from './file-input';
import { ClrFileInputContainer } from './file-input-container';

@Component({
  template: `<input type="file" clrFileInput />`,
})
class StandaloneUseTest {}

@Component({
  template: `
    <form [formGroup]="form">
      <clr-file-input-container>
        <input class="test-class" type="file" clrFileInput formControlName="model" />
      </clr-file-input-container>
    </form>
  `,
})
class ReactiveTest {
  form = new FormGroup({
    model: new FormControl('', Validators.required),
  });
}

@Component({
  template: `
    <clr-file-input-container>
      <input class="test-class" type="file" clrFileInput name="model" [(ngModel)]="model" />
    </clr-file-input-container>
  `,
})
class TemplateDrivenTest {
  model: string;
}

describe('ClrFileInput', () => {
  ControlStandaloneSpec(StandaloneUseTest);
  ReactiveSpec(ClrFileInputContainer, ClrFileInput, ReactiveTest, 'clr-file-input');
  TemplateDrivenSpec(ClrFileInputContainer, ClrFileInput, TemplateDrivenTest, 'clr-file-input');
});
