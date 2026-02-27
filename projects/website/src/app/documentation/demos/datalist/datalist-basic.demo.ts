/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrCommonFormsModule, ClrDatalistModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const basicHTML = `
<form clrForm>
  <clr-datalist-container>
    <input clrDatalistInput [(ngModel)]="value" placeholder="No label" name="Option" />
    <datalist>
      @for (item of items; track item) {
        <option [value]="item"></option>
      }
    </datalist>
  </clr-datalist-container>
</form>
`;

const basicTS = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [FormsModule, ClrFormsModule],
})
export class ExampleComponent {
  items: string[] = ['Item1', 'Item2', 'Item3'];
  value = '';
}
`;

@Component({
  selector: 'clr-datalist-basic-demo',
  templateUrl: './datalist-basic.demo.html',
  imports: [FormsModule, ClrCommonFormsModule, ClrDatalistModule, StackblitzExampleComponent],
})
export class DatalistBasicDemo {
  basicHTML = basicHTML;
  basicTS = basicTS;

  disabled = false;
  items: string[] = ['Item1', 'Item2', 'Item3'];
  value = '';
}
