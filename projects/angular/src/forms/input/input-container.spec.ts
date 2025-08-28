/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ContainerNoLabelSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/container.spec';
import { ClrInput } from './input';
import { ClrInputContainer } from './input-container';

@Component({
  template: `
    <clr-input-container>
      <input name="model" clrInput required [(ngModel)]="model" [disabled]="disabled" />
      <label>Hello World</label>
      <clr-control-helper>Helper text</clr-control-helper>
      <clr-control-error>Must be at least 5 characters</clr-control-error>
      <clr-control-success>Valid</clr-control-success>
    </clr-input-container>
  `,
  standalone: false,
})
class SimpleTest {
  disabled = false;
  model = '';
}

@Component({
  template: `
    <clr-input-container>
      <input clrInput name="model" [(ngModel)]="model" />
      <clr-control-helper>Helper text</clr-control-helper>
    </clr-input-container>
  `,
  standalone: false,
})
class NoLabelTest {
  model;
}

@Component({
  template: `
    <form [formGroup]="form">
      <clr-input-container>
        <input clrInput formControlName="model" />
        <label>Hello World</label>
        <clr-control-helper>Helper text</clr-control-helper>
        <clr-control-error>Must be at least 5 characters</clr-control-error>
        <clr-control-success>Valid</clr-control-success>
      </clr-input-container>
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
  describe('ClrInputContainer', () => {
    ContainerNoLabelSpec(ClrInputContainer, ClrInput, NoLabelTest);
    TemplateDrivenSpec(ClrInputContainer, ClrInput, SimpleTest, '.clr-input-wrapper [clrInput]');
    ReactiveSpec(ClrInputContainer, ClrInput, ReactiveTest, '.clr-input-wrapper [clrInput]');
  });
}
