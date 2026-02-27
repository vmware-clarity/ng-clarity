/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<div class="clr-row">
  <div class="clr-col-12 clr-col-sm-4">
    <div class="card">
      <div class="card-block">
        <div class="progress top">
          <progress value="..." max="100"></progress>
        </div>
        <h4 class="card-title">Card title</h4>
        <p class="card-text">...</p>
      </div>
      <div class="card-footer">
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
        <div class="progress">
          <progress value="..." max="100"></progress>
        </div>
        <a href="..." class="card-link">Click</a>
      </div>
    </div>
  </div>
</div>
`;

@Component({
  selector: 'clr-progress-bar-cards-demo',
  styleUrl: 'progress-bars.demo.scss',
  templateUrl: './progress-bar-cards.html',
  imports: [StackblitzExampleComponent],
})
export class ProgressBarCardsDemo {
  example = EXAMPLE;
}
