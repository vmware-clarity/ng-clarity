/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrCommonFormsModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const HTML_EXAMLPE = `
<div class="clr-row">
  <div class="clr-col-12 clr-col-sm-6">
    <div class="card">
      <div class="card-block">
        <div class="card-title">Card title</div>
        <p class="card-text">Here is a progress bar at the very top of a card.</p>
        <div class="progress-block">
          <label>Label</label>
          <div class="progress-static">
            <div class="progress-meter" [attr.data-value]="10"></div>
          </div>
        </div>
        <div class="progress-block">
          <label>Longer Label</label>
          <div class="progress-static">
            <div class="progress-meter" [attr.data-value]="75"></div>
          </div>
        </div>
        <div class="progress-block">
          <label>Really, Really, Really Long Label</label>
          <div class="progress success">
            <progress value="50" max="100" data-displayval="50%"></progress>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <div class="progress-static top">
          <div class="progress-meter" data-value="33"></div>
        </div>
        <a href="javascript://" class="card-link">Click</a>
      </div>
    </div>
  </div>
</div>
`;

@Component({
  selector: 'clr-progress-bar-inline-cards-demo',
  styleUrl: '../progress-bars/progress-bars.demo.scss',
  templateUrl: './progress-bar-inline-cards.html',
  imports: [ClrCommonFormsModule, StackblitzExampleComponent],
})
export class ProgressBarInlineCardsDemo {
  htmlExample = HTML_EXAMLPE;
}
