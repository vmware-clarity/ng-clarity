/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'clr-accordion-title, clr-step-title',
  template: `<ng-content></ng-content>`,
  host: { '[class.clr-accordion-title]': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrAccordionTitle {}
