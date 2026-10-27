/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrTimelineLayout, ClrTimelineModule, ClrTimelineStepState } from '@clr/angular';

@Component({
  selector: 'clr-timeline-horizontal-example',
  templateUrl: './horizontal.example.html',
  imports: [ClrTimelineModule],
})
export class TimelineHorizontalExample {
  readonly ClrTimelineLayout = ClrTimelineLayout;
  readonly ClrTimelineStepState = ClrTimelineStepState;
}
