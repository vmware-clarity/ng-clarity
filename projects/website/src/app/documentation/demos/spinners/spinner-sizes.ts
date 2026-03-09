/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { AnimatedExampleComponent } from '../../../shared/animated-example/animated-example.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `<span class="spinner spinner-sm">Loading...</span>`;

const EXAMPLE1 = `<span class="spinner spinner-md">Loading...</span>`;

const EXAMPLE2 = `<span class="spinner spinner-lg">Loading...</span>`;

@Component({
  selector: 'clr-spinner-sizes',
  templateUrl: './spinner-sizes.html',
  styleUrl: './spinner.demo.scss',
  imports: [AnimatedExampleComponent, StackblitzExampleComponent],
})
export class SpinnerSizesDemo {
  example = EXAMPLE;
  example1 = EXAMPLE1;
  example2 = EXAMPLE2;
}
