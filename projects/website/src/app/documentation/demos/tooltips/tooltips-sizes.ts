/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TOOLTIP_EXAMPLES } from '@clr/examples/tooltip';

import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-tooltips-sizes-demo',
  templateUrl: './tooltips-sizes.html',
  imports: [DocExampleComponent],
})
export class TooltipsSizesDemo {
  readonly examples = TOOLTIP_EXAMPLES;
}
