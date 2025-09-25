/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';

export enum ClrBadgeColors {
  Empty = '',
  Info = 'info',
  Warning = 'warning',
  Danger = 'danger',
  Success = 'success',
  Gray = 'gray',
  Blue = 'blue',
  LightBlue = 'light-blue',
  Orange = 'orange',
  Purple = 'purple',
}

@Component({
  selector: 'clr-badge',
  template: `<ng-content></ng-content>`,
  host: {
    class: 'badge',
    '[class]': 'colorClass',
  },
})
export class ClrBadge {
  @Input('clrColor') color: ClrBadgeColors | string = ClrBadgeColors.Empty;

  get colorClass() {
    return this.color ? `badge-${this.color}` : '';
  }
}
