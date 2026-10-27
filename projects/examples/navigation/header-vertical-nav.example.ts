/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClarityIcons, ClrIcon, ClrVerticalNavModule, cogIcon, vmBugIcon } from '@clr/angular';

@Component({
  selector: 'clr-navigation-header-vertical-nav-example',
  templateUrl: './header-vertical-nav.example.html',
  imports: [ClrIcon, ClrVerticalNavModule],
})
export class NavigationHeaderVerticalNavExample {
  constructor() {
    ClarityIcons.addIcons(vmBugIcon, cogIcon);
  }
}
