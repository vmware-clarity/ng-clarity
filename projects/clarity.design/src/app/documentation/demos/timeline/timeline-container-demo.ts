/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const vertical = `
<ul class="clr-timeline clr-timeline-vertical">
  ...
</ul>
`;

const horizontal = `
<ul class="clr-timeline">
  ...
</ul>
`;

@Component({
  selector: 'clr-timeline-container-demo',
  templateUrl: './timeline-container.demo.html',
  standalone: false,
})
export class TimelineContainerDemo {
  vertical = vertical;
  horizontal = horizontal;
}
