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
  <div class="clr-col clr-col-lg-2">
    <span>1 of 3</span>
  </div>
  <div class="clr-col-lg-auto">
    <span>Variable width content</span>
  </div>
  <div class="clr-col clr-col-lg-2">
    <span>3 of 3</span>
  </div>
</div>
<div class="clr-row">
  <div class="clr-col">
    <span>1 of 3</span>
  </div>
  <div class="clr-col-md-auto">
    <span>Variable Width Content</span>
  </div>
  <div class="clr-col clr-col-lg-2">
    <span>3 of 3</span>
  </div>
</div>
`;

@Component({
  selector: 'clr-grid-demo-auto-layout-3',
  templateUrl: './grid-auto-layout-3.html',
  styleUrl: './grid.demo.scss',
  standalone: false,
})
export class GridAutoLayout3Demo {
  example1 = EXAMPLE1;
  cssExample = CSS_EXAMPLE;
}
