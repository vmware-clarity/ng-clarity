/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { AlertIconAndTypesService } from './providers/icon-and-types.service';

@Component({
  selector: 'clr-alert-item',
  template: `
    <div class="alert-icon-wrapper">
      @if (iconService.alertIconShape === 'loading') {
      <clr-spinner class="alert-spinner" clrInline></clr-spinner>
      } @if (iconService.alertIconShape !== 'loading') {
      <cds-icon
        class="alert-icon"
        role="img"
        [attr.shape]="iconService.alertIconShape"
        [attr.aria-label]="iconService.alertIconTitle"
      ></cds-icon>
      }
    </div>
    <ng-content></ng-content>
  `,
  host: { class: 'alert-item' },
  standalone: false,
})
export class ClrAlertItem {
  constructor(public iconService: AlertIconAndTypesService) {}
}
