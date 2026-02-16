/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { CSS_EXAMPLE } from './grid-css-example';

const EXAMPLE = `
<div class="clr-row clr-example clr-align-items-start">
  <div class="clr-col">
    <span>1/2</span>
  </div>
  <div class="clr-col">
    <span>1/2</span>
  </div>
</div>
`;

const EXAMPLE1 = `
<div class="clr-row clr-example clr-align-items-center">
  <div class="clr-col">
    <span>1/2</span>
  </div>
  <div class="clr-col">
    <span>1/2</span>
  </div>
</div>
`;

const EXAMPLE2 = `
<div class="clr-row clr-example clr-align-items-end">
  <div class="clr-col">
    <span>1/2</span>
  </div>
  <div class="clr-col">
    <span>1/2</span>
  </div>
</div>
`;

const CSS_EXAMPLE_2 = `
.clr-example {
  height: 5.4rem;
  background: hsl(206, 25%, 25%);
  margin: 0.3rem 0;
}
`;

@Component({
  selector: 'clr-grid-demo-vertical-alignment',
  templateUrl: './grid-items-vertical-alignment.html',
  styleUrl: './grid.demo.scss',
  standalone: false,
})
export class GridItemsVerticalAlignmentDemo {
  example = EXAMPLE;
  example1 = EXAMPLE1;
  example2 = EXAMPLE2;
  cssExample = `${CSS_EXAMPLE}${CSS_EXAMPLE_2}`;
}
