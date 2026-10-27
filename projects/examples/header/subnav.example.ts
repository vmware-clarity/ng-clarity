/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClarityIcons, ClrIcon, cogIcon, vmBugIcon } from '@clr/angular';

@Component({
  selector: 'clr-header-subnav-example',
  templateUrl: './subnav.example.html',
  imports: [ClrIcon],
})
export class HeaderSubnavExample {
  constructor() {
    ClarityIcons.addIcons(vmBugIcon, cogIcon);
  }
}
