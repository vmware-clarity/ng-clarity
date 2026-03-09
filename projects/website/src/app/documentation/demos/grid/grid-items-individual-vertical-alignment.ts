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
<div class="clr-row clr-example">
  <div class="clr-col clr-align-self-start">
    <span>1/3</span>
  </div>
  <div class="clr-col clr-align-self-center">
    <span>1/3</span>
  </div>
  <div class="clr-col clr-align-self-end">
    <span>1/3</span>
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
  selector: 'clr-grid-demo-individual-vertical-alignment',
  templateUrl: './grid-items-individual-vertical-alignment.html',
  styleUrl: './grid.demo.scss',
  imports: [StackblitzExampleComponent],
})
export class GridItemsIndividualVerticalAlignmentDemo {
  example = EXAMPLE;
  cssExample = `${CSS_EXAMPLE}${CSS_EXAMPLE_2}`;
}
