/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'clr-accordion-title, clr-step-title',
  template: `<ng-content></ng-content>`,
  host: {
    '[class.clr-accordion-title]': 'true',
    '[attr.aria-level]': 'ariaLevel',
    role: 'heading',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrAccordionTitle {
  /**
   * Level of the accordion/stepper heading from 1 to 7. Default is 3.
   */
  @Input('clrAccordionLevel') ariaLevel = 3;
}
