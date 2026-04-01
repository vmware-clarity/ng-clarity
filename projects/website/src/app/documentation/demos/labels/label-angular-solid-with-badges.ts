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
<div class="clr-example">
  <clr-label
    clrText="Austin"
    clrType="solid"
    clrColor="purple"
    clrBadgeText="1"
    [clrClickable]="true"
  ></clr-label>
  <clr-label
    clrText="New York"
    clrType="solid"
    clrColor="blue"
    clrBadgeText="2"
    [clrClickable]="true"
  ></clr-label>
  <clr-label
    clrText="Palo Alto"
    clrType="solid"
    clrColor="orange"
    clrBadgeText="3"
    [clrClickable]="true"
  ></clr-label>
  <clr-label
    clrText="San Francisco"
    clrType="solid"
    clrColor="light-blue"
    clrBadgeText="12"
    [clrClickable]="true"
  ></clr-label>
  <clr-label clrText="Seattle" clrType="solid" clrBadgeText="15" [clrClickable]="true"></clr-label>
  <div>Status Colors</div>
  <clr-label
    clrColor="danger"
    clrType="solid"
    clrText="Austin"
    clrBadgeText="15"
    [clrClickable]="true"
  ></clr-label>
  <clr-label
    clrColor="info"
    clrType="solid"
    clrText="New York"
    clrBadgeText="33"
    [clrClickable]="true"
  ></clr-label>
  <clr-label
    clrColor="success"
    clrType="solid"
    clrText="Palo Alto"
    clrBadgeText="99+"
    [clrClickable]="true"
  ></clr-label>
  <clr-label
    clrColor="warning"
    clrType="solid"
    clrText="San Francisco"
    clrBadgeText="67"
    [clrClickable]="true"
  ></clr-label>
</div>
`;

@Component({
  selector: 'clr-label-angular-solid-with-badges-demo',
  templateUrl: './label-angular-solid-with-badges.demo.html',
  imports: [ClrLabel, StackblitzExampleComponent],
})
export class LabelAngularStatusDemo {
  htmlExample = HTML_EXAMPLE;
}
