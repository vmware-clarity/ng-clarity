/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, Input, Optional, SkipSelf } from '@angular/core';

import { ClrAccordionContent } from './accordion-content';

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
   * Level of the accordion/stepper heading from 1 to 7.
   */
  @Input('clrAriaLevel') _ariaLevel: number;

  constructor(
    @SkipSelf()
    @Optional()
    private parent: ClrAccordionContent
  ) {
    console.log('clrAccordionTitle', parent);
  }

  get ariaLevel() {
    if (this._ariaLevel) {
      return this._ariaLevel;
    }

    return this.parent ? 4 : 3;
  }
}
