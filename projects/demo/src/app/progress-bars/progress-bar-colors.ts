/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ProgBarExample } from './progbar-example';

@Component({
  selector: 'clr-progress-bar-colors-demo',
  styleUrls: ['progress-bars.demo.scss'],
  templateUrl: './progress-bar-colors.html',
  standalone: false,
})
export class ProgressBarColorsDemo {
  colorTypes: ProgBarExample[];

  constructor() {
    this.colorTypes = [
      new ProgBarExample('', 'Normal'),
      new ProgBarExample('success', 'Success'),
      new ProgBarExample('warning', 'Warning'),
      new ProgBarExample('danger', 'Danger'),
    ];
  }
}
