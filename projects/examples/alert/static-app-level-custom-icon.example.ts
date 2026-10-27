/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClarityIcons, ClrAlertModule, ClrIcon, downloadIcon } from '@clr/angular';

@Component({
  selector: 'clr-alert-static-app-level-custom-icon-example',
  templateUrl: './static-app-level-custom-icon.example.html',
  imports: [ClrAlertModule, ClrIcon],
})
export class AlertStaticAppLevelCustomIconExample {
  constructor() {
    ClarityIcons.addIcons(downloadIcon);
  }
}
