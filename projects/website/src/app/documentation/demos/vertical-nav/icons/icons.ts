/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, input } from '@angular/core';
import {
  blockIcon,
  boltIcon,
  bugIcon,
  ClarityIcons,
  ClrIcon,
  ClrIconModule,
  ClrVerticalNavModule,
  downloadCloudIcon,
  flameIcon,
  imageIcon,
  sadFaceIcon,
  shieldIcon,
  userIcon,
} from '@clr/angular';

@Component({
  selector: 'clr-vertical-nav-icons-demo',
  templateUrl: './icons.html',
  styleUrl: '../vertical-nav.demo.scss',
  imports: [ClrVerticalNavModule, ClrIcon, ClrIconModule],
})
export class VerticalNavIconsDemo {
  readonly demoHideIcons = input(false);
  readonly demoLongLabel = input(false);

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
