/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { PROGRESS_BAR_EXAMPLES } from '@clr/examples/progress-bar';

import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-progress-bar-static-demo',
  templateUrl: './progress-bar-static.html',
  imports: [DocExampleComponent],
})
export class ProgressBarStaticDemo {
  readonly examples = PROGRESS_BAR_EXAMPLES;
}
