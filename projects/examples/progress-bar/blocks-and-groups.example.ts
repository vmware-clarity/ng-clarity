/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'clr-progress-bar-blocks-and-groups-example',
  templateUrl: './blocks-and-groups.example.html',
  styleUrl: './blocks-and-groups.example.scss',
})
export class ProgressBarBlocksAndGroupsExample implements OnDestroy {
  inlineProgress = 10;
  inlineStaticProgbarValue = 25;
  staticDangerValue = 15;
  staticSuccessValue = 75;
  staticLabeledProgbarValue = 60;

  private inlineProgressTimerId: ReturnType<typeof setInterval> | undefined;

  setNewValues(): void {
    this.inlineStaticProgbarValue = this.getNewValue();
    this.staticLabeledProgbarValue = this.getNewValue();
    this.staticDangerValue = this.getNewValue();
    this.staticSuccessValue = this.getNewValue();
    this.runProgressBar();
  }

  ngOnDestroy(): void {
    this.stopProgressBar();
  }

  private runProgressBar(): void {
    this.stopProgressBar();
    this.inlineProgress = 0;
    this.inlineProgressTimerId = setInterval(() => {
      this.inlineProgress = Math.min(this.inlineProgress + Math.floor(Math.random() * 15) + 1, 100);

      if (this.inlineProgress === 100) {
        this.stopProgressBar();
      }
    }, 300);
  }

  private stopProgressBar(): void {
    clearInterval(this.inlineProgressTimerId);
    this.inlineProgressTimerId = undefined;
  }

  private getNewValue(): number {
    return Math.floor(Math.random() * 98) + 1;
  }
}
