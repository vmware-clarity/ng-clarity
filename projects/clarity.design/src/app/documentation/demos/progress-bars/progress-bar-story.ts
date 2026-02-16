/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, HostBinding } from '@angular/core';
import {
  ClarityIcons,
  cogIcon,
  downloadCloudIcon,
  ellipsisHorizontalIcon,
  installIcon,
  stepForward2Icon,
  successStandardIcon,
} from '@cds/core/icon';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

import { ProgBarExample } from './progbar-example';

@Component({
  selector: 'clr-progress-bar-story-demo',
  template: `
    <div class="story-message" style="margin-bottom: 0.5rem">
      <p *ngIf="storyProgressBar.value <= 25">
        <cds-icon shape="cog" size="24"></cds-icon>
        Configuring the system
        <cds-icon shape="ellipsis-horizontal" size="24"></cds-icon>
      </p>
      <p *ngIf="storyProgressBar.value > 25 && storyProgressBar.value <= 50">
        <cds-icon shape="install" size="24"></cds-icon>
        Installing the system
        <cds-icon shape="ellipsis-horizontal" size="24"></cds-icon>
      </p>
      <p *ngIf="storyProgressBar.value > 50 && storyProgressBar.value <= 75">
        <cds-icon shape="download-cloud" size="24"></cds-icon>
        Updating the system
        <cds-icon shape="ellipsis-horizontal" size="24"></cds-icon>
      </p>
      <p *ngIf="storyProgressBar.value > 75 && storyProgressBar.value < 100">
        <cds-icon shape="step-forward-2" size="24"></cds-icon>
        Starting the system
        <cds-icon shape="ellipsis-horizontal" size="24"></cds-icon>
      </p>
      <p *ngIf="storyProgressBar.value == 100">
        <cds-icon shape="success-standard" size="24"></cds-icon>
        The process is done. The system is ready.
      </p>
    </div>
    <div [ngClass]="storyProgressBar.cssClassnames()">
      <progress
        value="{{ storyProgressBar.value }}"
        max="100"
        [attr.data-displayval]="storyProgressBar.value + '%'"
      ></progress>
    </div>
  `,
  standalone: false,
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
