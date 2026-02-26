/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnDestroy } from '@angular/core';
import { ClrCommonFormsModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<h4>Inline Progress Bar</h4>
<div class="progress-block">
  <label>Simple Layout</label>
  <div class="progress">
    <progress value="..." max="100" data-displayval="...%"></progress>
  </div>
  <span>More text</span>
</div>

<div class="progress-block">
  <label>Complex Layout</label>
  <div class="progress-group">
    <div class="clr-row">
      <div class="clr-col-6">Left</div>
      <div class="clr-col-6 text-right">Right</div>
    </div>
    <div class="progress-static">
      <div class="progress-meter" data-value="..." data-displayval="...%"></div>
    </div>
    <div class="clr-row">
      <div class="clr-col-6">Left</div>
      <div class="clr-col-6 text-right">Right</div>
    </div>
  </div>
  <span>More text</span>
</div>

<h4>Labeled, Static Progress Bar</h4>
<div class="progress-block">
  <label>Complex Layout</label>
  <div class="progress-group">
    <div class="clr-row">
      <div class="clr-col-6">Left</div>
      <div class="clr-col-6 text-right">Right</div>
    </div>
    <div class="progress-static labeled danger">
      <div class="progress-meter" data-value="..." data-displayval="...%"></div>
      <span>...%</span>
    </div>
    <div class="clr-row">
      <div class="clr-col-6">Left</div>
      <div class="clr-col-6 text-right">Right</div>
    </div>
  </div>
</div>

<h4>Stacked Progress Bars</h4>
<div class="progress-block">
  <label>Stacked Layout</label>
  <div class="progress-group">
    <div class="progress-static labeled danger">
      <div class="progress-meter" data-value="..." data-displayval="...%"></div>
      <span>...%</span>
    </div>
    <div class="progress-static labeled">
      <div class="progress-meter" data-value="..." data-displayval="...%"></div>
      <span>...%</span>
    </div>
    <div class="progress-static labeled success">
      <div class="progress-meter" data-value="..." data-displayval="...%"></div>
      <span>...%</span>
    </div>
  </div>
</div>

<div class="progress-block">
  <label>Stacked (but resized) Layout</label>
  <div class="progress-group" style="font-size: 1px">
    <div class="progress-static danger">
      <div class="progress-meter" data-value="..." data-displayval="...%"></div>
      <span>...%</span>
    </div>
    <div class="progress-static">
      <div class="progress-meter" data-value="..." data-displayval="...%"></div>
      <span>...%</span>
    </div>
    <div class="progress-static success">
      <div class="progress-meter" data-value="..." data-displayval="...%"></div>
      <span>...%</span>
    </div>
  </div>
</div>
`;

@Component({
  selector: 'clr-progress-bar-inline-demo',
  styleUrl: 'progress-bars.demo.scss',
  templateUrl: './progress-bar-inline.html',
  imports: [ClrCommonFormsModule, StackblitzExampleComponent],
})
export class ProgressBarInlineDemo implements OnDestroy {
  inlineProgress = 10;
  inlineProgressTimerId: any = -1;

  inlineStaticProgbarValue = 25;
  staticDangerValue = 15;
  staticSuccessValue = 75;
  staticLabeledProgbarValue = 60;

  example = EXAMPLE;

  getNewValue(): number {
    const random: number = Math.floor(Math.random() * 98) + 1;
    return parseInt(random + '', 10);
  }

  setNewValues(disableBar?: boolean): void {
    this.inlineStaticProgbarValue = this.getNewValue();
    this.staticLabeledProgbarValue = this.getNewValue();
    this.staticDangerValue = this.getNewValue();
    this.staticSuccessValue = this.getNewValue();
    if (!disableBar) {
      this.runProgressBar();
    }
  }

  stopProgressBar(): void {
    if (this.inlineProgressTimerId > -1) {
      clearInterval(this.inlineProgressTimerId);
      this.inlineProgressTimerId = -1;
      this.inlineProgress = 0;
    }
  }

  runProgressBar(): void {
    this.stopProgressBar();
    this.inlineProgressTimerId = setInterval(() => {
      const oldProgressValue: number = this.inlineProgress;
      let increment: number = Math.floor(Math.random() * 15) + 1;
      increment = parseInt(increment + '', 10);
      let newProgressValue: number = oldProgressValue + increment;

      newProgressValue = newProgressValue > 99 ? 100 : newProgressValue;

      this.inlineProgress = newProgressValue;

      if (newProgressValue > 99) {
        this.stopProgressBar();
      }
    }, 300);
  }

  ngOnDestroy(): void {
    this.stopProgressBar();
  }
}
