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
<clr-label clrColor="danger" clrText="Austin" clrBadgeText="15" [clrClickable]="true"></clr-label>
<clr-label clrColor="info" clrText="New York" clrBadgeText="33" [clrClickable]="true"></clr-label>
<clr-label clrColor="success" clrText="Palo Alto" clrBadgeText="99+" [clrClickable]="true"></clr-label>
<clr-label
  clrColor="warning"
  clrText="San Francisco"
  clrBadgeText="67"
  [clrClickable]="true"
></clr-label>
<clr-label
  clrColor="warning"
  clrText="Disabled"
  clrBadgeText="67"
  [clrClickable]="true"
  [clrDisabled]="true"
></clr-label>

<h6>Solid</h6>
<clr-label clrColor="danger" clrText="Austin" clrBadgeText="15" [clrClickable]="true"></clr-label>
<clr-label clrColor="info" clrText="New York" clrBadgeText="33" [clrClickable]="true"></clr-label>
<clr-label clrColor="success" clrText="Palo Alto" clrBadgeText="99+" [clrClickable]="true"></clr-label>
<clr-label
  clrColor="warning"
  clrType="solid"
  clrText="San Francisco"
  clrBadgeText="67"
  [clrClickable]="true"
></clr-label>
<clr-label
  clrColor="warning"
  clrType="solid"
  clrText="Disabled"
  clrBadgeText="67"
  [clrClickable]="true"
  [clrDisabled]="true"
></clr-label>
`;

@Component({
  selector: 'clr-label-angular-status-demo',
  templateUrl: './label-angular-status.demo.html',
  imports: [ClrLabel, StackblitzExampleComponent],
})
export class LabelAngularStatusDemo {
  htmlExample = HTML_EXAMPLE;
}
