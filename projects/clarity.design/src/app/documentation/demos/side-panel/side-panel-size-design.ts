/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClarityIcons, resizeIcon } from '@cds/core/icon';

@Component({
  selector: 'clr-side-panel-size-design-demo',
  templateUrl: './side-panel-size-design.demo.html',
  styleUrl: './side-panel-size-design-demo.scss',
  standalone: false,
})
export class SidePanelSizeDesignDemo {
  // Booleans to open each example side panel
  small = false;
  medium = false;
  large = false;
  extraLarge = false;
  fullScreen = false;
  constructor() {
    ClarityIcons.addIcons(resizeIcon);
  }
}
