/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgClass } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import {
  ClarityIcons,
  ClrIcon,
  ClrIconModule,
  cogIcon,
  downloadCloudIcon,
  ellipsisHorizontalIcon,
  installIcon,
  stepForward2Icon,
  successStandardIcon,
} from '@clr/angular';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

import { ProgBarExample } from './progbar-example';
import { ProgressBarExamplesDemo } from './progress-bar-examples';

@Component({
  selector: 'clr-progress-bar-story-demo',
  template: `
    <div class="story-message" style="margin-bottom: 0.5rem">
      @if (storyProgressBar.value <= 25) {
        <p>
          <clr-icon shape="cog" size="24"></clr-icon>
          Configuring the system
          <clr-icon shape="ellipsis-horizontal" size="24"></clr-icon>
        </p>
      }
      @if (storyProgressBar.value > 25 && storyProgressBar.value <= 50) {
        <p>
          <clr-icon shape="install" size="24"></clr-icon>
          Installing the system
          <clr-icon shape="ellipsis-horizontal" size="24"></clr-icon>
        </p>
      }
      @if (storyProgressBar.value > 50 && storyProgressBar.value <= 75) {
        <p>
          <clr-icon shape="download-cloud" size="24"></clr-icon>
          Updating the system
          <clr-icon shape="ellipsis-horizontal" size="24"></clr-icon>
        </p>
      }
      @if (storyProgressBar.value > 75 && storyProgressBar.value < 100) {
        <p>
          <clr-icon shape="step-forward-2" size="24"></clr-icon>
          Starting the system
          <clr-icon shape="ellipsis-horizontal" size="24"></clr-icon>
        </p>
      }
      @if (storyProgressBar.value == 100) {
        <p>
          <clr-icon shape="success-standard" size="24"></clr-icon>
          The process is done. The system is ready.
        </p>
      }
    </div>
    <div [ngClass]="storyProgressBar.cssClassnames()">
      <progress
        value="{{ storyProgressBar.value }}"
        max="100"
        [attr.data-displayval]="storyProgressBar.value + '%'"
      ></progress>
    </div>
  `,
  imports: [ClrIcon, ClrIconModule, NgClass, ProgressBarExamplesDemo],
})
export class ProgressBarStoryDemo {
  @HostBinding('style.width.%') width = 100;

  storyProgressBar: ProgBarExample;
  storyTime;

  constructor() {
    this.storyProgressBar = new ProgBarExample('', 'Progress example');
    this.storyTime = timer(7500, 7500).pipe(take(10));

    ClarityIcons.addIcons(
      cogIcon,
      ellipsisHorizontalIcon,
      installIcon,
      downloadCloudIcon,
      stepForward2Icon,
      successStandardIcon
    );
  }

  ngOnInit() {
    this.storyProgressBar.start();
    this.storyTime.subscribe(() => {
      this.tellStoryAgain();
    });
  }

  tellStoryAgain() {
    if (this.storyProgressBar.isFinished()) {
      this.storyProgressBar.start();
    }
  }
}
