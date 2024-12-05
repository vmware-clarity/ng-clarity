/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ContainerNoLabelSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/container.spec';
import { ClrNumberPicker } from './number-picker';
import { ClrNumberPickerContainer } from './number-picker-container';

@Component({
  template: `
    <clr-number-picker-container>
      <label>Hello World</label>
      <clr-number-picker required [(ngModel)]="model" name="model" [disabled]="disabled"></clr-number-picker>
      <clr-control-helper>Helper text</clr-control-helper>
      <clr-control-error>Must be at least 5 characters</clr-control-error>
      <clr-control-success>Valid</clr-control-success>
    </clr-number-picker-container>
  `,
})
class SimpleTest {
  disabled = false;
  model = '';
}

@Component({
  template: `
    <clr-number-picker-container>
      <clr-number-picker name="model" [(ngModel)]="model"></clr-number-picker>
      <clr-control-helper>Helper text</clr-control-helper>
    </clr-number-picker-container>
  `,
})
class NoLabelTest {
  model;
}

@Component({
  template: `
    <form [formGroup]="form">
      <clr-number-picker-container>
        <label>Hello World</label>
        <clr-number-picker name="model" formControlName="model"></clr-number-picker>
        <clr-control-helper>Helper text</clr-control-helper>
        <clr-control-error>Must be at least 5 characters</clr-control-error>
        <clr-control-success>Valid</clr-control-success>
      </clr-number-picker-container>
    </form>
  `,
})
class ReactiveTest {
  disabled = false;
  form = new FormGroup({
    model: new FormControl({ value: '', disabled: this.disabled }, Validators.required),
  });
}

export default function (): void {
  describe('ClrNumberPicker', () => {
    ContainerNoLabelSpec(ClrNumberPickerContainer, ClrNumberPicker, NoLabelTest);
    TemplateDrivenSpec(
      ClrNumberPickerContainer,
      ClrNumberPicker,
      SimpleTest,
      '.clr-number-picker-wrapper input[type="number"]'
    );
    ReactiveSpec(
      ClrNumberPickerContainer,
      ClrNumberPicker,
      ReactiveTest,
      '.clr-number-picker-wrapper  input[type="number"]'
    );
  });
}
