/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, Input, Optional } from '@angular/core';
import { ClrCommonStringsService, HeadingLevel } from '@clr/angular/utils';

import { ClrCard } from './card';

@Component({
  selector: 'clr-card-header',
  templateUrl: './card-header.html',
  host: {
    '[class.card-header]': 'true',
    '[class.clr-card-header]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ClrCardHeader {
  /**
   * Level of the card header heading from 1 to 6.
   */
  @Input('clrHeadingLevel') explicitHeadingLevel: HeadingLevel;

  constructor(
    @Optional() protected readonly card: ClrCard,
    protected readonly commonStrings: ClrCommonStringsService
  ) {}
}
