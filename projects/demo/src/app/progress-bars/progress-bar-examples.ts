/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ProgBarExample } from './progbar-example';

@Component({
  selector: 'clr-progress-bar-examples-demo',
  styleUrls: ['progress-bars.demo.scss'],
  templateUrl: './progress-bar-examples.html',
  standalone: false,
})
export class ProgressBarExamplesDemo {
  examples: ProgBarExample[];

  constructor() {
    this.examples = [
      new ProgBarExample(),
      new ProgBarExample('labeled', 'Labeled', true),
      new ProgBarExample('progress-fade', 'Fade Out'),
    ];
  }
}
