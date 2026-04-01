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
<clr-label clrText="Seattle (Default color)"></clr-label>
<clr-label clrText="Austin" clrColor="purple"></clr-label>
<clr-label clrText="New York" clrColor="blue"></clr-label>
<clr-label clrText="Palo Alto" clrColor="orange"></clr-label>
<clr-label clrText="San Francisco" clrColor="light-blue"></clr-label>
<clr-label clrText="Sofia" clrColor="gray"></clr-label>
<div>Status Colors</div>
<clr-label clrColor="danger" clrText="Austin"></clr-label>
<clr-label clrColor="info" clrText="New York"></clr-label>
<clr-label clrColor="success" clrText="Palo Alto"></clr-label>
<clr-label clrColor="warning" clrText="San Francisco"></clr-label>
`;

@Component({
  selector: 'clr-label-angular-colors-demo',
  templateUrl: './label-angular-colors.demo.html',
  imports: [ClrLabel, StackblitzExampleComponent],
})
export class LabelAngularColorsDemo {
  htmlExample = HTML_EXAMPLE;
}
