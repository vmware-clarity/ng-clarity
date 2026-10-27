/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { HEADER_EXAMPLES } from '@clr/examples/header';

import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-header-demo-links',
  templateUrl: './header-links.demo.html',
  styleUrl: './headers.demo.scss',
  imports: [DocExampleComponent],
})
export class HeaderLinksDemo {
  readonly examples = HEADER_EXAMPLES;
}
