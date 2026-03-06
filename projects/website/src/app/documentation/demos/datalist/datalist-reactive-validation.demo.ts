/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClrCommonFormsModule, ClrDatalistModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const reactiveHTML = `
<form clrForm [formGroup]="form">
  <clr-datalist-container>
    <label>Reactive Datalist</label>
    <input clrDatalistInput placeholder="Option" name="Option" formControlName="item" />
    <datalist>
      @for (item of items; track item) {
        <option [value]="item"></option>
      }
    </datalist>
  </clr-datalist-container>
  <button class="btn btn-primary" type="submit" [disabled]="form.invalid" (click)="submit()">
    Submit
  </button>
</form>
`;

const reactiveTS = `
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ReactiveFormsModule, ClrFormsModule],
})
export class ExampleComponent {
  items: string[] = ['Item1', 'Item2', 'Item3'];
  form = new FormGroup({
    item: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  submit() {
    console.log('Form submit', this.form.value);
  }
}
`;

@Component({
  selector: 'clr-datalist-reactive-validation-demo',
  templateUrl: './datalist-reactive-validation.demo.html',
  imports: [FormsModule, ClrCommonFormsModule, ReactiveFormsModule, ClrDatalistModule, StackblitzExampleComponent],
})
export class DatalistReactiveValidationDemo {
  reactiveHTML = reactiveHTML;
  reactiveTS = reactiveTS;

  items: string[] = ['Item1', 'Item2', 'Item3'];
  model = new FormGroup({
    item: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  submit() {
    console.log('Form submit', this.model);
  }
}
