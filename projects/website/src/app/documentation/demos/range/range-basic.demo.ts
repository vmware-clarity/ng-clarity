/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrCommonFormsModule, ClrRangeModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const basicExample = `
<form clrForm>
  <clr-range-container [clrRangeHasProgress]="true">
    <input type="range" clrRange name="two" [(ngModel)]="input.one" />
  </clr-range-container>
</form>
`;
const fullExample = `
<form clrForm>
  <clr-range-container [clrRangeHasProgress]="true">
    <label>Full example</label>
    <input type="range" clrRange [(ngModel)]="input.two" name="three" />
    <clr-control-helper>Helper text</clr-control-helper>
  </clr-range-container>
</form>
`;
const disabledExample = `
<form clrForm>
  <clr-range-container [clrRangeHasProgress]="true">
    <label>Disabled</label>
    <input type="range" clrRange [(ngModel)]="input.three" name="four" [disabled]="disabled" />
    <clr-control-helper>Helper text</clr-control-helper>
  </clr-range-container>
</form>
`;

const rangeChangeHTML = `
<form clrForm>
  <clr-range-container [clrRangeHasProgress]="true">
    <label>Value change example</label>
    <input type="range" clrRange [(ngModel)]="rangeInput" name="three" (change)="rangeChange($event)" />
    <clr-control-helper>Helper text</clr-control-helper>
  </clr-range-container>
</form>
`;

const CODE1 = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ClarityModule, FormsModule],
})
export class ExampleComponent {
  input = {
    one: 31,
    two: 36,
    three: 92,
  };
}
`;

const CODE2 = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ClarityModule, FormsModule],
})
export class ExampleComponent {
  rangeInput = 36;

  rangeChange(event: any) {
    console.log(event.target.value);
  }
}
`;

@Component({
  selector: 'clr-range-basic-demo',
  templateUrl: './range-basic.demo.html',
  imports: [FormsModule, ClrCommonFormsModule, ClrRangeModule, StackblitzExampleComponent],
})
export class RangeBasicDemo {
  basicExample = basicExample;
  fullExample = fullExample;
  disabledExample = disabledExample;
  rangeChangeHTML = rangeChangeHTML;

  disabled = true;
  input = {
    one: 31,
    two: 36,
    three: 92,
  };

  code = CODE1;
  code2 = CODE2;

  rangeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log(target.value);
  }
}
