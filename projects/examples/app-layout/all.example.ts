/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import {
  ClarityIcons,
  cloudIcon,
  ClrIcon,
  ClrVerticalNavModule,
  folderIcon,
  infoCircleIcon,
  vmBugIcon,
} from '@clr/angular';

@Component({
  selector: 'clr-app-layout-all-example',
  templateUrl: './all.example.html',
  imports: [ClrIcon, ClrVerticalNavModule],
})
export class AppLayoutAllExample {
  constructor() {
    ClarityIcons.addIcons(infoCircleIcon, vmBugIcon, cloudIcon, folderIcon);
  }
}
