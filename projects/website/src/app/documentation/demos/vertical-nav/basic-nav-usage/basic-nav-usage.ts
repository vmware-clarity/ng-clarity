/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, input } from '@angular/core';
import { ClrIcon, ClrIconModule, ClrVerticalNavModule } from '@clr/angular';

@Component({
  selector: 'clr-basic-vertical-nav-usage-demo',
  templateUrl: './basic-nav-usage.html',
  styleUrl: '../vertical-nav.demo.scss',
  imports: [ClrIcon, ClrIconModule, ClrVerticalNavModule],
})
export class BasicNavUsage {
  readonly demoToggleDont = input(false);
}
