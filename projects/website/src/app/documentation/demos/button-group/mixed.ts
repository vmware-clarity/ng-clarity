/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { BUTTON_GROUP_EXAMPLES } from '@clr/examples/button-group';

import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-button-group-mixed-demo',
  templateUrl: './mixed.html',
  imports: [DocExampleComponent],
})
export class MixedButtonGroupDemo {
  readonly examples = BUTTON_GROUP_EXAMPLES;
}
