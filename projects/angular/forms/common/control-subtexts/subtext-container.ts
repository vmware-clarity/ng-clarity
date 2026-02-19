/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'clr-control-subtext-container',
  template: `
    @if (showHelper) {
      <div class="clr-subtext-wrapper">
        <ng-content select="clr-control-helper"></ng-content>
      </div>
    }
    @if (showInvalid) {
      <div class="clr-subtext-wrapper">
        <ng-content select="clr-control-error"></ng-content>
      </div>
    }
    @if (showValid) {
      <div class="clr-subtext-wrapper">
        <ng-content select="clr-control-success"></ng-content>
      </div>
    }
  `,
  standalone: false,
  host: {
    '[class.clr-control-subtext-container]': 'showHelper || showInvalid || showValid',
  },
})
export class ClrControlSubtextContainer {
  @Input() showHelper: boolean;
  @Input() showInvalid: boolean;
  @Input() showValid: boolean;
}
