/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const EXAMPLE = `
<h4>Static Progress Bar</h4>
<div class="progress-static">
  <div class="progress-meter" data-value="16"></div>
</div>

<h4>Labeled, Static Progress Bar</h4>
<div class="progress-static labeled">
  <div class="progress-meter" data-value="87" data-displayval="87%"></div>
  <span>87%</span>
</div>

<h4>Red Static Progress Bar</h4>
<div class="progress-static danger">
  <div class="progress-meter" data-value="8"></div>
</div>

<h4>Green Static Progress Bar</h4>
<div class="progress-static success">
  <div class="progress-meter" data-value="80"></div>
</div>
`;

@Component({
  selector: 'clr-progress-bar-static-demo',
  styleUrl: 'progress-bars.demo.scss',
  templateUrl: './progress-bar-static.html',
  standalone: false,
})
export class ProgressBarStaticDemo {
  staticProgbarValue = 16;
  staticDangerValue = 8;
  staticSuccessValue = 80;
  staticLabeledProgbarValue = 87;

  example = EXAMPLE;

  getNewValue(): number {
    const random: number = Math.floor(Math.random() * 98) + 1;
    return parseInt(random + '', 10);
  }

  setNewValues(): void {
    this.staticProgbarValue = this.getNewValue();
    this.staticLabeledProgbarValue = this.getNewValue();
    this.staticDangerValue = this.getNewValue();
    this.staticSuccessValue = this.getNewValue();
  }
}
