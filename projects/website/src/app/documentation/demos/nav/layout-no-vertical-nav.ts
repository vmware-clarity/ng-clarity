/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { NAVIGATION_EXAMPLES } from '@clr/examples/navigation';

import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-layout-no-vertical-nav-demo',
  templateUrl: './layout-no-vertical-nav.html',
  styleUrl: './layout.demo.scss',
  imports: [DocExampleComponent],
})
export class LayoutNoVerticalNavDemo {
  readonly examples = NAVIGATION_EXAMPLES;
}
