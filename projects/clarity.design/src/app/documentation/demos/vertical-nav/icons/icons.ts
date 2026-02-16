/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';
import {
  blockIcon,
  boltIcon,
  bugIcon,
  ClarityIcons,
  downloadCloudIcon,
  flameIcon,
  imageIcon,
  sadFaceIcon,
  shieldIcon,
  userIcon,
} from '@cds/core/icon';

@Component({
  selector: 'clr-vertical-nav-icons-demo',
  templateUrl: './icons.html',
  styleUrl: '../vertical-nav.demo.scss',
  standalone: false,
})
export class VerticalNavIconsDemo {
  @Input() demoHideIcons = false;
  @Input() demoLongLabel = false;

  constructor() {
    ClarityIcons.addIcons(
      userIcon,
      flameIcon,
      downloadCloudIcon,
      boltIcon,
      bugIcon,
      blockIcon,
      shieldIcon,
      sadFaceIcon,
      imageIcon
    );
  }
}
