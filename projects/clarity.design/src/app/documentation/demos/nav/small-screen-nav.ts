/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { barsIcon, ClarityIcons } from '@cds/core/icon';
@Component({
  selector: 'clr-layout-small-screen-nav',
  templateUrl: './small-screen-nav.html',
  styleUrl: './layout.demo.scss',
  standalone: false,
})
export class SmallScreenNavDemo {
  constructor() {
    ClarityIcons.addIcons(barsIcon);
  }
}
