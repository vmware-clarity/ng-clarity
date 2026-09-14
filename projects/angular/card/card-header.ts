/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import { ClrCommonStringsService } from '@clr/angular/utils';

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
  constructor(
    @Optional() protected readonly card: ClrCard,
    protected readonly commonStrings: ClrCommonStringsService
  ) {}
}
