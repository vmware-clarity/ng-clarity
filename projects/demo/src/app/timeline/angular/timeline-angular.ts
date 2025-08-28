/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrTimelineLayout, ClrTimelineStepState } from '@clr/angular';

@Component({
  selector: 'clr-timeline-demo-angular',
  templateUrl: './timeline-angular.html',
  standalone: false,
})
export class TimelineAngularDemo {
  readonly verticalLayout = ClrTimelineLayout.VERTICAL;

  readonly stateNotStarted = ClrTimelineStepState.NOT_STARTED;
  readonly stateProcessing = ClrTimelineStepState.PROCESSING;
  readonly stateCurrent = ClrTimelineStepState.CURRENT;
  readonly stateError = ClrTimelineStepState.ERROR;
  readonly stateSuccess = ClrTimelineStepState.SUCCESS;
}
