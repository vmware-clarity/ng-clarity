/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { POPOVER_EXAMPLES } from '@clr/examples/popover';

import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-popover-fallback-positions-demo',
  templateUrl: './popover-fallback-positions.demo.html',
  imports: [DocExampleComponent],
})
export class PopoverFallbackPositionsDemo {
  readonly examples = POPOVER_EXAMPLES;
}
