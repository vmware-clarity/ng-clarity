/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-vertical-nav-group-children',
  template: `<ng-content></ng-content>`,
  // Removed by `*clrIfExpanded` when the group closes: stays displayed while the group collapses.
  host: { 'animate.leave': 'clr-collapse-hold-leave' },
  standalone: false,
})
export class ClrVerticalNavGroupChildren {}
