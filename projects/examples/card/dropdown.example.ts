/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { angleIcon, ClarityIcons, ClrIcon } from '@clr/angular';

@Component({
  selector: 'clr-card-dropdown-example',
  templateUrl: './dropdown.example.html',
  imports: [ClrIcon],
})
export class CardDropdownExample {
  constructor() {
    ClarityIcons.addIcons(angleIcon);
  }
}
