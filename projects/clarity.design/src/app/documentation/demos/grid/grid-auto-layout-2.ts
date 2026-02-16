/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { CSS_EXAMPLE } from './grid-css-example';

const EXAMPLE1 = `
<div class="clr-row">
  <div class="clr-col-4">
    <span>1/3 (fixed)</span>
  </div>
  <div class="clr-col">
    <span>Remaining</span>
  </div>
</div>
`;

const EXAMPLE2 = `
<div class="clr-row">
  <div class="clr-col">
    <span>1/4 (auto)</span>
  </div>
  <div class="clr-col-6">
    <span>1/2 (fixed)</span>
  </div>
  <div class="clr-col">
    <span>1/4 (auto)</span>
  </div>
</div>
`;

@Component({
  selector: 'clr-grid-demo-auto-layout-2',
  templateUrl: './grid-auto-layout-2.html',
  styleUrl: './grid.demo.scss',
  standalone: false,
})
export class GridAutoLayout2Demo {
  example1 = EXAMPLE1;
  example2 = EXAMPLE2;
  cssExample = CSS_EXAMPLE;
}
