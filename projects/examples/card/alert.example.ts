/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClarityIcons, ClrIcon, exclamationTriangleIcon, timesIcon } from '@clr/angular';

@Component({
  selector: 'clr-card-alert-example',
  templateUrl: './alert.example.html',
  styleUrl: './alert.example.scss',
  imports: [ClrIcon],
})
export class CardAlertExample {
  constructor() {
    ClarityIcons.addIcons(exclamationTriangleIcon, timesIcon);
  }
}
