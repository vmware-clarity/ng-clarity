/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgComponentOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { APP_LAYOUT_EXAMPLES } from '@clr/examples/app-layout';

import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-layout-all-demo',
  templateUrl: './layout-all.html',
  styleUrl: './layout.demo.scss',
  imports: [DocExampleComponent, NgComponentOutlet],
})
export class LayoutAllDemo {
  readonly showCode = input(false);
  readonly examples = APP_LAYOUT_EXAMPLES;
}
