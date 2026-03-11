/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, input } from '@angular/core';
import { ClrCommonFormsModule, ClrVerticalNavModule } from '@clr/angular';

@Component({
  selector: 'clr-just-navs-demo',
  templateUrl: './just-navs.html',
  styleUrl: '../vertical-nav.demo.scss',
  imports: [ClrVerticalNavModule, ClrCommonFormsModule],
})
export class JustNavsDemo {
  readonly demoWithDividers = input(false);
  readonly demoWithHeadersAndDividers = input(false);
  readonly demoLongLabel = input(false);
}
