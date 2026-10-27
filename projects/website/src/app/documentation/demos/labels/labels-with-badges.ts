/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { LABEL_EXAMPLES } from '@clr/examples/label';

import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-labels-with-badges-demo',
  templateUrl: './labels-with-badges.demo.html',
  imports: [DocExampleComponent],
})
export class LabelsWithBadgesDemo {
  readonly examples = LABEL_EXAMPLES;
}
