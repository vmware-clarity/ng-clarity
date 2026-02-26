/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<span class="label">Seattle</span>
<span class="label label-purple">Austin</span>
<span class="label label-blue">New York</span>
<span class="label label-orange">Palo Alto</span>
<span class="label label-light-blue">San Francisco</span>
`;

@Component({
  selector: 'clr-labels-color-options-demo',
  templateUrl: './labels-color-options.demo.html',
  imports: [StackblitzExampleComponent],
})
export class LabelsColorOptionsDemo {
  example = EXAMPLE;
}
