/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'clr-accordion-description, clr-step-description',
  template: `<ng-content></ng-content>`,
  host: { '[class.clr-accordion-description]': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrAccordionDescription {}
