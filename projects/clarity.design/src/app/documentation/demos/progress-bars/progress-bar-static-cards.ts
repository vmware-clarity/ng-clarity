/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const EXAMPLE = `
<div class="clr-row">
  <div class="clr-col-12 clr-col-sm-4">
    <div class="card">
      <div class="card-block">
        <h4 class="card-title">Card title</h4>
        <p class="card-text">...</p>
      </div>
      <div class="card-footer">
        <div class="progress-static top">
          <div class="progress-meter" data-value="33"></div>
        </div>
        <a href="..." class="card-link">Click</a>
      </div>
    </div>
  </div>
  <div class="clr-col-12 clr-col-sm-4">
    <div class="card">
      <div class="card-block">
        <h4 class="card-title">Card title</h4>
        <p class="card-text">...</p>
      </div>
      <div class="card-footer">
        <div class="progress-static">
          <div class="progress-meter" data-value="77"></div>
        </div>
        <a href="..." class="card-link">Click</a>
      </div>
    </div>
  </div>
</div>
`;

@Component({
  selector: 'clr-progress-bar-static-cards-demo',
  styleUrl: 'progress-bars.demo.scss',
  templateUrl: './progress-bar-static-cards.html',
  standalone: false,
})
export class ProgressBarStaticCardsDemo {
  example = EXAMPLE;
}
