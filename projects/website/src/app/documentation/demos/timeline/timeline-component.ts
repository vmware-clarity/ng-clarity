/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-timeline-component',
  templateUrl: './timeline-component.html',
  imports: [],
})
export class TimelineComponentDemo {
  props = [
    {
      name: '[clrLayout]',
      values: 'ClrTimelineLayout',
      defaultValue: 'HORIZONTAL',
      description: 'Define the timeline orientation',
    },
  ];

  stepProps = [
    {
      name: '[clrState]',
      values: 'ClrTimelineStepState',
      defaultValue: 'NOT_STARTED',
      description: 'Define the symbol (icon or spinner) to use to decorate the step',
    },
  ];
}
