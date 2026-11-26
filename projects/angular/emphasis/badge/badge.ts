/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { Type } from '@clr/angular/emphasis/common';

export enum ClrBadgeColors {
  None = '',
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
    '[class.outlined]': 'isOutlined',
    '[class]': 'colorClass',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrBadge {
  // Programmatic writes (e.g. through a ViewChild) must still render under OnPush.
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private _color: ClrBadgeColors | string = ClrBadgeColors.None;
  private _type: Type | string = Type.Solid;

  @Input('clrColor')
  get color(): ClrBadgeColors | string {
    return this._color;
  }
  set color(value: ClrBadgeColors | string) {
    this._color = value;
    this.changeDetectorRef.markForCheck();
  }
  @Input('clrType')
  get type(): Type | string {
    return this._type;
  }
  set type(value: Type | string) {
    this._type = value;
    this.changeDetectorRef.markForCheck();
  }
  get isOutlined() {
    return this.type === Type.Outlined;
  }

  get colorClass() {
    return this.color ? `badge-${this.color}` : '';
  }
}
