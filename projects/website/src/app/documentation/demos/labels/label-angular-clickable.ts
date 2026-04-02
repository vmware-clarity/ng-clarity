/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrLabel } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const HTML_EXAMPLE = `
<h6>Outlined</h6>
<clr-label clrText="Seattle" [clrClickable]="true"></clr-label>
<clr-label clrText="Austin" clrColor="purple" [clrClickable]="true"></clr-label>
<clr-label clrText="New York" clrColor="blue" [clrClickable]="true"></clr-label>
<clr-label clrText="Palo Alto" clrColor="orange" [clrClickable]="true"></clr-label>
<clr-label clrText="San Francisco" clrColor="light-blue" [clrClickable]="true"></clr-label>
<clr-label
  clrText="Disabled"
  clrColor="light-blue"
  [clrClickable]="true"
  [clrDisabled]="true"
></clr-label>
<h6>Solid</h6>
<clr-label clrText="Seattle" clrType="solid" [clrClickable]="true"></clr-label>
<clr-label clrText="Austin" clrColor="purple" clrType="solid" [clrClickable]="true"></clr-label>
<clr-label clrText="New York" clrColor="blue" clrType="solid" [clrClickable]="true"></clr-label>
<clr-label clrText="Palo Alto" clrColor="orange" clrType="solid" [clrClickable]="true"></clr-label>
<clr-label
  clrText="San Francisco"
  clrColor="light-blue"
  clrType="solid"
  [clrClickable]="true"
></clr-label>
<clr-label
  clrText="Disabled"
  clrColor="light-blue"
  clrType="solid"
  [clrClickable]="true"
  [clrDisabled]="true"
></clr-label>
`;

@Component({
  selector: 'clr-label-angular-clickable-demo',
  templateUrl: './label-angular-clickable.demo.html',
  imports: [ClrLabel, StackblitzExampleComponent],
})
export class LabelAngularClickableDemo {
  htmlExample = HTML_EXAMPLE;
}
