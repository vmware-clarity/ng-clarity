/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const timelineStep = `
<li class="clr-timeline-step">
  <div class="clr-timeline-step-header">11:59 am</div>
  <cds-icon role="img" shape="circle" aria-label="Not started"></cds-icon>
  <div class="clr-timeline-step-body">...</div>
</li>
`;

const spinner = `<clr-spinner clrMedium aria-label="In progress">Fetching data</clr-spinner>`;

@Component({
  selector: 'clr-timeline-step-demo',
  templateUrl: './timeline-step.demo.html',
  standalone: false,
})
export class TimelineStepDemo {
  timelineStep = timelineStep;
  spinner = spinner;
}
