/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnDestroy } from '@angular/core';

import { ProgressSimulation } from './progress-simulation/progress-simulation';

@Component({
  selector: 'clr-progress-bar-colors-example',
  templateUrl: './colors.example.html',
})
export class ProgressBarColorsExample implements OnDestroy {
  readonly progressBars = [
    new ProgressSimulation('Normal'),
    new ProgressSimulation('Warning', 'warning'),
    new ProgressSimulation('Success', 'success'),
    new ProgressSimulation('Danger', 'danger'),
  ];

  ngOnDestroy(): void {
    this.progressBars.forEach(progress => progress.stop());
  }
}
