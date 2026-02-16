/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const basicHTML = `
<form clrForm>
  <clr-datalist-container>
    <input clrDatalistInput [(ngModel)]="value" placeholder="No label" name="Option" />
    <datalist>
      <option *ngFor="let item of items" [value]="item"></option>
    </datalist>
  </clr-datalist-container>
</form>
`;

const basicTS = `
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
  items: string[] = ['Item1', 'Item2', 'Item3'];
  value = '';
}
`;

@Component({
  selector: 'clr-datalist-basic-demo',
  templateUrl: './datalist-basic.demo.html',
  standalone: false,
})
export class DatalistBasicDemo {
  basicHTML = basicHTML;
  basicTS = basicTS;

  disabled = false;
  items: string[] = ['Item1', 'Item2', 'Item3'];
  value = '';
}
