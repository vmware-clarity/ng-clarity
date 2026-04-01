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
<clr-label clrText="Seattle" clrType="solid"></clr-label>
<clr-label clrText="Austin" clrColor="purple" clrType="solid"></clr-label>
<clr-label clrText="New York" clrColor="blue" clrType="solid"></clr-label>
<clr-label clrText="Palo Alto" clrColor="orange" clrType="solid"></clr-label>
<clr-label clrText="San Francisco" clrColor="light-blue" clrType="solid"></clr-label>
`;

@Component({
  selector: 'clr-label-angular-solid-demo',
  templateUrl: './label-angular-solid.demo.html',
  imports: [ClrLabel, StackblitzExampleComponent],
})
export class LabelAngularSolidDemo {
  htmlExample = HTML_EXAMPLE;
}
