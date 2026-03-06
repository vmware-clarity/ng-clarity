/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { CSS_EXAMPLE } from './grid-css-example';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<div class="clr-row">
  <div class="clr-col-sm-12 clr-col-md-6">
    <span>clr-col-sm-12 clr-col-md-6</span>
  </div>
  <div class="clr-col-sm-12 clr-col-md-6">
    <span>clr-col-sm-12 clr-col-md-6</span>
  </div>
  <div class="clr-col-sm-12 clr-col-md-12">
    <span>clr-col-sm-12 clr-col-md-12</span>
  </div>
</div>
`;

@Component({
  selector: 'clr-grid-demo-column-stacking',
  templateUrl: './grid-column-stacking.html',
  styleUrl: './grid.demo.scss',
  imports: [StackblitzExampleComponent],
})
export class GridColumnStackingDemo {
  example = EXAMPLE;
  cssExample = CSS_EXAMPLE;
}
