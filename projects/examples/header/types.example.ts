/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClarityIcons, ClrDropdownModule, ClrIcon, cogIcon, userIcon, vmBugIcon } from '@clr/angular';

@Component({
  selector: 'clr-header-types-example',
  templateUrl: './types.example.html',
  styleUrl: './types.example.scss',
  imports: [ClrDropdownModule, ClrIcon],
})
export class HeaderTypesExample {
  constructor() {
    ClarityIcons.addIcons(vmBugIcon, cogIcon, userIcon);
  }
}
