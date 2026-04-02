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
<clr-label clrText="Austin" clrColor="purple" clrBadgeText="1" [clrClickable]="true"></clr-label>
<clr-label clrText="New York" clrColor="blue" clrBadgeText="2" [clrClickable]="true"></clr-label>
<clr-label clrText="Palo Alto" clrColor="orange" clrBadgeText="3" [clrClickable]="true"></clr-label>
<clr-label
  clrText="San Francisco"
  clrColor="light-blue"
  clrBadgeText="12"
  [clrClickable]="true"
></clr-label>
<clr-label clrText="Seattle" clrBadgeText="15" [clrClickable]="true"></clr-label>
<clr-label clrText="Disabled" clrBadgeText="15" [clrClickable]="true" [clrDisabled]="true"></clr-label>
<h6>Solid</h6>
<clr-label
  clrText="Austin"
  clrColor="purple"
  clrBadgeText="1"
  [clrType]="'solid'"
  [clrClickable]="true"
></clr-label>
<clr-label
  clrText="New York"
  clrColor="blue"
  clrBadgeText="2"
  [clrType]="'solid'"
  [clrClickable]="true"
></clr-label>
<clr-label
  clrText="Palo Alto"
  clrColor="orange"
  clrBadgeText="3"
  [clrType]="'solid'"
  [clrClickable]="true"
></clr-label>
<clr-label
  clrText="San Francisco"
  clrColor="light-blue"
  clrBadgeText="12"
  [clrType]="'solid'"
  [clrClickable]="true"
></clr-label>
<clr-label clrText="Seattle" clrBadgeText="15" [clrType]="'solid'" [clrClickable]="true"></clr-label>
<clr-label
  clrText="Disabled"
  clrBadgeText="15"
  [clrType]="'solid'"
  [clrClickable]="true"
  [clrDisabled]="true"
></clr-label>
`;

@Component({
  selector: 'clr-label-angular-with-badges-demo',
  templateUrl: './label-angular-with-badges.demo.html',
  imports: [ClrLabel, StackblitzExampleComponent],
})
export class LabelAngularWithBadgesDemo {
  htmlExample = HTML_EXAMPLE;
}
