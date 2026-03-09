/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrIcon, ClrIconModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE1 = `
<a href="..." role="tooltip" aria-haspopup="true" class="tooltip tooltip-xs">
  <clr-icon shape="info-circle" size="24"></clr-icon>
  <span class="tooltip-content">Lorem</span>
</a>
`;
const EXAMPLE2 = `
<a href="..." role="tooltip" aria-haspopup="true" class="tooltip tooltip-sm">
  <clr-icon shape="info-circle" size="24"></clr-icon>
  <span class="tooltip-content">Lorem</span>
</a>
`;

const EXAMPLE3 = `
<a href="..." role="tooltip" aria-haspopup="true" class="tooltip tooltip-md">
  <clr-icon shape="info-circle" size="24"></clr-icon>
  <span class="tooltip-content">Lorem</span>
</a>
`;

const EXAMPLE4 = `
<a href="..." role="tooltip" aria-haspopup="true" class="tooltip tooltip-lg">
  <clr-icon shape="info-circle" size="24"></clr-icon>
  <span class="tooltip-content">Lorem</span>
</a>
`;

@Component({
  selector: 'clr-tooltips-sizes-demo',
  styleUrl: './tooltips.demo.scss',
  templateUrl: './tooltips-sizes.html',
  imports: [ClrIcon, ClrIconModule, StackblitzExampleComponent],
})
export class TooltipsSizesDemo {
  example1 = EXAMPLE1;
  example2 = EXAMPLE2;
  example3 = EXAMPLE3;
  example4 = EXAMPLE4;
}
