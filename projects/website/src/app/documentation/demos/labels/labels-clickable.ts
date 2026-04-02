/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<h6>Outlined</h6>
<a href="javascript://" class="label label-purple clickable">Austin</a>
<a href="javascript://" class="label label-blue clickable">New York</a>
<a href="javascript://" class="label label-orange clickable">Palo Alto</a>
<a href="javascript://" class="label label-light-blue clickable">San Francisco</a>
<a href="javascript://" class="label clickable">Seattle</a>
<a href="javascript://" class="label clickable disabled">Disabled</a>
<h6>Solid</h6>
<a href="javascript://" class="label solid label-purple clickable">Austin</a>
<a href="javascript://" class="label solid label-blue clickable">New York</a>
<a href="javascript://" class="label solid label-orange clickable">Palo Alto</a>
<a href="javascript://" class="label solid label-light-blue clickable">San Francisco</a>
<a href="javascript://" class="label solid clickable">Seattle</a>
<a href="javascript://" class="label solid clickable disabled">Disabled</a>
`;

@Component({
  selector: 'clr-labels-clickable-demo',
  templateUrl: './labels-clickable.demo.html',
  imports: [StackblitzExampleComponent],
})
export class LabelsClickableDemo {
  example = EXAMPLE;
}
