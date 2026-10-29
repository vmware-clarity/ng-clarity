/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'clr-demo-ready-to-complete',
  standalone: true,
  template: `<div>Review your selections before finishing the wizard.</div>`,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ReadyToCompleteComponent {}
