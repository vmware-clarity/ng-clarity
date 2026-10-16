/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'clr-step-content',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // `*clrIfExpanded` removes the content when the step closes: it stays displayed while the step collapses.
  host: { 'animate.leave': 'clr-collapse-hold-leave' },
  standalone: false,
})
export class ClrStepContent {}
