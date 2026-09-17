/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HeadingLevel } from '@clr/angular/utils';

@Component({
  selector: 'clr-card-body-title',
  template: `<ng-content></ng-content>`,
  host: {
    '[class.card-title]': 'true',
    '[class.clr-card-body-title]': 'true',
    '[attr.role]': 'explicitHeadingLevel ? "heading" : null',
    '[attr.aria-level]': 'explicitHeadingLevel ? explicitHeadingLevel : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ClrCardBodyTitle {
  /**
   * Level of the card body title heading from 1 to 6.
   */
  @Input('clrHeadingLevel') explicitHeadingLevel: HeadingLevel;
}
