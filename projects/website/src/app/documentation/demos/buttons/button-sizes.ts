/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { BUTTON_EXAMPLES } from '@clr/examples/button';

import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-buttons-demo-button-sizes',
  templateUrl: './button-sizes.html',
  styleUrl: './buttons.demo.scss',
  imports: [DocExampleComponent],
})
export class ButtonSizesDemo {
  readonly examples = BUTTON_EXAMPLES;
}
