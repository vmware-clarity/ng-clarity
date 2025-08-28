/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ContainerNoLabelSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/container.spec';
import { ClrNumberInput } from './number-input';
import { ClrNumberInputContainer } from './number-input-container';

@Component({
  template: `
    <clr-number-input-container>
      <input name="model" clrNumberInput type="number" required [(ngModel)]="model" [disabled]="disabled" />
      <label>Hello World</label>
      <clr-control-helper>Helper text</clr-control-helper>
      <clr-control-error>Invalid</clr-control-error>
      <clr-control-success>Valid</clr-control-success>
    </clr-number-input-container>
  `,
  standalone: false,
})
class SimpleTest {
  disabled = false;
  model = '';
}

@Component({
  template: `
    <clr-number-input-container>
      <input clrNumberInput type="number" name="model" [(ngModel)]="model" />
      <clr-control-helper>Helper text</clr-control-helper>
    </clr-number-input-container>
  `,
  standalone: false,
})
class NoLabelTest {
  model;
}

@Component({
  template: `
    <form [formGroup]="form">
      <clr-number-input-container>
        <input clrNumberInput type="number" formControlName="model" />
        <label>Hello World</label>
        <clr-control-helper>Helper text</clr-control-helper>
        <clr-control-error>Invalid</clr-control-error>
        <clr-control-success>Valid</clr-control-success>
      </clr-number-input-container>
    </form>
  `,
  standalone: false,
})
class ReactiveTest {
  disabled = false;
  form = new FormGroup({
    model: new FormControl({ value: '', disabled: this.disabled }, Validators.required),
  });
}

export default function (): void {
  describe('ClrNumberInput', () => {
    ContainerNoLabelSpec(ClrNumberInputContainer, ClrNumberInput, NoLabelTest);
    TemplateDrivenSpec(
      ClrNumberInputContainer,
      ClrNumberInput,
      SimpleTest,
      '.clr-number-input-wrapper [clrNumberInput]'
    );
    ReactiveSpec(ClrNumberInputContainer, ClrNumberInput, ReactiveTest, '.clr-number-input-wrapper  [clrNumberInput]');
  });
}
