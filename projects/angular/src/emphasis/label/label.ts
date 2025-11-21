/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';

import { ClrBadge } from '../badge';

export enum ClrLabelColors {
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
  selector: 'clr-label',
  template: `@if (textContent) {
      <span class="text">{{ textContent }}</span>
    }

    @if (badgeText) {
      <clr-badge>{{ badgeText }}</clr-badge>
    }

    <ng-content></ng-content>`,
  host: {
    class: 'label',
    '[class.clickable]': 'clickable',
    '[class.disabled]': 'disabled',
    '[class]': 'colorClass',
  },
  imports: [ClrBadge],
})
export class ClrLabel {
  @Input('clrColor') color: ClrLabelColors | string = ClrLabelColors.None;
  @Input('clrBadgeText') badgeText = '';
  @Input('clrText') textContent = '';
  @Input('clrClickable') clickable = false;
  @Input('clrDisabled') disabled = false;

  get colorClass() {
    return this.color ? `label-${this.color}` : '';
  }
}
