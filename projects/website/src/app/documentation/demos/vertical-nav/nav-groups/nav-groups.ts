/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, input } from '@angular/core';
import { ClrIcon, ClrIconModule, ClrVerticalNavModule } from '@clr/angular';

@Component({
  selector: 'clr-vertical-nav-groups-demo',
  templateUrl: './nav-groups.html',
  styleUrl: '../vertical-nav.demo.scss',
  imports: [ClrVerticalNavModule, ClrIcon, ClrIconModule],
})
export class NavGroupsDemo {
  readonly demoHideIcons = input(false);
  readonly demoMixedNav = input(false);
  readonly demoMixedNavWithIcons = input(false);
  readonly demoExpandedGroup = input(false);
  readonly demoCollapsible = input(false);
  readonly demoLongLabel = input(false);
}
