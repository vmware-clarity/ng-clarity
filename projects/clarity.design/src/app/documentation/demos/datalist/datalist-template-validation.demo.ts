/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const templateHTML = `
<button class="btn btn-sm btn-primary" (click)="disabled = !disabled">Toggle Disabled</button>

<form clrForm>
  <clr-datalist-container>
    <label>Template Datalist</label>
    <input
      minlength="4"
      name="Option"
      required
      clrDatalistInput
      [disabled]="disabled"
      [(ngModel)]="value"
    />
    <datalist>
      <option *ngFor="let item of items" [value]="item"></option>
    </datalist>
    <clr-control-helper>Helper text</clr-control-helper>
    <clr-control-error>There was an error</clr-control-error>
  </clr-datalist-container>
</form>
`;

const templateTS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrFormsModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, FormsModule, ClrFormsModule],
})
export class ExampleComponent {
  disabled = false;
  items: string[] = ['Item1', 'Item2', 'Item3'];
  value = '';
}
`;

@Component({
  selector: 'clr-datalist-template-validation-demo',
  templateUrl: './datalist-template-validation.demo.html',
  standalone: false,
})
export class DatalistTemplateValidationDemo {
  templateHTML = templateHTML;
  templateTS = templateTS;

  disabled = false;
  items: string[] = ['Item1', 'Item2', 'Item3'];
  value = '';
}
