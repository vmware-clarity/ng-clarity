/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';

import { ClrIconModule } from '../../icon';
import { ClrBadge } from '../badge';

export enum ClrLabelColors {
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
  selector: 'clr-label',
  template: ` @if (textContent) {
      <span class="text">{{ textContent }}</span>
    }

    @if (badgeContent) {
      <clr-badge>{{ badgeContent }}</clr-badge>
    }

    <ng-content></ng-content>`,
  host: {
    class: 'label',
    '[class.clickable]': 'clickable',
    '[class.disabled]': 'disabled',
    '[class]': 'colorClass',
  },
  imports: [ClrBadge, ClrIconModule],
})
export class ClrLabel {
  @Input('clrColor') color: ClrLabelColors | string = ClrLabelColors.Empty;
  @Input('clrBadgeContent') badgeContent = '';
  @Input('clrText') textContent = '';
  @Input('clrClickable') clickable = false;
  @Input('clrDisabled') disabled = false;

  get colorClass() {
    return this.color ? `label-${this.color}` : '';
  }
}
