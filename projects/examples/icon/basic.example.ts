/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { bellIcon, ClarityIcons, ClrIcon, cogIcon, homeIcon, searchIcon, userIcon } from '@clr/angular';

@Component({
  selector: 'clr-icon-basic-example',
  templateUrl: './basic.example.html',
  imports: [ClrIcon],
})
export class IconBasicExample {
  constructor() {
    ClarityIcons.addIcons(homeIcon, cogIcon, userIcon, bellIcon, searchIcon);
  }
}
