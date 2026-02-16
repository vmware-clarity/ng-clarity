/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-app-layout-demo',
  templateUrl: './app-layout.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
})
export class AppLayoutDemo extends ClarityDocComponent {
  newLayout = true;

  constructor() {
    super('app-layout');
  }
}
