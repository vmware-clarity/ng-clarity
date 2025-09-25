/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrBadgeColors } from '../../../../angular/src/emphasis/badge';

@Component({
  selector: 'clr-badge-statuses-demo',
  templateUrl: './badge-statuses.demo.html',
  standalone: false,
})
export class BadgeStatusesDemo {
  protected readonly ClrBadgeColors = ClrBadgeColors;
}
