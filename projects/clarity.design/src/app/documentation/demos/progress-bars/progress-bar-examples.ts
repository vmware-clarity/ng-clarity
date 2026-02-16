/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ProgBarExample } from './progbar-example';

const EXAMPLE = `
<h4>Progress Bar</h4>
<div class="progress demo">
  <progress max="100" value="0" data-displayval="0%"></progress>
</div>

<h4>Labeled</h4>
<div class="progress labeled">
  <progress max="100" value="0" data-displayval="0%"></progress>
  <span></span>
</div>

<h4>Fade Out</h4>
<div class="progress progress-fade">
  <progress max="100" value="0" data-displayval="0%"></progress>
</div>
`;

@Component({
  selector: 'clr-progress-bar-examples-demo',
  styleUrl: 'progress-bars.demo.scss',
  templateUrl: './progress-bar-examples.html',
  standalone: false,
})
export class ProgressBarExamplesDemo {
  example = EXAMPLE;
  examples: ProgBarExample[];

  constructor() {
    this.examples = [
      new ProgBarExample(),
      new ProgBarExample('labeled', 'Labeled', true),
      new ProgBarExample('progress-fade', 'Fade Out'),
    ];
  }
}
