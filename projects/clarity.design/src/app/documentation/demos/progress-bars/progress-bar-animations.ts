/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ProgBarExample } from './progbar-example';

const EXAMPLE = `
<h4>Fade Out</h4>
<div class="progress progress-fade">
  <progress max="100" value="0" data-displayval="0%"></progress>
</div>

<h4>Flash Then Fade</h4>
<div class="progress flash progress-fade">
  <progress max="100" value="0" data-displayval="0%"></progress>
</div>

<h4>Flash Red, No Fade</h4>
<div class="progress flash-danger">
  <progress max="100" value="0" data-displayval="0%"></progress>
</div>

<h4>Labeled With Success Flash And Fade</h4>
<div class="progress flash progress-fade labeled">
  <progress max="100" value="0" data-displayval="0%"></progress>
</div>
`;

@Component({
  selector: 'clr-progress-bar-animations-demo',
  styleUrl: 'progress-bars.demo.scss',
  templateUrl: './progress-bar-animations.html',
  standalone: false,
})
export class ProgressBarAnimationsDemo {
  example = EXAMPLE;
  examples: ProgBarExample[];

  constructor() {
    this.examples = [
      new ProgBarExample('progress-fade', 'Fade Out'),
      new ProgBarExample('flash progress-fade', 'Flash Then Fade'),
    ];
  }
}
