/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, input } from '@angular/core';
import { ClrIcon, ClrIconModule, ClrVerticalNavModule } from '@clr/angular';

@Component({
  selector: 'clr-collapsible-vertical-nav-demo',
  templateUrl: './collapsible-nav.html',
  styleUrl: '../vertical-nav.demo.scss',
  imports: [ClrVerticalNavModule, ClrIcon, ClrIconModule],
})
export class CollapsibleVerticalNavDemo {
  readonly demoHideIcons = input(false);
  readonly demoCollapsed = input(false);
}
