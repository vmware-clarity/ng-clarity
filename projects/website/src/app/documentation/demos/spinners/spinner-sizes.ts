/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgComponentOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { SPINNER_EXAMPLES } from '@clr/examples/spinner';

import { AnimatedExampleComponent } from '../../../shared/animated-example/animated-example.component';
import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-spinner-sizes',
  templateUrl: './spinner-sizes.html',
  styleUrl: './spinner.demo.scss',
  imports: [AnimatedExampleComponent, DocExampleComponent, NgComponentOutlet],
})
export class SpinnerSizesDemo {
  readonly examples = SPINNER_EXAMPLES;
}
